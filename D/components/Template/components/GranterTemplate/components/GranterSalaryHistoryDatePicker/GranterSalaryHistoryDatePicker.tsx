import React from 'react';
import GranterSimpleDateRange from '../GranterSimpleDateRange/GranterSimpleDateRange';
import styles from './GranterSalaryHistoryDatePicker.module.scss';
import RangeDatePicker from '@/shared/primitives/RangeDatePicker/RangeDatePicker';

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
        <RangeDatePicker dateRangeLabel={dateRangeLabel} onPrevClick={onPrevClick} onNextClick={onNextClick} />
    </div>
);

export default GranterSalaryHistoryDatePicker;
