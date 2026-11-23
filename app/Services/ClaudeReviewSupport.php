<?php

namespace App\Services;

use Anthropic\Client;
use Anthropic\Lib\Streaming\MessageAccumulator;
use App\Models\Application;
use App\Models\Vacancy;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

/**
 * Shared plumbing for the AI review features: building the Claude client,
 * loading the job advert, stripping applicant data down to job-relevant
 * fields, and running a structured-output request.
 */
class ClaudeReviewSupport
{
    /**
     * Only these application fields are sent to Claude. Identity, contact
     * details and protected characteristics (gender, ethnicity, age,
     * marital/pregnancy status, health, family) never leave the server.
     */
    public const RELEVANT_FIELDS = [
        'education',
        'employers',
        'currently_employed',
        'salary',
        'allowance',
        'expected_salary',
        'start_date',
        'notice_period',
        'report_to',
        'report_count',
        'language_malay',
        'language_english',
        'language',
        'other_language',
        'license',
        'achievement',
    ];

    public const FAIRNESS_RULES = 'Base every judgement on evidence in the application; when information is missing, '
        . 'mark it as unknown instead of guessing. Do not infer or consider gender, ethnicity, religion, age, '
        . 'marital status, health or family situation. Your output supports a human decision and does not replace it.';

    public function __construct(private ?Client $client = null)
    {
    }

    /** @return array<string, mixed> job-relevant fields of the application */
    public function applicantProfile(Application $application): array
    {
        $snapshot = $application->application_snapshot;

        // Older rows were saved as a JSON string inside the JSON column.
        if (is_string($snapshot)) {
            $snapshot = json_decode($snapshot, true);
        }

        return array_intersect_key(is_array($snapshot) ? $snapshot : [], array_flip(self::RELEVANT_FIELDS));
    }

    /**
     * The advert as a content block: the uploaded PDF if there is one,
     * otherwise whatever can be downloaded from the advert link.
     */
    public function adContent(Vacancy $vacancy): ?array
    {
        if ($vacancy->ads_pdf && Storage::disk('local')->exists($vacancy->ads_pdf)) {
            return ['type' => 'document', 'source' => [
                'type' => 'base64',
                'media_type' => 'application/pdf',
                'data' => base64_encode(Storage::disk('local')->get($vacancy->ads_pdf)),
            ]];
        }

        return $this->downloadAd($vacancy->ads_link);
    }

    /**
     * Download the advert so Claude can read it directly. Google Drive share
     * links render as a viewer page web_fetch cannot read, so convert them to
     * a direct download first. Returns a document/image content block, or null.
     */
    public function downloadAd(?string $url): ?array
    {
        if (! $url) {
            return null;
        }

        if (preg_match('~drive\.google\.com/(?:file/d/|open\?id=|uc\?.*id=)([\w-]+)~', $url, $m)) {
            $url = "https://drive.google.com/uc?export=download&id={$m[1]}";
        }

        try {
            $response = Http::timeout(30)->withOptions(['allow_redirects' => true])->get($url);
        } catch (Throwable) {
            return null;
        }

        $type = strtolower(trim(explode(';', (string) $response->header('Content-Type'))[0]));
        $body = $response->body();

        if (! $response->successful() || $body === '' || strlen($body) > 20 * 1024 * 1024) {
            return null;
        }

        $data = base64_encode($body);

        if ($type === 'application/pdf' || str_starts_with($body, '%PDF')) {
            return ['type' => 'document', 'source' => ['type' => 'base64', 'media_type' => 'application/pdf', 'data' => $data]];
        }

        if (in_array($type, ['image/jpeg', 'image/png', 'image/gif', 'image/webp'], true)) {
            return ['type' => 'image', 'source' => ['type' => 'base64', 'media_type' => $type, 'data' => $data]];
        }

        return null; // HTML or unknown: leave it to web_fetch
    }

    /**
     * Run one structured-output request and return the decoded JSON plus the
     * model that served it (under the "model" key). Streams, so long outputs
     * don't hit HTTP timeouts, and resumes turns paused by server tools.
     *
     * @param  array<int, array<string, mixed>>  $content  user content blocks
     * @param  array<string, mixed>  $schema
     * @return array<string, mixed>
     */
    public function runStructured(string $system, array $content, array $schema, int $maxTokens = 64000): array
    {
        $messages = [['role' => 'user', 'content' => $content]];

        for ($attempt = 0; $attempt < 3; $attempt++) {
            $stream = $this->client()->beta->messages->createStream(
                model: config('services.anthropic.model'),
                maxTokens: $maxTokens,
                system: $system,
                messages: $messages,
                tools: [[
                    'type' => 'web_fetch_20260209',
                    'name' => 'web_fetch',
                    'max_uses' => 2,
                ]],
                outputConfig: [
                    'effort' => 'medium',
                    'format' => ['type' => 'json_schema', 'schema' => $schema],
                ],
                betas: ['server-side-fallback-2026-07-01'],
                fallbacks: 'default',
                requestOptions: ['timeout' => 900],
            );

            $accumulator = MessageAccumulator::forBetaMessages();
            foreach ($stream as $event) {
                $accumulator->accumulate($event);
            }
            $message = $accumulator->message();

            if ($message->stopReason !== 'pause_turn') {
                break;
            }

            $messages[] = [
                'role' => 'assistant',
                'content' => json_decode(json_encode($message->content), true),
            ];
        }

        if ($message->stopReason === 'refusal') {
            throw new RuntimeException('Semakan AI ditolak oleh model.');
        }
        if ($message->stopReason === 'max_tokens') {
            throw new RuntimeException('Semakan AI terputus sebelum selesai. Sila cuba lagi.');
        }

        $text = null;
        foreach ($message->content as $block) {
            if ($block->type === 'text') {
                $text = $block->text; // with structured output the last text block holds the JSON
            }
        }

        $result = $text !== null ? json_decode($text, true) : null;
        if (! is_array($result)) {
            throw new RuntimeException('Semakan AI tidak mengembalikan keputusan yang sah.');
        }

        $result['model'] = $message->model;

        return $result;
    }

    private function client(): Client
    {
        if ($this->client === null) {
            $key = config('services.anthropic.key');
            $this->client = $key ? new Client(apiKey: $key) : new Client();
        }

        return $this->client;
    }
}
