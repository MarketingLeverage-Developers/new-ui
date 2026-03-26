import React from 'react';
import classNames from 'classnames';
import styles from './SectionFieldSuffixInput.module.scss';

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

export type SectionFieldSuffixInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    className?: string;
    controlClassName?: string;
    inputClassName?: string;
    suffix: React.ReactNode;
    suffixClassName?: string;
    suffixMinWidth?: number | string;
    textAlign?: 'left' | 'center' | 'right';
};

type SectionFieldSuffixInputCssProperties = React.CSSProperties & {
    '--granter-section-field-suffix-input-suffix-min-width'?: string;
    '--granter-section-field-suffix-input-text-align'?: 'left' | 'center' | 'right';
};

const SectionFieldSuffixInput = React.forwardRef<HTMLInputElement, SectionFieldSuffixInputProps>(
    (
        {
            className,
            controlClassName,
            inputClassName,
            suffix,
            suffixClassName,
            suffixMinWidth,
            textAlign = 'left',
            disabled = false,
            type = 'text',
            ...props
        },
        ref
    ) => {
        const cssVariables: SectionFieldSuffixInputCssProperties = {
            '--granter-section-field-suffix-input-suffix-min-width': toCssLength(suffixMinWidth),
            '--granter-section-field-suffix-input-text-align': textAlign,
        };

        return (
            <div className={classNames(styles.Root, className)} style={cssVariables}>
                <div className={classNames(styles.Control, controlClassName)} data-disabled={disabled ? 'true' : 'false'}>
                    <input
                        ref={ref}
                        type={type}
                        className={classNames(styles.Input, inputClassName)}
                        disabled={disabled}
                        {...props}
                    />
                    <span className={classNames(styles.Suffix, suffixClassName)} aria-hidden="true">
                        {suffix}
                    </span>
                </div>
            </div>
        );
    }
);

SectionFieldSuffixInput.displayName = 'SectionFieldSuffixInput';

export default SectionFieldSuffixInput;
