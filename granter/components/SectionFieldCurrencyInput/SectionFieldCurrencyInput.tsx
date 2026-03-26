import React from 'react';
import SectionFieldSuffixInput, { type SectionFieldSuffixInputProps } from '../SectionFieldSuffixInput/SectionFieldSuffixInput';

export type SectionFieldCurrencyInputProps = Omit<
    SectionFieldSuffixInputProps,
    'defaultValue' | 'inputMode' | 'onChange' | 'type' | 'value' | 'suffix'
> & {
    value?: number | null;
    onValueChange?: (value: number | undefined) => void;
    suffix?: React.ReactNode;
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
    ({ value, onValueChange, suffix = '원', textAlign = 'right', ...props }, ref) => (
        <SectionFieldSuffixInput
            ref={ref}
            {...props}
            suffix={suffix}
            type="text"
            inputMode="numeric"
            textAlign={textAlign}
            value={toDisplayValue(value)}
            onChange={(event) => onValueChange?.(toNumericValue(event.target.value))}
        />
    )
);

SectionFieldCurrencyInput.displayName = 'SectionFieldCurrencyInput';

export default SectionFieldCurrencyInput;
