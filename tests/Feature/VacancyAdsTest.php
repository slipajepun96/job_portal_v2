<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VacancyAdsTest extends TestCase
{
    use RefreshDatabase;

    private function fields(array $overrides = []): array
    {
        return array_merge([
            'vacancies_title' => 'Kerani',
            'vacancies_location' => 'Raub',
            'vacancies_description' => '',
            'start_date' => '2026-12-01 08:00',
            'end_date' => '2026-12-31 17:00',
            'ads_link' => '',
        ], $overrides);
    }

    public function test_vacancy_needs_a_link_or_a_pdf(): void
    {
        $this->actingAs(User::factory()->create(['designation' => 'Perekrut']))
            ->post(route('vacancy.save'), $this->fields())
            ->assertSessionHasErrors(['ads_link', 'ads_pdf']);
    }

    public function test_create_with_pdf_only_and_serve_it_publicly(): void
    {
        Storage::fake('local');

        $this->actingAs(User::factory()->create(['designation' => 'Perekrut']))
            ->post(route('vacancy.save'), $this->fields(['ads_pdf' => UploadedFile::fake()->create('iklan.pdf', 100, 'application/pdf')]))
            ->assertSessionHasNoErrors();

        $vacancy = Vacancy::first();
        $this->assertNull($vacancy->ads_link);
        Storage::disk('local')->assertExists($vacancy->ads_pdf);

        auth()->logout();
        $this->get(route('vacancy.ads', $vacancy->id))->assertOk()->assertHeader('Content-Type', 'application/pdf');
    }

    public function test_edit_existing_vacancy_adds_replaces_and_removes_pdf(): void
    {
        Storage::fake('local');
        $user = User::factory()->create(['designation' => 'Perekrut']);
        $vacancy = Vacancy::create($this->fields(['ads_link' => 'https://example.com/ad']));

        // Edit fields and add a PDF
        $this->actingAs($user)->post(route('vacancy.update', $vacancy->id), $this->fields([
            'vacancies_title' => 'Kerani Akaun',
            'ads_link' => 'https://example.com/ad',
            'ads_pdf' => UploadedFile::fake()->create('a.pdf', 100, 'application/pdf'),
        ]))->assertSessionHasNoErrors();
        $vacancy->refresh();
        $this->assertSame('Kerani Akaun', $vacancy->vacancies_title);
        $first = $vacancy->ads_pdf;
        Storage::disk('local')->assertExists($first);

        // Keeping the stored PDF: link can now be cleared
        $this->post(route('vacancy.update', $vacancy->id), $this->fields())->assertSessionHasNoErrors();
        $vacancy->refresh();
        $this->assertNull($vacancy->ads_link);
        $this->assertSame($first, $vacancy->ads_pdf);

        // Replace PDF: old file deleted
        $this->post(route('vacancy.update', $vacancy->id), $this->fields([
            'ads_pdf' => UploadedFile::fake()->create('b.pdf', 100, 'application/pdf'),
        ]))->assertSessionHasNoErrors();
        $vacancy->refresh();
        Storage::disk('local')->assertMissing($first);

        // Removing the PDF with no link left is rejected
        $this->post(route('vacancy.update', $vacancy->id), $this->fields(['remove_ads_pdf' => '1']))
            ->assertSessionHasErrors('ads_link');

        // Removing it while adding a link works
        $this->post(route('vacancy.update', $vacancy->id), $this->fields([
            'remove_ads_pdf' => '1', 'ads_link' => 'https://example.com/new',
        ]))->assertSessionHasNoErrors();
        $this->assertNull($vacancy->fresh()->ads_pdf);
    }

    public function test_non_pdf_rejected(): void
    {
        $this->actingAs(User::factory()->create(['designation' => 'Perekrut']))
            ->post(route('vacancy.save'), $this->fields(['ads_pdf' => UploadedFile::fake()->image('x.png')]))
            ->assertSessionHasErrors('ads_pdf');
    }
}
