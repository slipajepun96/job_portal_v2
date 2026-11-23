<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Vacancy;
use App\Models\Application;
use App\Jobs\SummariseVacancyApplications;


class DashboardController extends Controller
{
    public function dashboard()
    {
        $vacancies = Vacancy::all();
        $applications = Application::all();
        return Inertia::render('Dashboard',[
            'vacancies' => $vacancies,
            'applications' => $applications,  
        ]);
    }

    public function viewApplicantList($id): Response
    {
        // dd('success');
        $applications = Application::where('vacancy_uuid', $id)->get();
        $vacancies = Vacancy::all();
        // dd($applications);
        return Inertia::render('ApplicationReceived/ApplicationReceivedIndex', [
            'applications' => $applications,
            'vacancies' => $vacancies,
            'vacancy' => Vacancy::findOrFail($id)->makeVisible(['ai_summary', 'ai_summary_status', 'ai_summary_error', 'ai_summarized_at']),
            'backRoute'=>"dashboard",
        ]);
    }

    public function summariseApplicants($id): RedirectResponse
    {
        $vacancy = Vacancy::findOrFail($id);

        if ($vacancy->ai_summary_status !== 'processing') {
            $vacancy->update(['ai_summary_status' => 'processing', 'ai_summary_error' => null]);
            SummariseVacancyApplications::dispatch($vacancy->id);
        }

        return Redirect::route('viewApplicantList', $vacancy->id);
    }

    public function aboutUs()
    {
        return Inertia::render('AboutUs');
    }

}
