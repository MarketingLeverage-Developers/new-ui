import React from 'react';
import classNames from 'classnames';
import { GoCheck, GoX } from 'react-icons/go';
import styles from './MediaSelectCard.module.scss';

export type MediaSelectCardStatusTone = 'connected' | 'warning' | 'muted';

export type MediaSelectCardProps = {
    name: string;
    logoSrc: string;
    statusLabel: string;
    statusTone?: MediaSelectCardStatusTone;
    selected?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
    className?: string;
};

const MediaSelectCard = ({
    name,
    logoSrc,
    statusLabel,
    statusTone = 'muted',
    selected = false,
    onClick,
    onDelete,
    className,
}: MediaSelectCardProps) => (
    <button
        type="button"
        className={classNames(styles.Card, className)}
        data-selected={selected ? 'true' : 'false'}
        onClick={onClick}
        aria-pressed={selected}
    >
        <span className={styles.SelectedMark} aria-hidden="true">
            <GoCheck size={10} />
        </span>

        {onDelete && (
            <span
                role="button"
                aria-label={`${name} 삭제`}
                className={styles.DeleteBtn}
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
            >
                <GoX size={12} />
            </span>
        )}

        <span className={styles.LogoWrap}>
            <img src={logoSrc} alt={`${name}-logo`} width={24} height={24} className={styles.Logo} />
        </span>

        <span className={styles.Name}>{name}</span>

        <span className={classNames(styles.StatusChip, styles[`StatusChip${statusTone[0].toUpperCase()}${statusTone.slice(1)}`])}>
            {statusLabel}
        </span>
    </button>
);

export default MediaSelectCard;
