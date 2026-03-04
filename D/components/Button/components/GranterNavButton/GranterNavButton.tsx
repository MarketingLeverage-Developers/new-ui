import React from 'react';
import classNames from 'classnames';
import styles from './GranterNavButton.module.scss';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type GranterNavButtonProps = {
    label: React.ReactNode;
    icon?: IconType;
    badge?: React.ReactNode;
    endSlot?: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
};

const GranterNavButton = ({ label, icon, badge, endSlot, active, disabled, onClick }: GranterNavButtonProps) => {
    const Icon = icon;
    return (
        <button
            type="button"
            disabled={disabled}
            className={classNames(styles.NavButton, {
                [styles.NavButtonActive]: active,
                [styles.NavButtonDisabled]: disabled,
            })}
            onClick={onClick}
        >
            <span className={styles.Start}>
                {Icon && <Icon className={styles.Icon} />}
                <span className={styles.Label}>{label}</span>
            </span>

            <span className={styles.End}>
                {badge ? <span className={styles.Badge}>{badge}</span> : null}
                {endSlot}
            </span>
        </button>
    );
};

export default GranterNavButton;
