import { useForm, usePage, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import TextArea from '@/Components/TextArea';
import InputError from '@/Components/InputError';
import SectionHeading from '@/Components/SectionHeading';

export default function ApplicationComments({ application }) {
    const { auth } = usePage().props;
    const comments = application.comments ?? [];
    const { data, setData, post, processing, errors, reset } = useForm({ comment: '' });

    const submit = (e) => {
        e.preventDefault();
        post(route('application.comment.add', application.id), {
            preserveScroll: true,
            onSuccess: () => reset('comment'),
        });
    };

    const remove = (comment) => {
        if (!confirm('Padam komen ini?')) return;
        router.delete(route('application.comment.delete', [application.id, comment.id]), { preserveScroll: true });
    };

    return (
        <div>
            <SectionHeading title={`Komen Perekrut (${comments.length})`} />

            <form onSubmit={submit} className="mt-4 space-y-2">
                <TextArea
                    value={data.comment}
                    onChange={(e) => setData('comment', e.target.value)}
                    placeholder="Tulis komen tentang pemohon ini…"
                    rows={3}
                />
                <InputError message={errors.comment} />
                <div className="flex justify-end">
                    <Button type="submit" disabled={processing || !data.comment.trim()}>
                        Hantar Komen
                    </Button>
                </div>
            </form>

            <div className="mt-4 space-y-3">
                {comments.length === 0 && (
                    <p className="text-sm text-muted-foreground">Belum ada komen.</p>
                )}
                {comments.map((c) => (
                    <div key={c.id} className="rounded-md border border-border p-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="text-sm">
                                <span className="font-semibold">{c.user?.name ?? 'Pengguna dipadam'}</span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                    {new Date(c.created_at).toLocaleString('ms-MY')}
                                </span>
                            </div>
                            {auth?.user?.id === c.user_id && (
                                <button
                                    type="button"
                                    onClick={() => remove(c)}
                                    className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-destructive"
                                    aria-label="Padam komen"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <p className="mt-1 whitespace-pre-line text-sm">{c.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
