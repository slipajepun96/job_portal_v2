<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Vacancy;
use Illuminate\Support\Facades\Storage;

class VacancyController extends Controller
{
    public function vacancyIndex(): Response
    {

        $vacancy = Vacancy::all();
        // dd("test");
        // dd($vacancy);
        return Inertia::render('Vacancy/VacancyIndex', [
            'vacancy' => $vacancy,
            'success' => session('success'),    
        ]);
    }  
    
    public function saveVacancy(Request $request): RedirectResponse
    {
    //    dd($request->all());
        $validated = $this->validateVacancy($request);
        // dd($validated);
        $vacancy = new Vacancy();
        $vacancy->vacancies_title = $validated['vacancies_title'];
        $vacancy->vacancies_location = $validated['vacancies_location'];
        $vacancy->vacancies_description = $validated['vacancies_description'] ?? null;
        $vacancy->start_date = $validated['start_date'];
        $vacancy->end_date = $validated['end_date'];
        $vacancy->ads_link = $validated['ads_link'] ?? null;
        if ($request->hasFile('ads_pdf')) {
            $vacancy->ads_pdf = $request->file('ads_pdf')->store('vacancy/ads', 'local');
        }
        $vacancy->save();

        return Redirect::route('vacancy')->with('success', 'Kerja kosong berjaya ditambah.');
    }

    public function updateVacancy(Request $request, $id): RedirectResponse
    {
        $vacancy = Vacancy::findOrFail($id);
        $removePdf = $request->boolean('remove_ads_pdf');
        $keepsPdf = $vacancy->ads_pdf && ! $removePdf;

        $validated = $this->validateVacancy($request, $keepsPdf);

        $vacancy->fill([
            'vacancies_title' => $validated['vacancies_title'],
            'vacancies_location' => $validated['vacancies_location'],
            'vacancies_description' => $validated['vacancies_description'] ?? null,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'ads_link' => $validated['ads_link'] ?? null,
        ]);

        if ($request->hasFile('ads_pdf') || $removePdf) {
            if ($vacancy->ads_pdf) {
                Storage::disk('local')->delete($vacancy->ads_pdf);
            }
            $vacancy->ads_pdf = $request->hasFile('ads_pdf')
                ? $request->file('ads_pdf')->store('vacancy/ads', 'local')
                : null;
        }

        $vacancy->save();

        return Redirect::route('vacancy')->with('success', 'Kerja kosong berjaya dikemas kini.');
    }

    /**
     * A vacancy needs an advert link, an uploaded PDF, or both.
     * $hasStoredPdf: an existing PDF is kept, so neither is required in the request.
     */
    private function validateVacancy(Request $request, bool $hasStoredPdf = false): array
    {
        $needAd = $hasStoredPdf ? 'nullable' : 'required_without:ads_pdf';
        $needAdPdf = $hasStoredPdf ? 'nullable' : 'required_without:ads_link';

        return $request->validate([
            'vacancies_title' => 'required|string|max:255',
            'vacancies_location' => 'required|string|max:255',
            'vacancies_description' => 'nullable|string',
            'start_date' => 'required|date_format:Y-m-d H:i',
            'end_date' => 'required|date_format:Y-m-d H:i|after:start_date',
            'ads_link' => ['nullable', 'url', $needAd],
            'ads_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:10240', $needAdPdf],
            'remove_ads_pdf' => 'nullable|boolean',
        ], [
            'start_date.required' => 'Sila pilih tarikh dan masa mula.',
            'end_date.required' => 'Sila pilih tarikh dan masa tutup.',
            'end_date.after' => 'Tarikh dan masa tutup mesti selepas tarikh dan masa mula.',
            'ads_link.required_without' => 'Sila masukkan pautan iklan atau muat naik PDF iklan.',
            'ads_pdf.required_without' => 'Sila masukkan pautan iklan atau muat naik PDF iklan.',
            'ads_pdf.mimes' => 'Iklan mesti dalam format PDF.',
            'ads_pdf.max' => 'Saiz PDF iklan tidak boleh melebihi 10MB.',
            'ads_pdf.uploaded' => 'PDF gagal dimuat naik. Saiz fail mungkin melebihi had pelayan.',
        ]);
    }

    public function deleteVacancy(Request $requestd): RedirectResponse
    {
        // dd($request->all());
        $vacancy = Vacancy::findOrFail($requestd->id);
        if ($vacancy->ads_pdf) {
            Storage::disk('local')->delete($vacancy->ads_pdf);
        }
        $vacancy->delete();
        
        return Redirect::route('vacancy')->with('success', 'Vacancy deleted successfully.');

         
    }

    /** Public: applicants open the advert PDF from the homepage. */
    public function showAdsPdf($id)
    {
        $vacancy = Vacancy::findOrFail($id);
        abort_unless($vacancy->ads_pdf && Storage::disk('local')->exists($vacancy->ads_pdf), 404);

        return Storage::disk('local')->response(
            $vacancy->ads_pdf,
            'Iklan - ' . $vacancy->vacancies_title . '.pdf',
            ['Content-Type' => 'application/pdf'],
        );
    }
}
