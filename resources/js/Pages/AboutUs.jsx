import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Separator } from '@/Components/ui/separator';
import { Head } from '@inertiajs/react';

export default function AboutUs() {
    return (
        <AuthenticatedLayout header={<h2>Tentang Kami</h2>}>
            <Head title="Tentang Kami" />

            <div className="py-8">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sistem Permohonan Pekerjaan</CardTitle>
                            <CardDescription>PKPP Agro Sdn. Bhd.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-foreground">
                            <p>
                                Untuk memudahkan urusan melihat jawatan kosong yang ditawarkan
                                oleh syarikat dan menilai permohonan yang dihantar.
                            </p>
                            <Separator />
                            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                                <dt className="text-muted-foreground">Dibuat</dt>
                                <dd>24/02/2026</dd>
                                <dt className="text-muted-foreground">Oleh</dt>
                                <dd>-</dd>
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
