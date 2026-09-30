import React from 'react';
import { FiInbox } from 'react-icons/fi';
import styles from './EmptyFallback.module.scss';

type EmptyFallbackProps = {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    variant?: 'page' | 'inline';
};

const EmptyFallback: React.FC<EmptyFallbackProps> = ({
    title = '표시할 데이터가 없어요',
    description,
    actionLabel,
    onAction,
    variant = 'page',
}) => (
    <div className={styles.Root} data-variant={variant} role="status">
        <FiInbox className={styles.Icon} aria-hidden="true" />
        <strong className={styles.Title}>{title}</strong>
        {description ? <p className={styles.Description}>{description}</p> : null}
        {actionLabel && onAction ? (
            <button className={styles.ActionButton} type="button" onClick={onAction}>
                {actionLabel}
            </button>
        ) : null}
    </div>
);

export default EmptyFallback;
