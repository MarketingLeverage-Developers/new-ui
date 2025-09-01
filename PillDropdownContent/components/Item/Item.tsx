import React from 'react';
import styles from './Item.module.scss';

type ItemProps = {
    children: React.ReactNode;
    onClick?: () => void;
};

export const Item = ({ children, onClick }: ItemProps) => (
    <div className={styles.Item} onClick={onClick}>
        {children}
    </div>
);
