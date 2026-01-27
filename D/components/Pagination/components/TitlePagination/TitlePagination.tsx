import React from 'react';
import styles from './TitlePagination.module.scss';

export type TitlePaginationProps = {
    title: string;
    canPrev: boolean;
    canNext: boolean;
    onPrev: () => void;
    onNext: () => void;
    className?: string;
    prevAriaLabel?: string;
    nextAriaLabel?: string;
};

const TitlePagination = ({
    title,
    canPrev,
    canNext,
    onPrev,
    onNext,
    className,
    prevAriaLabel = '이전',
    nextAriaLabel = '다음',
}: TitlePaginationProps) => (
    <div className={[styles.TitlePagination, className].filter(Boolean).join(' ')}>
        <div className={styles.NavGroup}>
            <button
                type="button"
                className={[styles.NavButton, !canPrev ? styles.NavButtonDisabled : ''].filter(Boolean).join(' ')}
                aria-label={prevAriaLabel}
                disabled={!canPrev}
                onClick={onPrev}
            >
                ‹
            </button>

            <h3 className={styles.Title}>{title}</h3>

            <button
                type="button"
                className={[styles.NavButton, !canNext ? styles.NavButtonDisabled : ''].filter(Boolean).join(' ')}
                aria-label={nextAriaLabel}
                disabled={!canNext}
                onClick={onNext}
            >
                ›
            </button>
        </div>
    </div>
);

export default TitlePagination;
