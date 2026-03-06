import React from 'react';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';
import GranterBaseButton from '../GranterBaseButton/GranterBaseButton';
import styles from './GranterCardsHeader.module.scss';

export type GranterCardsHeaderProps = {
    className?: string;
    title?: React.ReactNode;
    amount?: React.ReactNode;
    sortLabel?: React.ReactNode;
    downloadLabel?: React.ReactNode;
    rightSlot?: React.ReactNode;
    onRefreshClick?: () => void;
    onPauseClick?: () => void;
    onViewAllClick?: () => void;
    onDownloadClick?: () => void;
    onSortClick?: () => void;
};

const GranterCardsHeader = ({
    className,
    title = '지출',
    amount = '0원',
    sortLabel = '사용금액순',
    downloadLabel = '다운로드',
    rightSlot,
    onRefreshClick,
    onPauseClick,
    onViewAllClick,
    onDownloadClick,
    onSortClick,
}: GranterCardsHeaderProps) => (
    <header className={[styles.CardsHeader, className ?? ''].filter(Boolean).join(' ')}>
        <div className={styles.FirstRow}>
            <div className={styles.LeftGroup}>
                <h2 className={styles.Title}>
                    <span>{title}</span>
                    <strong>{amount}</strong>
                </h2>
                <div className={styles.Actions}>
                    <GranterBaseButton
                        width={40}
                        height={40}
                        padding={0}
                        aria-label="새로고침"
                        onClick={onRefreshClick}
                    >
                        <FiRefreshCw size={16} />
                    </GranterBaseButton>
                    <GranterBaseButton width={40} height={40} padding={0} aria-label="일시정지" onClick={onPauseClick}>
                        {'||'}
                    </GranterBaseButton>
                    <GranterBaseButton bgColor="#191b20" textColor="#ffffff" style={{ borderColor: '#191b20' }} onClick={onViewAllClick}>
                        전체내역
                    </GranterBaseButton>
                </div>
            </div>

            <div className={styles.RightGroup}>
                {rightSlot}
                <GranterBaseButton onClick={onDownloadClick}>
                    <FiDownload size={16} />
                    {downloadLabel}
                </GranterBaseButton>
            </div>
        </div>

        <div className={styles.SecondRow}>
            <button type="button" className={styles.SortButton} onClick={onSortClick}>
                <span>{sortLabel}</span>
                <span aria-hidden>v</span>
            </button>
        </div>
    </header>
);

export default GranterCardsHeader;
