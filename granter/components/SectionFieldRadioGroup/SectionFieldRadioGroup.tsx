import type { ReactNode } from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './SectionFieldRadioGroup.module.scss';

export type SectionFieldRadioGroupOption = {
    value: string;
    label: ReactNode;
    description?: ReactNode;
    right?: ReactNode;
    disabled?: boolean;
};

export type SectionFieldRadioGroupProps = {
    options: SectionFieldRadioGroupOption[];
    value?: string;
    helperText?: React.ReactNode;
    disabled?: boolean;
    className?: string;
    optionClassName?: string;
    onChange?: (value: string) => void;
};

const SectionFieldRadioGroup = ({
    options,
    value,
    helperText,
    disabled = false,
    className,
    optionClassName,
    onChange,
}: SectionFieldRadioGroupProps) => (
    <div className={classNames(styles.Root, className)}>
        {helperText ? (
            <Text size="sm" tone="muted" className={styles.HelperText}>
                {helperText}
            </Text>
        ) : null}
        <div className={styles.List} role="radiogroup">
            {options.map((option) => {
                const selected = value === option.value;
                const optionDisabled = disabled || option.disabled;

                return (
                    <button
                        key={option.value}
                        type="button"
                        className={classNames(styles.Option, optionClassName)}
                        data-selected={selected ? 'true' : 'false'}
                        disabled={optionDisabled}
                        role="radio"
                        aria-checked={selected}
                        onClick={() => {
                            if (!optionDisabled) onChange?.(option.value);
                        }}
                    >
                        <svg
                            className={styles.Indicator}
                            viewBox="0 0 24 24"
                            focusable="false"
                            aria-hidden="true"
                        >
                            <circle className={styles.IndicatorHalo} cx="12" cy="12" r="12" />
                            <circle className={styles.IndicatorRing} cx="12" cy="12" r="10" />
                            <circle className={styles.IndicatorDot} cx="12" cy="12" r="5" />
                        </svg>
                        <span className={styles.Copy}>
                            <span className={styles.Label}>{option.label}</span>
                            {option.description ? (
                                <span className={styles.Description}>{option.description}</span>
                            ) : null}
                        </span>
                        {option.right ? <span className={styles.Right}>{option.right}</span> : null}
                    </button>
                );
            })}
        </div>
    </div>
);

export default SectionFieldRadioGroup;
