import React, { useState } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';
import styles from './GranterSimpleDateRange.module.scss';

export type GranterSimpleDateRangePreset = {
    key: string;
    label: React.ReactNode;
};

export type GranterSimpleDateRangeProps = {
    dateRangeLabel: React.ReactNode;
    showRecentPresets?: boolean;
    recentPresets?: GranterSimpleDateRangePreset[];
    onPrevClick?: () => void;
    onNextClick?: () => void;
    onRecentSelect?: (presetKey: string) => void;
};

const DEFAULT_RECENT_PRESETS: GranterSimpleDateRangePreset[] = [
    { key: 'last-180-days', label: '최근 180일' },
    { key: 'last-60-days', label: '최근 60일' },
    { key: 'last-30-days', label: '최근 30일' },
    { key: 'last-7-days', label: '최근 7일' },
    { key: 'today', label: '오늘' },
];

const GranterSimpleDateRange = ({
    dateRangeLabel,
    showRecentPresets,
    recentPresets = DEFAULT_RECENT_PRESETS,
    onPrevClick,
    onNextClick,
    onRecentSelect,
}: GranterSimpleDateRangeProps) => {
    const [isRecentOpen, setIsRecentOpen] = useState(false);

    return (
        <div className={styles.Wrap}>
            <div className={styles.RangePill}>
                <button type="button" className={styles.IconButton} onClick={onPrevClick}>
                    <FiChevronLeft size={14} />
                </button>
                <FiCalendar size={14} />
                <span>{dateRangeLabel}</span>
                <button type="button" className={styles.IconButton} onClick={onNextClick}>
                    <FiChevronRight size={14} />
                </button>
            </div>

            {showRecentPresets ? (
                <div className={styles.RecentWrap}>
                    <button type="button" className={styles.IconButton} onClick={() => setIsRecentOpen((prev) => !prev)}>
                        <FiMoreHorizontal size={14} />
                    </button>
                    {isRecentOpen ? (
                        <div className={styles.RecentPanel}>
                            {recentPresets.map((preset) => (
                                <button
                                    key={preset.key}
                                    type="button"
                                    className={styles.RecentButton}
                                    onClick={() => {
                                        onRecentSelect?.(preset.key);
                                        setIsRecentOpen(false);
                                    }}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
};

export default GranterSimpleDateRange;
