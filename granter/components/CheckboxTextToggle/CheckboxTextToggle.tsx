import React from 'react';
import classNames from 'classnames';
import HeadlessToggle, { useToggle as useHeadlessToggle } from '../../../shared/headless/Toggle/Toggle';
import styles from './CheckboxTextToggle.module.scss';

export type CheckboxTextToggleProps = {
    label?: React.ReactNode;
    value?: boolean;
    defaultValue?: boolean;
    onValueChange?: (next: boolean) => void;
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
};

type TriggerProps = {
    label?: React.ReactNode;
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
};

const Trigger = ({ label, disabled = false, ariaLabel, className }: TriggerProps) => {
    const { toggleValue } = useHeadlessToggle();

    return (
        <HeadlessToggle.Trigger
            type="button"
            role="switch"
            aria-checked={toggleValue}
            aria-label={ariaLabel}
            disabled={disabled}
            className={classNames(styles.Trigger, className)}
            data-on={toggleValue ? 'true' : 'false'}
        >
            <span className={styles.Track} aria-hidden="true">
                <span className={styles.Thumb} />
            </span>
            {label ? <span className={styles.Label}>{label}</span> : null}
        </HeadlessToggle.Trigger>
    );
};

const CheckboxTextToggle = ({
    label,
    value,
    defaultValue = false,
    onValueChange,
    disabled = false,
    ariaLabel = typeof label === 'string' ? label : '토글',
    className,
}: CheckboxTextToggleProps) => (
    <HeadlessToggle value={value} defaultValue={defaultValue} onChange={onValueChange}>
        <Trigger label={label} disabled={disabled} ariaLabel={ariaLabel} className={className} />
    </HeadlessToggle>
);

export default CheckboxTextToggle;
