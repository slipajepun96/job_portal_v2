import { Button } from '@/Components/ui/button';

export default function DangerButton({ className = '', children, ...props }) {
    return (
        <Button variant="destructive" className={className} {...props}>
            {children}
        </Button>
    );
}
