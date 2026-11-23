<?php

namespace App\Services;

use App\Models\Application;
use App\Models\Vacancy;
use RuntimeException;

/**
 * Asks Claude to compare every application for a vacancy against the advert:
 * an overview of the applicant pool plus a short assessment of each person.
 *
 * Applicants are sent under anonymous refs (P1, P2, ...); names are joined
 * back on our side, so no names or IC numbers go to the API.
 */
class VacancyAiSummariser
{
    private const SYSTEM_PROMPT = <<<'PROMPT'
You are an assistant helping a recruiter screen all applications for one job vacancy. You receive
the vacancy (title, location, description and a link to the full advertisement) and the
job-relevant parts of every applicant's form, each under an anonymous reference such as "P3".
The advertisement itself is usually attached as a PDF or image. If it is not attached, use the
web_fetch tool once to read the link. If neither works, work from the title and description and
say so.

First compare the whole applicant pool with the advertised requirements. Then assess every
applicant individually, using the same standard for everyone so scores are comparable. Return
exactly one entry per applicant reference you were given; do not skip or invent references.
PROMPT;

    public function __construct(private ClaudeReviewSupport $support)
    {
    }

    /** @return array<string, mixed> */
    public function summarise(Vacancy $vacancy): array
    {
        $applications = Application::where('vacancy_uuid', $vacancy->id)->orderBy('created_at')->get();

        if ($applications->isEmpty()) {
            throw new RuntimeException('Tiada permohonan untuk jawatan ini.');
        }

        $refs = [];
        $applicants = [];
        foreach ($applications->values() as $i => $application) {
            $ref = 'P' . ($i + 1);
            $refs[$ref] = $application;
            $applicants[] = ['ref' => $ref] + $this->support->applicantProfile($application);
        }

        $text = "## Jawatan kosong\n"
            . "Jawatan: {$vacancy->vacancies_title}\n"
            . "Lokasi: {$vacancy->vacancies_location}\n"
            . 'Keterangan: ' . ($vacancy->vacancies_description ?: '-') . "\n"
            . "Pautan iklan: {$vacancy->ads_link}\n\n"
            . '## Pemohon (' . count($applicants) . " orang, JSON)\n"
            . json_encode($applicants, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        $content = array_values(array_filter([
            $this->support->downloadAd($vacancy->ads_link),
            ['type' => 'text', 'text' => $text],
        ]));

        $system = self::SYSTEM_PROMPT . "\n" . ClaudeReviewSupport::FAIRNESS_RULES . "\n\nWrite all text fields in Bahasa Melayu.";

        $result = $this->support->runStructured($system, $content, self::schema());

        $names = [];
        foreach ($refs as $ref => $application) {
            $snapshot = is_string($application->application_snapshot)
                ? json_decode($application->application_snapshot, true)
                : $application->application_snapshot;
            $names[$ref] = $snapshot['name'] ?? $ref;
        }

        // Join names back on, drop unknown refs, best first.
        $candidates = [];
        foreach ($result['candidates'] ?? [] as $candidate) {
            $application = $refs[$candidate['ref']] ?? null;
            if (! $application) {
                continue;
            }
            $candidates[] = $candidate + [
                'application_id' => $application->id,
                'name' => $names[$candidate['ref']],
            ];
        }
        usort($candidates, fn ($a, $b) => $b['score'] <=> $a['score']);

        // Free-text fields mention applicants as "P12"; show names instead.
        $result = self::replaceRefs($result, $names);

        $result['candidates'] = $candidates;
        $result['application_count'] = count($refs);
        $result['missing_count'] = count($refs) - count($candidates);

        return $result;
    }

    /**
     * Swap applicant refs (P1, P2, ...) for names in every free-text field.
     *
     * @param  array<string, string>  $names  ref => name
     */
    public static function replaceRefs(array $data, array $names): array
    {
        foreach ($data as $key => $value) {
            if (in_array($key, ['ref', 'candidates', 'model'], true)) {
                continue;
            }
            if (is_array($value)) {
                $data[$key] = self::replaceRefs($value, $names);
            } elseif (is_string($value)) {
                $data[$key] = preg_replace_callback(
                    '/\bP(\d+)\b/',
                    fn ($m) => isset($names[$m[0]]) ? "{$names[$m[0]]}" : $m[0],
                    $value,
                );
            }
        }

        return $data;
    }

    private static function schema(): array
    {
        $stringList = ['type' => 'array', 'items' => ['type' => 'string']];

        return [
            'type' => 'object',
            'properties' => [
                'overview' => [
                    'type' => 'string',
                    'description' => 'One or two paragraphs on how the applicant pool as a whole matches the advertised requirements.',
                ],
                'key_requirements' => [
                    'type' => 'array',
                    'description' => 'The main requirements in the advertisement and how many applicants meet each.',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'requirement' => ['type' => 'string'],
                            'met_count' => ['type' => 'integer'],
                            'note' => ['type' => 'string'],
                        ],
                        'required' => ['requirement', 'met_count', 'note'],
                        'additionalProperties' => false,
                    ],
                ],
                'pool_strengths' => $stringList,
                'pool_gaps' => $stringList,
                'shortlist_advice' => [
                    'type' => 'string',
                    'description' => 'Which applicants (by ref) to prioritise for interview and why.',
                ],
                'ad_fetched' => [
                    'type' => 'boolean',
                    'description' => 'True if the advertisement content (attachment or link) was read successfully.',
                ],
                'candidates' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'ref' => ['type' => 'string'],
                            'score' => [
                                'type' => 'integer',
                                'description' => 'Fit for the vacancy, 0 (no fit) to 100 (excellent fit).',
                            ],
                            'recommendation' => [
                                'type' => 'string',
                                'enum' => ['sangat_sesuai', 'sesuai', 'kurang_sesuai', 'tidak_sesuai'],
                            ],
                            'summary' => [
                                'type' => 'string',
                                'description' => 'One or two sentences on this applicant against the advertisement.',
                            ],
                            'strengths' => $stringList,
                            'concerns' => $stringList,
                        ],
                        'required' => ['ref', 'score', 'recommendation', 'summary', 'strengths', 'concerns'],
                        'additionalProperties' => false,
                    ],
                ],
            ],
            'required' => [
                'overview', 'key_requirements', 'pool_strengths', 'pool_gaps',
                'shortlist_advice', 'ad_fetched', 'candidates',
            ],
            'additionalProperties' => false,
        ];
    }
}
