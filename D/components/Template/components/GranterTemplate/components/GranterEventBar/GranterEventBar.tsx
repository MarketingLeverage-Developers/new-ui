import React from 'react';
import styles from './GranterEventBar.module.scss';

export type GranterEventBarProps = {
    message: React.ReactNode;
    actionLabel?: React.ReactNode;
    onActionClick?: () => void;
    color?: 'sky' | 'pink' | 'yellow';
};

const GranterEventBar = ({ message, actionLabel, onActionClick, color = 'pink' }: GranterEventBarProps) => (
    <div className={styles.EventBar} data-color={color}>
        <div className={styles.Inner}>
            <span className={styles.Icon}>▲</span>
            <p className={styles.Message}>{message}</p>
            {actionLabel ? (
                <button type="button" className={styles.Action} onClick={onActionClick}>
                    {actionLabel}
                </button>
            ) : null}
        </div>
    </div>
);

export default GranterEventBar;
