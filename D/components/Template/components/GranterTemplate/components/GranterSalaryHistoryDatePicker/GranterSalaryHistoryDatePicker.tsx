import React from 'react';
import GranterSimpleDateRange from '../GranterSimpleDateRange/GranterSimpleDateRange';
import styles from './GranterSalaryHistoryDatePicker.module.scss';

export type GranterSalaryHistoryDatePickerProps = {
    dateRangeLabel: React.ReactNode;
    onPrevClick?: () => void;
    onNextClick?: () => void;
};

const GranterSalaryHistoryDatePicker = ({
    dateRangeLabel,
    onPrevClick,
    onNextClick,
}: GranterSalaryHistoryDatePickerProps) => (
    <div className={styles.Wrap}>
        <GranterSimpleDateRange dateRangeLabel={dateRangeLabel} onPrevClick={onPrevClick} onNextClick={onNextClick} />
    </div>
);

export default GranterSalaryHistoryDatePicker;
