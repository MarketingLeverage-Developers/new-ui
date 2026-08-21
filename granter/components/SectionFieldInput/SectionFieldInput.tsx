import React, { useId, useState } from 'react';
import classNames from 'classnames';
import styles from './SectionFieldInput.module.scss';

export type SectionFieldInputSize = 'sm' | 'md' | 'lg';
export type SectionFieldInputVariant = 'default' | 'embedded-label' | 'document' | 'workflow' | 'workflow-title';

export type SectionFieldInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    className?: string;
    containerClassName?: string;
    size?: SectionFieldInputSize;
    variant?: SectionFieldInputVariant;
    label?: React.ReactNode;
    leadingIcon?: React.ReactNode;
};

const SectionFieldInput = React.forwardRef<HTMLInputElement, SectionFieldInputProps>(
    (
        {
            className,
            containerClassName,
            size = 'md',
            variant = 'default',
            label,
            leadingIcon,
            id,
            value,
            defaultValue,
            disabled,
            required,
            onBlur,
            onChange,
            onFocus,
            placeholder,
            type = 'text',
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id ?? generatedId;
        const [focused, setFocused] = useState(false);
        const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
        const currentValue = value === undefined ? uncontrolledValue : value;
        const hasValue = String(currentValue ?? '').length > 0;

        const input = (
            <input
                ref={ref}
                id={inputId}
                type={type}
                className={classNames(styles.Input, className)}
                data-size={size}
                data-variant={variant}
                value={value}
                defaultValue={defaultValue}
                disabled={disabled}
                required={required}
                placeholder={variant === 'embedded-label' && !focused && !hasValue ? '' : placeholder}
                onFocus={(event) => {
                    setFocused(true);
                    onFocus?.(event);
                }}
                onBlur={(event) => {
                    setFocused(false);
                    onBlur?.(event);
                }}
                onChange={(event) => {
                    if (value === undefined) setUncontrolledValue(event.target.value);
                    onChange?.(event);
                }}
                {...props}
            />
        );

        if (variant !== 'embedded-label') return input;

        return (
            <div
                className={classNames(styles.EmbeddedRoot, containerClassName)}
                data-size={size}
                data-disabled={disabled ? 'true' : undefined}
            >
                {input}
                <label
                    className={styles.EmbeddedLabel}
                    data-hidden={focused || hasValue ? 'true' : undefined}
                    htmlFor={inputId}
                >
                    {leadingIcon ? <span className={styles.EmbeddedIcon}>{leadingIcon}</span> : null}
                    <span>{label}</span>
                    {required ? <span className={styles.EmbeddedRequiredMark}>*</span> : null}
                </label>
            </div>
        );
    }
);

SectionFieldInput.displayName = 'SectionFieldInput';

export default SectionFieldInput;
