import React from 'react';
import styles from './SummaryStatItem.module.scss';

export type SummaryStatItemProps = {
    title: string;
    value: string | number;
    iconSrc: string;
    iconAlt?: string;
    showSeparator?: boolean;
    children?: React.ReactNode;
};

const SummaryStatItem = ({ title, value, iconSrc, iconAlt, showSeparator = true, children }: SummaryStatItemProps) => (
    <div className={styles.Item}>
        <div className={styles.Left}>
            <div className={styles.Title}>{title}</div>
            <div className={styles.InfoWrapper}>
                <div className={styles.Value}>{value}</div>
                {children}
            </div>
        </div>

        <div className={styles.Right}>
            <img src={iconSrc} alt={iconAlt ?? title} />
            {showSeparator ? <div className={styles.Separator} /> : null}
        </div>
    </div>
);

export default SummaryStatItem;
