import React from 'react';
import GranterDateSwaper from '../GranterDateSwaper/GranterDateSwaper';
import GranterSimpleDateRange from '../GranterSimpleDateRange/GranterSimpleDateRange';
import GranterSalaryHistoryDatePicker from '../GranterSalaryHistoryDatePicker/GranterSalaryHistoryDatePicker';
import styles from './GranterHeaderDatePicker.module.scss';

export type GranterHeaderDatePickerMode = 'default' | 'simple' | 'salary';

export type GranterHeaderDatePickerProps = {
    mode?: GranterHeaderDatePickerMode;
    dateRangeLabel: React.ReactNode;
    onPrevClick?: () => void;
    onNextClick?: () => void;
};

const GranterHeaderDatePicker = ({
    mode = 'default',
    dateRangeLabel,
    onPrevClick,
    onNextClick,
}: GranterHeaderDatePickerProps) => {
    if (mode === 'salary') {
        return (
            <div className={styles.Wrap}>
                <GranterSalaryHistoryDatePicker
                    dateRangeLabel={dateRangeLabel}
                    onPrevClick={onPrevClick}
                    onNextClick={onNextClick}
                />
            </div>
        );
    }

    if (mode === 'simple') {
        return (
            <div className={styles.Wrap}>
                <GranterSimpleDateRange
                    dateRangeLabel={dateRangeLabel}
                    showRecentPresets
                    onPrevClick={onPrevClick}
                    onNextClick={onNextClick}
                />
            </div>
        );
    }

    return (
        <div className={styles.Wrap}>
            <GranterDateSwaper dateRangeLabel={dateRangeLabel} onPrevClick={onPrevClick} onNextClick={onNextClick} />
        </div>
    );
};

export default GranterHeaderDatePicker;
