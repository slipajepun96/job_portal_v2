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
use App\Models\Application;
use App\Models\Vacancy;
use Spatie\LaravelPdf\Facades\Pdf;
use function Spatie\LaravelPdf\Support\pdf;
use Spatie\LaravelPdf\Enums\Format;
use Illuminate\Support\Facades\Storage;

class ApplicationController extends Controller
{
    public function applicationIndex() :Response
    {
        $vacancies = Vacancy::where('start_date','<=',now())->where('end_date','>=',now())->get();
        return Inertia::render('Application/ApplicationIndex', [
            'vacancies' => $vacancies
        ]);
    }

    public function saveApplication(Request $request): RedirectResponse
    {
       $validated = $request->validate([
            'name' => 'required|string|max:255',
            'ic_number' => 'required|string|max:255',
            'age' => 'required|string|max:255',
            'education' => 'required|array|max:255',
            "employers" => 'nullable|array|max:255',
            "familyMembers" => 'nullable|array|max:255',
            "medical_condition" => 'required|string',
            "dateOfBirth" => 'required|string|max:255',
            "gender" => 'required|string|max:255',
            "marital_status" => 'required|string|max:255',
            "ethnicity" => 'required|string|max:255',
            "children_num" => 'nullable|string',
            "address" => 'required|string|max:255',
            "address_postal" => 'nullable|string',
            "no_phone" => 'required|string|max:255',
            "email" => 'required|string|max:255',
            "phone_home" => 'nullable|string',
            "expected_salary" => 'required|string|max:255',  
            "start_date" => 'required|string|max:255',
            "salary" => 'nullable|string|max:255',            
            "allowance" => 'nullable|string',            
            "report_to" => 'nullable|string|max:255',
            "report_count" => 'nullable|string|max:255',
            "notice_period" => 'nullable|string|max:255',
            "language_malay" => 'required|string|max:255',
            "language_english" => 'required|string|max:255',
            "language" => 'nullable|string',
            "other_language" => 'nullable|string',
            "crime_charge" => 'required|string|max:255',
            "bankruptcy" => 'required|string|max:255',
            "business_involvement" => 'required|string|max:255',
            "license" => 'required|string|max:255',
            "smoker" => 'required|string|max:255',
            "drinker" => 'required|string|max:255',
            "physical_disability" => 'required|string',
            "pregnancy_status" => 'nullable|string',
            "achievement" => 'required|string|max:255',
            "reference_name_1" => 'required|string|max:255',
            "reference_relationship_1" => 'required|string|max:255',
            "reference_phone_1" => 'required|string|max:255',
            "reference_name_2" => 'nullable|string|max:255',
            "reference_phone_2" => 'nullable|string|max:255',
            "reference_company_2" => 'nullable|string|max:255',
            "reference_position_2" => 'nullable|string|max:255',
            "resume" => 'nullable|file|mimes:png,jpg,jpeg|max:2048',
            'vacancy_uuid' => 'required',
        ]);

            if ($request->hasFile('resume')) 
                {
                    // if ($vendor->resume) {
                    //     Storage::disk('local')->delete($vendor->resume);
                    // }
                    $validated['resume'] = $request->file('resume')
                        ->store('application/resume', 'local');
                }
                    
        $application_snapshot_json = json_encode($validated);
        $application= new application();
        // $application= json_encode($application_snapshot_json->application_snapshot);
        $application->vacancy_uuid = $validated['vacancy_uuid'];
        $application->application_snapshot = $application_snapshot_json;
        $application->candidate_nric = $validated['ic_number'];
        $application->save();
        
        return Redirect::route('welcome');
    }

    public function applicationReceivedIndex() :Response
    {
        $applications = Application::all();
        $vacancies = Vacancy::all();
        return Inertia::render('ApplicationReceived/ApplicationReceivedIndex', [
            'applications' => $applications,
            'vacancies' => $vacancies,
        ]);
    }

    //papar 
    public function viewApplicationReceived($id): Response
    {
        $application = Application::findOrFail($id);
        return Inertia::render('ApplicationReceived/ViewApplicationReceived', [
            'application' => $application,
        ]);
    }

    public function applicationPdf($id)
    {
        // dd($id);
        $vacancy_uuid = "";
        $application = Application::findOrFail($id);
        $application_snapshot = json_decode($application->application_snapshot, true);
        // $vacancy_name = Vacancy::findOrFail($application->vacancy_uuid)->value('vacancies_title');
        $vacancy = Vacancy::where('id', $application->vacancy_uuid)->firstOrFail();
        $vacancy_name = $vacancy->vacancies_title;  
        // dd($vacancy_name);  
        // dd($application_snapshot);
        return pdf()->view('testpdf', ['application' => $application, 'application_snapshot' => $application_snapshot, 'vacancy_name' => $vacancy_name])
        // ->format(Format::A4)
        ->download('job_certificate.pdf');
    }
    
    //contoh test pdf
    // public function applicationPdftest()
    // {
    //     $application = Application::first();
    //     // dd($application);
    //     $vacancy_name = Vacancy::findOrFail($application->vacancy_uuid)->value('vacancies_title');
    //     // dd($vacancy_name);
    //     $application_snapshot = json_decode($application->application_snapshot, true);
    //     // dd($application_snapshot['familyMembers']);
    //     return view('testpdf', ['application' => $application, 'application_snapshot' => $application_snapshot], ['vacancy_name' => $vacancy_name]);
    //     return pdf()->view('testpdf', ['application' => $application, 'application_snapshot' => $application_snapshot])
    //     // ->format(Format::A4)
    //     ->download('vendor_certificate.pdf');
    // }

    //padam
    public function deleteApplication(Request $requestd):  RedirectResponse
    {
        // dd($request->all());
        Application::findOrFail($requestd->id)->delete();
        
        return Redirect::route('applicationReceived')->with('success', 'Vacancy deleted successfully.');

         
    }

    public function downloadApplicationAttacthment($id)
    {
        $application = Application::findOrFail($id);
        $application_snapshot = json_decode($application->application_snapshot, true);
        $resume = $application_snapshot['resume'];
       
        return Storage::disk('local')->download($resume, 'attachment.pdf');
    }

    public function applicationAttachment($id)
    {
        $application = Application::findOrFail($id);
        $application_snapshot = json_decode($application->application_snapshot, true);
        $resume = $application_snapshot['resume'];
       
        return Storage::disk('local')->response($resume);
    }
}
