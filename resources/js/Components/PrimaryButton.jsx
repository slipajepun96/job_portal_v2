import { forwardRef } from 'react';
import { Button } from '@/Components/ui/button';

const PrimaryButton = forwardRef(({ className = '', children, ...props }, ref) => {
    return (
        <Button ref={ref} className={className} {...props}>
            {children}
        </Button>
    );
});

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
