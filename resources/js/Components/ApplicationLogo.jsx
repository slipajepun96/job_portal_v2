import { Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ApplicationLogo({ className = '', showText = true, subtitle = 'PKPP Agro Sdn. Bhd.' }) {
    return (
        <div className={cn('flex items-center gap-3', className)}>
            {/* <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-highlight text-highlight-foreground shadow-sm">
                <Sprout className="h-5 w-5" strokeWidth={2.25} />
            </span> */}
            {showText && (
                <span className="flex flex-col leading-tight">
                    <span className="text-base font-semibold tracking-tight">Portal Kerjaya</span>
                    <span className="text-xs opacity-75">{subtitle}</span>
                </span>
            )}
        </div>
    );
}
