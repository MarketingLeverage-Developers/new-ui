import React from 'react';
import styles from '../SummaryInfoBox.module.scss';

import moment from 'moment';
import 'moment/dist/locale/ko';
moment.locale('ko');

type Props = {
    icon: string;
    requestTime?: string;
};
const Header = ({ icon, requestTime }: Props) => {
    const date = moment(requestTime)?.format('YYYY.MM.DD (ddd)');
    const time = moment(requestTime)?.format('HH:mm');
    return (
        <div className={styles.SummartInfoBoxHeader}>
            <div className={styles.TitleWrapper}>
                <img src={icon} alt="" />
                <span>요청 정보</span>
            </div>
            {time && (
                <div className={styles.TimeWrpper}>
                    요청시간 : <span>{date}</span> <strong>{time}</strong>
                </div>
            )}
        </div>
    );
};

export default Header;
