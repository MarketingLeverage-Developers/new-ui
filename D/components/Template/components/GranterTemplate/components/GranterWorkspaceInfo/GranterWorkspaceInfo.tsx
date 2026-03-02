import React from 'react';
import styles from './GranterWorkspaceInfo.module.scss';

export type GranterWorkspaceInfoProps = {
    avatar?: React.ReactNode;
    title: React.ReactNode;
    meta?: React.ReactNode;
    onClick?: () => void;
    showToggle?: boolean;
    onToggleClick?: () => void;
};

const GranterWorkspaceInfo = ({ avatar, title, meta, onClick, showToggle, onToggleClick }: GranterWorkspaceInfoProps) => (
    <div className={styles.Wrap}>
        <button type="button" className={styles.MainButton} onClick={onClick}>
            {avatar ? <span className={styles.Avatar}>{avatar}</span> : null}

            <span className={styles.Copy}>
                <span className={styles.Title}>{title}</span>
                {meta ? <span className={styles.Meta}>{meta}</span> : null}
            </span>
        </button>

        {showToggle ? (
            <button type="button" className={styles.ToggleButton} onClick={onToggleClick}>
                ‹
            </button>
        ) : null}
    </div>
);

export default GranterWorkspaceInfo;
