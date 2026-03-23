import React from 'react';
import SectionFieldInput, { type SectionFieldInputProps } from '../SectionFieldInput/SectionFieldInput';

export type SectionFieldCurrencyInputProps = Omit<
    SectionFieldInputProps,
    'defaultValue' | 'inputMode' | 'onChange' | 'type' | 'value'
> & {
    value?: number | null;
    onValueChange?: (value: number | undefined) => void;
};

const toDisplayValue = (value?: number | null) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) return '';
    return value.toLocaleString('ko-KR');
};

const toNumericValue = (rawValue: string) => {
    const digits = rawValue.replace(/[^\d]/g, '');
    return digits ? Number(digits) : undefined;
};

const SectionFieldCurrencyInput = React.forwardRef<HTMLInputElement, SectionFieldCurrencyInputProps>(
    ({ value, onValueChange, ...props }, ref) => (
        <SectionFieldInput
            ref={ref}
            {...props}
            type="text"
            inputMode="numeric"
            value={toDisplayValue(value)}
            onChange={(event) => onValueChange?.(toNumericValue(event.target.value))}
        />
    )
);

SectionFieldCurrencyInput.displayName = 'SectionFieldCurrencyInput';

export default SectionFieldCurrencyInput;
