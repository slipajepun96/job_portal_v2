<?php

namespace App\Jobs;

use App\Models\Vacancy;
use App\Services\VacancyAiSummariser;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class SummariseVacancyApplications implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 1200;

    public function __construct(public string $vacancyId)
    {
    }

    public function handle(VacancyAiSummariser $summariser): void
    {
        $vacancy = Vacancy::findOrFail($this->vacancyId);

        $vacancy->update([
            'ai_summary' => $summariser->summarise($vacancy),
            'ai_summary_status' => 'done',
            'ai_summary_error' => null,
            'ai_summarized_at' => now(),
        ]);
    }

    public function failed(?Throwable $e): void
    {
        Log::error('Vacancy AI summary failed', ['vacancy' => $this->vacancyId, 'error' => $e?->getMessage()]);

        Vacancy::whereKey($this->vacancyId)->update([
            'ai_summary_status' => 'failed',
            'ai_summary_error' => mb_substr($e?->getMessage() ?? 'Ralat tidak diketahui', 0, 500),
        ]);
    }
}
