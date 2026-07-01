import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="bg-gray-50 text-black/50" style={{
                backgroundImage: `
                    radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #3ABCC2 100%)
                `,
                backgroundSize: "100% 100%",
                }}> 
        <div className="flex flex-col items-center pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-2 w-full overflow-hidden px-6 py-4 shadow-md sm:rounded-lg">
                {children}
            </div>
        </div>
        </div>
    );
}
