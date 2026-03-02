import React from 'react';
import styles from './GranterHomeTagGrid.module.scss';

export type GranterHomeTagItem = {
    key: string;
    name: React.ReactNode;
    inAmount: React.ReactNode;
    outAmount: React.ReactNode;
};

export type GranterHomeTagGridProps = {
    items: GranterHomeTagItem[];
};

const GranterHomeTagGrid = ({ items }: GranterHomeTagGridProps) => (
    <div className={styles.TagGrid}>
        {items.map((item) => (
            <button key={item.key} type="button" className={styles.TagCard}>
                <div className={styles.TagHead}>
                    <span className={styles.TagIcon}>#</span>
                    <span className={styles.TagName}>{item.name}</span>
                </div>
                <p className={styles.TagIncome}>{item.inAmount}</p>
                <p className={styles.TagExpense}>{item.outAmount}</p>
            </button>
        ))}
    </div>
);

export default GranterHomeTagGrid;
