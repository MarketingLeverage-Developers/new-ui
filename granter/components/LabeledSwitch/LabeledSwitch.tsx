import React from 'react';
import classNames from 'classnames';
import HeadlessToggle, { useToggle as useHeadlessToggle } from '../../../shared/headless/Toggle/Toggle';
import styles from './LabeledSwitch.module.scss';

export type LabeledSwitchProps = {
    label?: React.ReactNode;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    ariaLabel?: string;
    className?: string;
};

type TriggerProps = Pick<LabeledSwitchProps, 'label' | 'disabled' | 'ariaLabel' | 'className'>;

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

const LabeledSwitch = ({
    label,
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    ariaLabel = typeof label === 'string' ? label : '토글',
    className,
}: LabeledSwitchProps) => (
    <HeadlessToggle value={checked} defaultValue={defaultChecked} onChange={onChange}>
        <Trigger label={label} disabled={disabled} ariaLabel={ariaLabel} className={className} />
    </HeadlessToggle>
);

export default LabeledSwitch;
