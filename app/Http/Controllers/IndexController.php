<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vacancy;
use Inertia\Inertia;
use Inertia\Response; 

class IndexController extends Controller
{
    public function welcome(): Response
    {
        $vacancies = Vacancy::open()->orderBy('end_date')->get();
        // dd("test");
        // dd($vacancy);
        return Inertia::render('Welcome', [
            'vacancies' => $vacancies,
            'success' => session('success'),    
        ]);
    }
}
