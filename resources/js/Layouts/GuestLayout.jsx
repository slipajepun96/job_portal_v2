import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export default function GuestLayout({ children, wide = false }) {
    return (
        <div className="flex min-h-screen flex-col bg-muted/40">
            <header className="bg-primary text-primary-foreground">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight">
                        <ApplicationLogo />
                    </Link>
                </div>
            </header>

            <main className={cn('mx-auto w-full flex-1 px-4 py-10 sm:px-6', wide ? 'max-w-7xl lg:px-8' : 'max-w-md')}>
                {wide ? (
                    children
                ) : (
                    <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-8">
                        {children}
                    </div>
                )}
            </main>

            <footer className="border-t border-border bg-background py-4 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} PKPP Agro Sdn. Bhd. Hak Cipta Terpelihara.
            </footer>
        </div>
    );
}
