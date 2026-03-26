import React from 'react';
import classNames from 'classnames';
import { FiMinus, FiPlus } from 'react-icons/fi';
import styles from './SectionFieldStepperInput.module.scss';

const noop = () => undefined;
const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

const sanitizeDigits = (value: string) => value.replace(/[^\d]/g, '');

const toNumber = (value: number | string) => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
    }

    const digits = sanitizeDigits(value);
    return digits ? Number(digits) : 0;
};

const clamp = (value: number, min?: number, max?: number) => {
    const nextMin = typeof min === 'number' ? min : Number.NEGATIVE_INFINITY;
    const nextMax = typeof max === 'number' ? max : Number.POSITIVE_INFINITY;
    return Math.min(Math.max(value, nextMin), nextMax);
};

export type SectionFieldStepperInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'value' | 'onChange' | 'min' | 'max' | 'step'
> & {
    value: number | string;
    onChange?: (nextValue: string) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    fullWidthOnMobile?: boolean;
    controlClassName?: string;
    inputClassName?: string;
    decrementButtonClassName?: string;
    incrementButtonClassName?: string;
    decrementAriaLabel?: string;
    incrementAriaLabel?: string;
};

type SectionFieldStepperInputCssProperties = React.CSSProperties & {
    '--granter-section-field-stepper-width'?: string;
    '--granter-section-field-stepper-min-width'?: string;
    '--granter-section-field-stepper-max-width'?: string;
};

const SectionFieldStepperInput = React.forwardRef<HTMLInputElement, SectionFieldStepperInputProps>(
    (
        {
            value,
            onChange = noop,
            min = 0,
            max,
            step = 1,
            className,
            width,
            minWidth,
            maxWidth,
            fullWidthOnMobile = false,
            controlClassName,
            inputClassName,
            decrementButtonClassName,
            incrementButtonClassName,
            decrementAriaLabel = '값 줄이기',
            incrementAriaLabel = '값 늘리기',
            disabled = false,
            inputMode = 'numeric',
            placeholder = '0',
            ...inputProps
        },
        ref
    ) => {
        const currentValue = toNumber(value);
        const normalizedStep = Number.isFinite(step) && step > 0 ? Math.trunc(step) : 1;
        const cssVariables: SectionFieldStepperInputCssProperties = {
            '--granter-section-field-stepper-width': toCssLength(width),
            '--granter-section-field-stepper-min-width': toCssLength(minWidth),
            '--granter-section-field-stepper-max-width': toCssLength(maxWidth),
        };
        const isDecrementDisabled = disabled || currentValue <= min;
        const isIncrementDisabled = disabled || (typeof max === 'number' && currentValue >= max);

        const updateValue = (nextValue: number) => {
            onChange(String(clamp(nextValue, min, max)));
        };

        return (
            <div
                className={classNames(styles.Root, className)}
                style={cssVariables}
                data-full-width-on-mobile={fullWidthOnMobile ? 'true' : 'false'}
            >
                <div className={classNames(styles.Control, controlClassName)} data-disabled={disabled ? 'true' : 'false'}>
                    <button
                        type="button"
                        className={classNames(styles.Button, decrementButtonClassName)}
                        aria-label={decrementAriaLabel}
                        disabled={isDecrementDisabled}
                        onClick={() => updateValue(currentValue - normalizedStep)}
                    >
                        <FiMinus size={16} />
                    </button>

                    <div className={styles.Divider} />

                    <input
                        {...inputProps}
                        ref={ref}
                        type="text"
                        value={String(value)}
                        onChange={(event) => {
                            const digits = sanitizeDigits(event.target.value);
                            if (!digits) {
                                onChange(String(min));
                                return;
                            }

                            updateValue(Number(digits));
                        }}
                        disabled={disabled}
                        inputMode={inputMode}
                        placeholder={placeholder}
                        className={classNames(styles.Input, inputClassName)}
                    />

                    <div className={styles.Divider} />

                    <button
                        type="button"
                        className={classNames(styles.Button, incrementButtonClassName)}
                        aria-label={incrementAriaLabel}
                        disabled={isIncrementDisabled}
                        onClick={() => updateValue(currentValue + normalizedStep)}
                    >
                        <FiPlus size={16} />
                    </button>
                </div>
            </div>
        );
    }
);

SectionFieldStepperInput.displayName = 'SectionFieldStepperInput';

export default SectionFieldStepperInput;
