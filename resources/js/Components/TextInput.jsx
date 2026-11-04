import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Input } from '@/Components/ui/input';
import { cn } from '@/lib/utils';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, formatNumber = false, ...props },
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

    const formatWithCommas = (value) => {
        if (!value) return '';
        const numericValue = value.toString().replace(/[^\d.]/g, '');
        const parts = numericValue.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    };

    const handleChange = (e) => {
        if (formatNumber) {
            const rawValue = e.target.value.replace(/,/g, '');
            const formattedValue = formatWithCommas(rawValue);
            e.target.value = formattedValue;
            
            if (props.onChange) {
                const numericEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: rawValue,
                        name: e.target.name,
                    },
                };
                props.onChange(numericEvent);
            }
        } else {
            props.onChange?.(e);
        }
    };

    const displayValue = formatNumber && props.value ? formatWithCommas(props.value) : props.value;


    return (
        <Input
            {...props}
            type={type}
            className={cn('bg-background', className)}
            ref={localRef}
            value={displayValue}
            onChange={handleChange}
        />
    );
});
