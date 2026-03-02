import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './GranterDateSwaperWithPanel.module.scss';

export type GranterDatePreset = {
    key: string;
    label: React.ReactNode;
};

export type GranterDateSwaperWithPanelProps = {
    dateRangeLabel: React.ReactNode;
    isDefault?: boolean;
    showArrows?: boolean;
    panelOpen?: boolean;
    leftPresets?: GranterDatePreset[];
    rightPresets?: GranterDatePreset[];
    onPrevClick?: () => void;
    onNextClick?: () => void;
    onPresetClick?: (presetKey: string) => void;
    onMonthPresetClick?: (presetKey: string) => void;
    onOpenChange?: (nextOpen: boolean) => void;
};

const DEFAULT_PRESETS: GranterDatePreset[] = [
    { key: 'today', label: '오늘' },
    { key: 'yesterday', label: '어제' },
    { key: 'this-month', label: '이번 달' },
    { key: 'last-month', label: '지난 달' },
    { key: 'last-7-days', label: '최근 7일' },
    { key: 'last-30-days', label: '최근 30일' },
];

const DEFAULT_MONTH_PRESETS: GranterDatePreset[] = Array.from({ length: 12 }, (_, index) => ({
    key: `month-${index + 1}`,
    label: `${index + 1}월`,
}));

const GranterDateSwaperWithPanel = ({
    dateRangeLabel,
    isDefault = true,
    showArrows = true,
    panelOpen,
    leftPresets = DEFAULT_PRESETS,
    rightPresets = DEFAULT_MONTH_PRESETS,
    onPrevClick,
    onNextClick,
    onPresetClick,
    onMonthPresetClick,
    onOpenChange,
}: GranterDateSwaperWithPanelProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const [innerOpen, setInnerOpen] = useState(false);
    const isControlled = panelOpen !== undefined;
    const open = isControlled ? panelOpen : innerOpen;

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (!open) return;
            if (!rootRef.current?.contains(event.target as Node)) {
                if (!isControlled) setInnerOpen(false);
                onOpenChange?.(false);
            }
        };

        window.addEventListener('mousedown', handleOutsideClick);
        return () => window.removeEventListener('mousedown', handleOutsideClick);
    }, [isControlled, onOpenChange, open]);

    const togglePanel = () => {
        const next = !open;
        if (!isControlled) setInnerOpen(next);
        onOpenChange?.(next);
    };

    return (
        <div ref={rootRef} className={styles.Wrap}>
            <div className={styles.Bar}>
                {showArrows ? (
                    <button type="button" className={styles.ArrowButton} onClick={onPrevClick}>
                        <FiChevronLeft size={14} />
                    </button>
                ) : null}

                <button
                    type="button"
                    className={classNames(styles.DateButton, {
                        [styles.DateButtonDefault]: isDefault,
                        [styles.DateButtonActive]: !isDefault,
                    })}
                    onClick={togglePanel}
                >
                    <span className={styles.DateText}>{dateRangeLabel}</span>
                </button>

                {showArrows ? (
                    <button type="button" className={styles.ArrowButton} onClick={onNextClick}>
                        <FiChevronRight size={14} />
                    </button>
                ) : null}
            </div>

            {open ? (
                <div className={styles.Panel}>
                    <div className={classNames(styles.PanelColumn, styles.PanelColumnEdge)}>
                        {leftPresets.map((preset) => (
                            <button
                                key={preset.key}
                                type="button"
                                className={styles.PresetButton}
                                onClick={() => onPresetClick?.(preset.key)}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles.PanelColumn}>
                        <div className={styles.CalendarPlaceholder}>
                            <p>날짜 범위 선택 패널</p>
                            <div className={styles.CalendarGrid}>
                                {Array.from({ length: 35 }).map((_, index) => (
                                    <span key={`cell-${index}`} className={styles.CalendarCell} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={classNames(styles.PanelColumn, styles.PanelColumnEdge)}>
                        {rightPresets.map((preset) => (
                            <button
                                key={preset.key}
                                type="button"
                                className={styles.PresetButton}
                                onClick={() => onMonthPresetClick?.(preset.key)}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default GranterDateSwaperWithPanel;
