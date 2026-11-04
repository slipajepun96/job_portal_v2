import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Textarea } from '@/Components/ui/textarea';
import { cn } from '@/lib/utils';

export default forwardRef(function TextArea(
    { className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <Textarea
            {...props}
            className={cn('bg-background', className)}
            ref={localRef}
        />
    );
});
