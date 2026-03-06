import React from 'react';
import { FiDownload, FiSearch, FiSettings, FiX } from 'react-icons/fi';
import GranterBaseButton from '../GranterBaseButton/GranterBaseButton';
import styles from './GranterFilterToolbar.module.scss';

export type GranterFilterToolbarProps = {
    className?: string;
    searchValue: string;
    searchPlaceholder?: string;
    showExcluded?: boolean;
    downloadLabel?: React.ReactNode;
    rightSlot?: React.ReactNode;
    onSearchChange?: (value: string) => void;
    onSearchClear?: () => void;
    onBulkEditClick?: () => void;
    onAutoCategorizeClick?: () => void;
    onShowExcludedChange?: (nextValue: boolean) => void;
    onDownloadClick?: () => void;
    onSettingClick?: () => void;
};

const GranterFilterToolbar = ({
    className,
    searchValue,
    searchPlaceholder = '사용처, 계정과목, 사유, 태그, 사업자번호 검색',
    showExcluded = false,
    downloadLabel = '다운로드',
    rightSlot,
    onSearchChange,
    onSearchClear,
    onBulkEditClick,
    onAutoCategorizeClick,
    onShowExcludedChange,
    onDownloadClick,
    onSettingClick,
}: GranterFilterToolbarProps) => (
    <section className={[styles.Toolbar, className ?? ''].filter(Boolean).join(' ')}>
        <div className={styles.LeftGroup}>
            <div className={styles.SearchField}>
                <FiSearch size={18} />
                <input
                    value={searchValue}
                    placeholder={searchPlaceholder}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                />
                {searchValue ? (
                    <button type="button" className={styles.ClearButton} aria-label="검색어 지우기" onClick={onSearchClear}>
                        <FiX size={15} />
                    </button>
                ) : null}
            </div>

            <GranterBaseButton bgColor="#f1f3f7" textColor="#354057" style={{ borderColor: '#f1f3f7' }} onClick={onBulkEditClick}>
                다중 수정
            </GranterBaseButton>
            <GranterBaseButton
                bgColor="#f1f3f7"
                textColor="#354057"
                style={{ borderColor: '#f1f3f7' }}
                onClick={onAutoCategorizeClick}
            >
                분류 자동화
            </GranterBaseButton>
        </div>

        <div className={styles.RightGroup}>
            {rightSlot}
            <label className={styles.Toggle} htmlFor="granter-filter-excluded-toggle">
                <button
                    id="granter-filter-excluded-toggle"
                    type="button"
                    role="switch"
                    aria-checked={showExcluded}
                    className={[styles.ToggleButton, showExcluded ? styles.ToggleButtonChecked : ''].filter(Boolean).join(' ')}
                    onClick={() => onShowExcludedChange?.(!showExcluded)}
                >
                    <span />
                </button>
                <span className={styles.ToggleText}>제외내역 보기</span>
            </label>

            <GranterBaseButton onClick={onDownloadClick}>
                <FiDownload size={16} />
                {downloadLabel}
            </GranterBaseButton>
            <GranterBaseButton
                width={40}
                height={40}
                padding={0}
                aria-label="필터 설정"
                onClick={onSettingClick}
            >
                <FiSettings size={17} />
            </GranterBaseButton>
        </div>
    </section>
);

export default GranterFilterToolbar;
