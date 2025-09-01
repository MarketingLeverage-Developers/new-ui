import React from 'react';
import Flex from '../Flex/Flex';
import styles from './Summary.module.scss';

type SummaryProps = {
    children?: React.ReactNode;
};

const Summary = ({ children }: SummaryProps) => <Flex gap={24}>{children}</Flex>;

type ItemProps = {
    title: string;
    value: string | number;
    icon: string;
    children?: React.ReactNode;
    isSeparator?: boolean;
};

const Item = ({ title, value, icon, children, isSeparator = true }: ItemProps) => (
    <div className={styles.Item}>
        <div className={styles.left}>
            <div className={styles.Title}>{title}</div>
            <div className={styles.infoWrapper}>
                <div className={styles.Value}>{value}</div>
                {children}
            </div>
        </div>
        <div className={styles.Right}>
            <img src={icon} alt={icon} />
            {isSeparator ? <div className={styles.Separator}></div> : <></>}
        </div>
    </div>
);

Summary.Item = Item;

export default Summary;
