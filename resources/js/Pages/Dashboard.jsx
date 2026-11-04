import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { Briefcase, ChevronRight, FileText } from 'lucide-react';

export default function Dashboard({ vacancies, applications }) {
    const number_of_vacancies = vacancies.length;
    const number_of_applications = applications.length;

    function getApplicationNumber(vacancy_uuid) {
        return applications.filter((item) => item.vacancy_uuid === vacancy_uuid).length;
    }

    const stats = [
        { label: 'Jawatan Dibuka', value: number_of_vacancies, Icon: Briefcase, accent: 'bg-highlight text-highlight-foreground' },
        { label: 'Jumlah Permohonan', value: number_of_applications, Icon: FileText, accent: 'bg-primary text-primary-foreground' },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2>Utama</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Ringkasan jawatan dan permohonan yang diterima.</p>
                </div>
            }
        >
            <Head title="Utama" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-2">
                        {stats.map(({ label, value, Icon, accent }) => (
                            <Card key={label}>
                                <CardContent className="flex items-center justify-between p-6">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">{label}</p>
                                        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
                                    </div>
                                    <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
                                        <Icon className="h-6 w-6" />
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Permohonan Mengikut Jawatan</CardTitle>
                            <CardDescription>Klik jawatan untuk melihat senarai pemohon.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {vacancies.length === 0 ? (
                                <p className="py-8 text-center text-sm text-muted-foreground">Tiada jawatan dibuka.</p>
                            ) : (
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {vacancies.map((vacancy) => (
                                        <Link
                                            key={vacancy.id}
                                            href={route('viewApplicantList', { id: vacancy.id })}
                                            className="group flex items-center justify-between rounded-lg border border-border bg-background p-4 transition hover:border-primary/40 hover:bg-accent"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-medium text-foreground">{vacancy.vacancies_title}</p>
                                                <Badge variant="secondary" className="mt-2">
                                                    {getApplicationNumber(vacancy.id)} permohonan
                                                </Badge>
                                            </div>
                                            <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
