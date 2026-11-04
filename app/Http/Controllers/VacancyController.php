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
        $validated = $request->validate([
            'vacancies_title' => 'required|string|max:255',
            'vacancies_location' => 'required|string|max:255',
            'vacancies_description' => 'nullable|string',
            'start_date' => 'required|date_format:Y-m-d H:i',
            'end_date' => 'required|date_format:Y-m-d H:i|after:start_date',
        ], [
            'start_date.required' => 'Sila pilih tarikh dan masa mula.',
            'end_date.required' => 'Sila pilih tarikh dan masa tutup.',
            'end_date.after' => 'Tarikh dan masa tutup mesti selepas tarikh dan masa mula.',
            'ads_link' => 'required|url', 
        ]);
        // dd($validated);
        $vacancy = new Vacancy();
        $vacancy->vacancies_title = $validated['vacancies_title'];
        $vacancy->vacancies_location = $validated['vacancies_location'];
        $vacancy->vacancies_description = $validated['vacancies_description'];
        $vacancy->start_date = $validated['start_date'];
        $vacancy->end_date = $validated['end_date'];
        $vacancy->ads_link = $validated['ads_link'];
        $vacancy->save();

        return Redirect::route('vacancy');
    }

    public function deleteVacancy(Request $requestd): RedirectResponse
    {
        // dd($request->all());
        Vacancy::findOrFail($requestd->id)->delete();
        
        return Redirect::route('vacancy')->with('success', 'Vacancy deleted successfully.');

         
    }
}
