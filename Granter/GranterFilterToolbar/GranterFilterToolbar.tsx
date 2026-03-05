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

            <GranterBaseButton variant="soft" size="md" onClick={onBulkEditClick}>
                다중 수정
            </GranterBaseButton>
            <GranterBaseButton variant="soft" size="md" onClick={onAutoCategorizeClick}>
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

            <GranterBaseButton
                variant="outline"
                size="md"
                leftIcon={<FiDownload size={16} />}
                onClick={onDownloadClick}
            >
                {downloadLabel}
            </GranterBaseButton>
            <GranterBaseButton
                variant="outline"
                size="icon"
                leftIcon={<FiSettings size={17} />}
                aria-label="필터 설정"
                onClick={onSettingClick}
            />
        </div>
    </section>
);

export default GranterFilterToolbar;
