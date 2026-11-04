import { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { Alert as UiAlert, AlertDescription } from '@/Components/ui/alert';
import { cn } from '@/lib/utils';

const styles = {
    success: { className: 'border-primary/30 bg-accent text-accent-foreground', Icon: CheckCircle2 },
    error: { className: 'border-destructive/40 bg-destructive/5 text-destructive', Icon: XCircle },
    warning: { className: 'border-amber-300 bg-amber-50 text-amber-900', Icon: AlertTriangle },
};

export default function Alert({ type = 'success', message }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!message || !isVisible) return null;

    const { className, Icon } = styles[type] || styles.success;

    return (
        <UiAlert className={cn('pr-10', className)}>
            <Icon className="h-4 w-4 !text-current" />
            <AlertDescription>{message}</AlertDescription>
            <button
                type="button"
                onClick={() => setIsVisible(false)}
                className="absolute right-3 top-3 rounded-sm opacity-70 transition hover:opacity-100"
                aria-label="Tutup"
            >
                <X className="h-4 w-4" />
            </button>
        </UiAlert>
    );
}
