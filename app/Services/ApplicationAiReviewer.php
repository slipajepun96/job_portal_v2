<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Vacancy;

/**
 * Asks Claude to assess one application against its vacancy advertisement.
 */
class ApplicationAiReviewer
{
    private const SYSTEM_PROMPT = <<<'PROMPT'
You are an assistant helping a recruiter screen job applications. You receive a job vacancy
(title, location, description and a link to the full advertisement) and the job-relevant parts
of one applicant's form. The advertisement itself is usually attached as a PDF or image. If it is
not attached, use the web_fetch tool once to read the link. If neither works, work from the title
and description and say so.

Assess how well the applicant fits the stated requirements.
PROMPT;

    public function __construct(private ClaudeReviewSupport $support)
    {
    }

    /**
     * @return array<string, mixed> the structured review
     */
    public function review(Application $application): array
    {
        $vacancy = Vacancy::findOrFail($application->vacancy_uuid);

        $text = "## Jawatan kosong\n"
            . "Jawatan: {$vacancy->vacancies_title}\n"
            . "Lokasi: {$vacancy->vacancies_location}\n"
            . 'Keterangan: ' . ($vacancy->vacancies_description ?: '-') . "\n"
            . "Pautan iklan: {$vacancy->ads_link}\n\n"
            . "## Maklumat pemohon (JSON)\n"
            . json_encode($this->support->applicantProfile($application), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        $content = array_values(array_filter([
            $this->support->downloadAd($vacancy->ads_link),
            ['type' => 'text', 'text' => $text],
        ]));

        $system = self::SYSTEM_PROMPT . "\n" . ClaudeReviewSupport::FAIRNESS_RULES . "\n\nWrite all text fields in Bahasa Melayu.";

        return $this->support->runStructured($system, $content, self::schema(), 32000);
    }

    private static function schema(): array
    {
        $stringList = ['type' => 'array', 'items' => ['type' => 'string']];

        return [
            'type' => 'object',
            'properties' => [
                'score' => [
                    'type' => 'integer',
                    'description' => 'Overall fit for the vacancy, 0 (no fit) to 100 (excellent fit).',
                ],
                'recommendation' => [
                    'type' => 'string',
                    'enum' => ['sangat_sesuai', 'sesuai', 'kurang_sesuai', 'tidak_sesuai'],
                ],
                'summary' => [
                    'type' => 'string',
                    'description' => 'Two to four sentences explaining the overall assessment.',
                ],
                'strengths' => $stringList,
                'concerns' => $stringList,
                'requirements' => [
                    'type' => 'array',
                    'description' => 'Each requirement from the advertisement and whether the applicant meets it.',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'requirement' => ['type' => 'string'],
                            'status' => ['type' => 'string', 'enum' => ['met', 'partial', 'not_met', 'unknown']],
                            'evidence' => ['type' => 'string'],
                        ],
                        'required' => ['requirement', 'status', 'evidence'],
                        'additionalProperties' => false,
                    ],
                ],
                'interview_questions' => $stringList,
                'ad_fetched' => [
                    'type' => 'boolean',
                    'description' => 'True if the advertisement content (attachment or link) was read successfully.',
                ],
            ],
            'required' => [
                'score', 'recommendation', 'summary', 'strengths', 'concerns',
                'requirements', 'interview_questions', 'ad_fetched',
            ],
            'additionalProperties' => false,
        ];
    }
}
