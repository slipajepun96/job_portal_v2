import { cn } from '@/lib/utils';

export default function ValueView({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <div
            {...props}
            className={cn(
                'block rounded-md border border-border bg-muted/50 px-3 py-2 text-sm font-medium text-foreground',
                className
            )}
        >
            {value ? value : children}
        </div>
    );
}
