import { cn } from '@/lib/utils';

export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={cn(
                'form-checkbox h-4 w-4 rounded-sm border-input text-primary shadow-sm focus:ring-ring',
                className
            )}
        />
    );
}
