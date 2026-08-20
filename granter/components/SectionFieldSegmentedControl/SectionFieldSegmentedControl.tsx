import type { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './SectionFieldSegmentedControl.module.scss';

export type SectionFieldSegmentedControlOption = {
    value: string;
    label: ReactNode;
    disabled?: boolean;
};

export type SectionFieldSegmentedControlProps = {
    options: SectionFieldSegmentedControlOption[];
    value?: string;
    disabled?: boolean;
    className?: string;
    ariaLabel?: string;
    onChange?: (value: string) => void;
};

const SectionFieldSegmentedControl = ({
    options,
    value,
    disabled = false,
    className,
    ariaLabel,
    onChange,
}: SectionFieldSegmentedControlProps) => (
    <div
        className={classNames(styles.Root, className)}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-disabled={disabled}
    >
        {options.map((option) => {
            const selected = value === option.value;
            const optionDisabled = disabled || option.disabled;

            return (
                <button
                    key={option.value}
                    type="button"
                    className={styles.Option}
                    role="radio"
                    aria-checked={selected}
                    data-selected={selected ? 'true' : 'false'}
                    disabled={optionDisabled}
                    onClick={() => {
                        if (!optionDisabled && !selected) onChange?.(option.value);
                    }}
                >
                    {option.label}
                </button>
            );
        })}
    </div>
);

export default SectionFieldSegmentedControl;
