import React from 'react';
import GranterBaseButton from '../GranterBaseButton/GranterBaseButton';
import styles from './GranterPageTopBar.module.scss';

export type GranterPageTopBarProps = {
    className?: string;
    breadcrumb: React.ReactNode;
    dateRangeLabel?: React.ReactNode;
    rightSlot?: React.ReactNode;
    onBackClick?: () => void;
    onPrevDateRangeClick?: () => void;
    onNextDateRangeClick?: () => void;
};

const GranterPageTopBar = ({
    className,
    breadcrumb,
    dateRangeLabel,
    rightSlot,
    onBackClick,
    onPrevDateRangeClick,
    onNextDateRangeClick,
}: GranterPageTopBarProps) => (
    <div className={[styles.TopBar, className ?? ''].filter(Boolean).join(' ')}>
        <div className={styles.LeftSection}>
            <GranterBaseButton
                width={40}
                height={40}
                padding={0}
                className={styles.RoundButton}
                aria-label="뒤로가기"
                onClick={onBackClick}
            >
                {'<'}
            </GranterBaseButton>
            <span className={styles.Breadcrumb}>{breadcrumb}</span>
        </div>

        <div className={styles.CenterSection}>
            <div className={styles.DateRangeBox}>
                <button
                    type="button"
                    className={styles.DateArrowButton}
                    aria-label="이전 기간"
                    onClick={onPrevDateRangeClick}
                >
                    {'<'}
                </button>
                <span className={styles.DateRangeLabel}>{dateRangeLabel}</span>
                <button
                    type="button"
                    className={styles.DateArrowButton}
                    aria-label="다음 기간"
                    onClick={onNextDateRangeClick}
                >
                    {'>'}
                </button>
            </div>
        </div>

        <div className={styles.RightSection}>{rightSlot}</div>
    </div>
);

export default GranterPageTopBar;
