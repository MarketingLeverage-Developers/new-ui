import React from 'react';
import { FiDownload, FiLoader, FiPause, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import styles from './CardsMainContent.module.scss';

const noop = () => undefined;

export type CardsMainContentProps = {
    title?: string;
    statusMessage?: string;
    sortLabel?: string;
    onRefreshSummary?: () => void;
    onPauseSummary?: () => void;
    onDownload?: () => void;
    onSortClick?: () => void;
    onSearchClick?: () => void;
};

const CardsMainContent = ({
    title = '지출 0원',
    statusMessage = '최근 12개월 치 데이터를 불러온 후 정리하고 있어요. 1시간 이상 소요될 수 있어요.',
    sortLabel = '사용금액순',
    onRefreshSummary = noop,
    onPauseSummary = noop,
    onDownload = noop,
    onSortClick = noop,
    onSearchClick = noop,
}: CardsMainContentProps) => (
    <div className={styles.CardsMainContent}>
        <div className={styles.StatusRow}>
            <span className={styles.LoaderWrap} aria-hidden="true">
                <FiLoader size={17} />
            </span>
            <span className={styles.StatusMessage}>{statusMessage}</span>
        </div>

        <section className={styles.Content}>
            <div className={styles.TopRow}>
                <div className={styles.LeftActions}>
                    <h1 className={styles.Title}>{title}</h1>

                    <button type="button" className={styles.ControlButton} aria-label="요약 새로고침" onClick={onRefreshSummary}>
                        <FiRefreshCw size={14} />
                    </button>

                    <button type="button" className={styles.ControlButton} aria-label="요약 일시정지" onClick={onPauseSummary}>
                        <FiPause size={14} />
                    </button>

                    <button type="button" className={styles.PrimaryButton}>
                        전체내역
                    </button>
                </div>

                <button type="button" className={styles.DownloadButton} onClick={onDownload}>
                    <FiDownload size={14} />
                    <span>다운로드</span>
                </button>
            </div>

            <div className={styles.FilterRow}>
                <button type="button" className={styles.SortButton} onClick={onSortClick}>
                    <span>{sortLabel}</span>
                    <HiOutlineChevronDown size={14} />
                </button>

                <button type="button" className={styles.SearchButton} aria-label="검색" onClick={onSearchClick}>
                    <FiSearch size={17} />
                </button>
            </div>
        </section>
    </div>
);

export default CardsMainContent;
