import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle2, CircleDashed, XCircle, MinusCircle } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import SectionHeading from '@/Components/SectionHeading';

const RECOMMENDATION = {
    sangat_sesuai: { label: 'Sangat Sesuai', className: 'bg-emerald-600 text-white' },
    sesuai: { label: 'Sesuai', className: 'bg-emerald-100 text-emerald-900' },
    kurang_sesuai: { label: 'Kurang Sesuai', className: 'bg-amber-100 text-amber-900' },
    tidak_sesuai: { label: 'Tidak Sesuai', className: 'bg-red-100 text-red-900' },
};

const STATUS = {
    met: { label: 'Dipenuhi', Icon: CheckCircle2, className: 'text-emerald-600' },
    partial: { label: 'Separa', Icon: MinusCircle, className: 'text-amber-600' },
    not_met: { label: 'Tidak dipenuhi', Icon: XCircle, className: 'text-red-600' },
    unknown: { label: 'Tiada maklumat', Icon: CircleDashed, className: 'text-muted-foreground' },
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

export default function ApplicationAiReview({ application }) {
    const [processing, setProcessing] = useState(false);
    const review = application.ai_review;

    const runReview = () => {
        router.post(route('application.aiReview', application.id), {}, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    const rec = review ? RECOMMENDATION[review.recommendation] : null;

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <SectionHeading title="Semakan AI" />
                <Button onClick={runReview} disabled={processing} variant={review ? 'outline' : 'default'}>
                    {processing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {processing ? 'Sedang menyemak…' : review ? 'Semak Semula' : 'Jana Semakan AI'}
                </Button>
            </div>

            {processing && (
                <p className="mt-3 text-sm text-muted-foreground">
                    AI sedang membaca iklan jawatan dan menilai permohonan. Ini mungkin mengambil masa sehingga satu minit.
                </p>
            )}

            {!review && !processing && (
                <p className="mt-3 text-sm text-muted-foreground">
                    Belum disemak. Tekan butang untuk menilai permohonan ini berdasarkan iklan jawatan.
                </p>
            )}

            {review && (
                <div className="mt-4 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="text-3xl font-bold tabular-nums">
                            {review.score}<span className="text-base font-normal text-muted-foreground">/100</span>
                        </div>
                        {rec && <Badge className={`border-transparent ${rec.className}`}>{rec.label}</Badge>}
                        {!review.ad_fetched && (
                            <Badge variant="outline">Iklan tidak dapat dibaca — dinilai dari tajuk & keterangan sahaja</Badge>
                        )}
                    </div>

                    <p className="text-sm leading-relaxed">{review.summary}</p>

                    {review.requirements?.length > 0 && (
                        <div>
                            <h4 className="mb-2 text-sm font-semibold">Padanan Keperluan</h4>
                            <div className="divide-y divide-border rounded-md border border-border">
                                {review.requirements.map((r, i) => {
                                    const s = STATUS[r.status] ?? STATUS.unknown;
                                    return (
                                        <div key={i} className="flex gap-3 p-3 text-sm">
                                            <s.Icon className={`mt-0.5 h-4 w-4 shrink-0 ${s.className}`} aria-label={s.label} />
                                            <div>
                                                <div className="font-medium">{r.requirement}</div>
                                                <div className="text-muted-foreground">{r.evidence}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 md:grid-cols-2">
                        <List title="Kekuatan" items={review.strengths} />
                        <List title="Perkara Perlu Diberi Perhatian" items={review.concerns} />
                    </div>

                    <List title="Cadangan Soalan Temuduga" items={review.interview_questions} />

                    <p className="text-xs text-muted-foreground">
                        Disemak pada {application.ai_reviewed_at ? new Date(application.ai_reviewed_at).toLocaleString('ms-MY') : '-'}
                        {review.model ? ` · ${review.model}` : ''}. Semakan AI adalah panduan sahaja; keputusan akhir dibuat oleh perekrut.
                    </p>
                </div>
            )}
        </div>
    );
}
