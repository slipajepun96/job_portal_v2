import { Button } from '@/Components/ui/button';

export default function SecondaryButton({
    type = 'button',
    className = '',
    children,
    ...props
}) {
    return (
        <Button type={type} variant="outline" className={className} {...props}>
            {children}
        </Button>
    );
}
