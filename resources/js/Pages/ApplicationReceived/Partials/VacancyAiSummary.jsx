import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Sparkles, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import Alert from '@/Components/Alert';

const RECOMMENDATION = {
    sangat_sesuai: { label: 'Sangat Sesuai', className: 'bg-emerald-600 text-white' },
    sesuai: { label: 'Sesuai', className: 'bg-emerald-100 text-emerald-900' },
    kurang_sesuai: { label: 'Kurang Sesuai', className: 'bg-amber-100 text-amber-900' },
    tidak_sesuai: { label: 'Tidak Sesuai', className: 'bg-red-100 text-red-900' },
};

function List({ title, items }) {
    if (!items?.length) return null;
    return (
        <div>
            <h4 className="mb-1 text-sm font-semibold">{title}</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm">
                {items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </div>
    );
}

function CandidateRow({ candidate, rank }) {
    const [open, setOpen] = useState(false);
    const rec = RECOMMENDATION[candidate.recommendation];
    const Chevron = open ? ChevronDown : ChevronRight;

    return (
        <div className="border-b border-border last:border-b-0">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full items-start gap-3 p-3 text-left hover:bg-accent/50"
            >
                <Chevron className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="w-6 shrink-0 pt-0.5 text-sm tabular-nums text-muted-foreground">{rank}.</span>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{candidate.name}</span>
                        <span className="text-sm font-semibold tabular-nums">{candidate.score}/100</span>
                        {rec && <Badge className={`border-transparent ${rec.className}`}>{rec.label}</Badge>}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{candidate.summary}</p>
                </div>
            </button>
            {open && (
                <div className="space-y-3 pb-4 pl-[4.25rem] pr-3">
                    <div className="grid gap-4 md:grid-cols-2">
                        <List title="Kekuatan" items={candidate.strengths} />
                        <List title="Perkara Perlu Diberi Perhatian" items={candidate.concerns} />
                    </div>
                    <Button asChild size="sm" variant="outline">
                        <Link href={route('viewApplicationReceived', candidate.application_id)}>Papar Permohonan</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function VacancyAiSummary({ vacancy, applicationCount }) {
    const summary = vacancy.ai_summary;
    const status = vacancy.ai_summary_status;
    const processing = status === 'processing';
    const [submitting, setSubmitting] = useState(false);

    // Poll while the background job runs.
    useEffect(() => {
        if (!processing) return;
        const timer = setInterval(() => {
            router.reload({ only: ['vacancy'], preserveScroll: true });
        }, 5000);
        return () => clearInterval(timer);
    }, [processing]);

    const run = () => {
        router.post(route('vacancy.aiSummary', vacancy.id), {}, {
            preserveScroll: true,
            onStart: () => setSubmitting(true),
            onFinish: () => setSubmitting(false),
        });
    };

    const busy = processing || submitting;
    const outdated = summary && summary.application_count !== applicationCount;

    return (
        <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
                <div>
                    <h3 className="text-base font-semibold">Ringkasan AI: {vacancy.vacancies_title}</h3>
                    <p className="text-sm text-muted-foreground">
                        Semua permohonan dibandingkan dengan iklan jawatan.
                    </p>
                </div>
                <Button onClick={run} disabled={busy || applicationCount === 0} variant={summary ? 'outline' : 'default'}>
                    {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {busy ? 'Sedang menyemak…' : summary ? 'Jana Semula' : 'Jana Ringkasan AI'}
                </Button>
            </div>

            {processing && (
                <p className="mt-3 text-sm text-muted-foreground">
                    AI sedang menilai {applicationCount} permohonan. Ini boleh mengambil masa beberapa minit. Halaman ini akan dikemas kini secara automatik.
                </p>
            )}

            {status === 'failed' && (
                <div className="mt-3">
                    <Alert type="error" message={`Ringkasan AI gagal: ${vacancy.ai_summary_error ?? ''}`} />
                </div>
            )}

            {!summary && !busy && status !== 'failed' && (
                <p className="mt-3 text-sm text-muted-foreground">Belum dijana.</p>
            )}

            {summary && (
                <div className="mt-4 space-y-5">
                    <div className="flex flex-wrap gap-2">
                        {!summary.ad_fetched && (
                            <Badge variant="outline">Iklan tidak dapat dibaca — dinilai dari tajuk & keterangan sahaja</Badge>
                        )}
                        {outdated && (
                            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
                                Ringkasan untuk {summary.application_count} permohonan; kini ada {applicationCount}. Jana semula untuk kemas kini.
                            </Badge>
                        )}
                        {summary.missing_count > 0 && (
                            <Badge variant="outline">{summary.missing_count} pemohon tidak dinilai oleh AI</Badge>
                        )}
                    </div>

                    <p className="whitespace-pre-line text-sm leading-relaxed">{summary.overview}</p>

                    {summary.key_requirements?.length > 0 && (
                        <div>
                            <h4 className="mb-2 text-sm font-semibold">Keperluan Utama Iklan</h4>
                            <div className="divide-y divide-border rounded-md border border-border">
                                {summary.key_requirements.map((r, i) => (
                                    <div key={i} className="flex gap-3 p-3 text-sm">
                                        <span className="w-16 shrink-0 font-semibold tabular-nums">
                                            {r.met_count}/{summary.application_count}
                                        </span>
                                        <div>
                                            <div className="font-medium">{r.requirement}</div>
                                            <div className="text-muted-foreground">{r.note}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <List title="Kekuatan Keseluruhan" items={summary.pool_strengths} />
                        <List title="Kekurangan Keseluruhan" items={summary.pool_gaps} />
                    </div>

                    {summary.shortlist_advice && (
                        <div>
                            <h4 className="mb-1 text-sm font-semibold">Cadangan Senarai Pendek</h4>
                            <p className="text-sm">{summary.shortlist_advice}</p>
                        </div>
                    )}

                    <div>
                        <h4 className="mb-2 text-sm font-semibold">Senarai Pemohon ({summary.candidates.length}), disusun mengikut skor</h4>
                        <div className="rounded-md border border-border">
                            {summary.candidates.map((c, i) => (
                                <CandidateRow key={c.application_id} candidate={c} rank={i + 1} />
                            ))}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Dijana pada {vacancy.ai_summarized_at ? new Date(vacancy.ai_summarized_at).toLocaleString('ms-MY') : '-'}
                        {summary.model ? ` · ${summary.model}` : ''}. Ringkasan AI adalah panduan sahaja; keputusan akhir dibuat oleh perekrut.
                    </p>
                </div>
            )}
        </div>
    );
}
