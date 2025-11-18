import React from 'react';
import moment from 'moment';
import 'moment/dist/locale/ko';
import styles from '../SummaryInfoBox.module.scss';
import icon from '@/shared/assets/images/clock-icon.svg';
moment.locale('ko');

type Props = {
    start?: string;
    end?: string;
};

const DurationRow = ({ start, end }: Props) => {
    let displayText = '';

    if (start && end) {
        displayText = start === end ? start : `${start} - ${end}`;
    } else if (start) {
        displayText = start;
    } else if (end) {
        displayText = end;
    } else {
        displayText = '미정';
    }

    return (
        <div className={styles.Row}>
            <img src={icon} alt="" />
            <span className={styles.textContent}>{displayText}</span>
        </div>
    );
};

export default DurationRow;
