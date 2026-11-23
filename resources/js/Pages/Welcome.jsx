import ApplicationLogo from '@/Components/ApplicationLogo';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Briefcase, CheckCircle2, Clock, ExternalLink, MapPin } from 'lucide-react';

export default function Welcome({ auth, vacancies, success }) {
    return (
        <>
            <Head title="Portal Kerjaya" />
            <div className="flex min-h-screen flex-col bg-muted/40">
                <header className="bg-primary text-primary-foreground">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/">
                            <ApplicationLogo />
                        </Link>
                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Button asChild variant="ghost" className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                                    <Link href={route('dashboard')}>Papan Pemuka</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                                        <Link href={route('login')}>Log Masuk</Link>
                                    </Button>
                                    <Button asChild variant="ghost" className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                                        <Link href={route('register')}>Daftar</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <section className="bg-primary text-primary-foreground">
                    <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-16">
                        <div className="flex flex-col justify-center">
                            {/* <Badge className="mb-4 w-fit border-transparent bg-highlight/15 text-highlight hover:bg-highlight/15">
                                Jawatan kosong kini dibuka
                            </Badge> */}
                            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                                Bina kerjaya anda bersama <span className="text-highlight">PKPP Agro</span>
                            </h1>
                            <p className="mt-4 max-w-xl text-lg text-primary-foreground/75">
                                Lihat jawatan yang sedang ditawarkan dan hantar permohonan anda secara dalam talian dalam beberapa langkah mudah.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Button asChild size="lg" className="bg-highlight text-highlight-foreground hover:bg-highlight/90">
                                    <Link href={route('application')}>
                                        Mohon Sekarang <ArrowRight />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
                                    <a href="#jawatan">Lihat Jawatan</a>
                                </Button>
                            </div>
                        </div>

                        <div className="hidden items-center justify-center lg:flex">
                            <div className="grid w-full max-w-md grid-cols-2 gap-4">
                                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
                                    <p className="text-sm text-primary-foreground/70">Jawatan dibuka</p>
                                    <p className="mt-1 text-5xl font-bold text-highlight">{vacancies.length}</p>
                                </div>
                                {['Isi borang dalam talian', 'Semak & hantar'].map((step, i) => (
                                    <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-highlight text-sm font-semibold text-highlight-foreground">
                                            {i + 1}
                                        </span>
                                        <p className="mt-3 text-sm font-medium">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <main id="jawatan" className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
                    {success && (
                        <Card className="mb-8 border-primary/20 bg-accent">
                            <CardHeader className="flex-row items-start gap-3 space-y-0">
                                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                                <div>
                                    <CardTitle className="text-base text-accent-foreground">{success}</CardTitle>
                                    <CardDescription className="mt-2 text-accent-foreground/80">
                                        Pihak tuan/puan perlu menghantar salinan sijil-sijil / dokumen pendidikan / dokumen sokongan yang berkaitan secara fizikal melalui pos dengan kos tanggungan sendiri ke:
                                    </CardDescription>
                                    <p className="mt-2 text-sm font-semibold text-accent-foreground">
                                        Bahagian Pentadbiran, Ibu Pejabat PKPP Agro Sdn. Bhd.,<br />
                                        KM 4 Jalan Selendang, 26800 Kuala Rompin, Pahang Darul Makmur
                                    </p>
                                </div>
                            </CardHeader>
                        </Card>
                    )}

                    <div className="mb-6 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Senarai Kerja Kosong</h2>
                            <p className="mt-1 text-sm text-muted-foreground">Jawatan yang sedang dibuka untuk permohonan.</p>
                        </div>
                    </div>

                    {vacancies.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center py-12 text-center">
                                <Briefcase className="h-10 w-10 text-muted-foreground" />
                                <p className="mt-3 font-medium text-foreground">Tiada jawatan kosong buat masa ini</p>
                                <p className="mt-1 text-sm text-muted-foreground">Sila semak semula kemudian.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {vacancies.map((vacancy) => (
                                <Card key={vacancy.id} className="flex flex-col transition hover:border-primary/40 hover:shadow-md">
                                    <CardHeader>
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                                            <Briefcase className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg">{vacancy.vacancies_title}</CardTitle>
                                        <CardDescription className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5" />
                                            {vacancy.vacancies_location}
                                        </CardDescription>
                                        <CardDescription className="flex items-center gap-1.5">
                                            <Clock className="h-3.5 w-3.5" />
                                            Tutup {new Date(vacancy.end_date).toLocaleString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="mt-auto flex gap-2">
                                        <Button asChild className="flex-1">
                                            <Link href={route('application')}>Mohon</Link>
                                        </Button>
                                        {(vacancy.ads_pdf || vacancy.ads_link) && (
                                            <Button asChild variant="outline">
                                                <a href={vacancy.ads_pdf ? route('vacancy.ads', vacancy.id) : vacancy.ads_link} target="_blank" rel="noreferrer">
                                                    Iklan <ExternalLink />
                                                </a>
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </main>

                <footer className="border-t border-border bg-background py-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} PKPP Agro Sdn. Bhd. Hak Cipta Terpelihara.
                </footer>
            </div>
        </>
    );
}
