import React from 'react';
import styles from './GranterSummaryStatCards.module.scss';

export type GranterSummaryStatCardItem = {
    key: string;
    label: React.ReactNode;
    value: React.ReactNode;
    subValue?: React.ReactNode;
    trailing?: React.ReactNode;
    highlighted?: boolean;
};

export type GranterSummaryStatCardsProps = {
    className?: string;
    items: GranterSummaryStatCardItem[];
};

const GranterSummaryStatCards = ({ className, items }: GranterSummaryStatCardsProps) => (
    <section className={[styles.Cards, className ?? ''].filter(Boolean).join(' ')}>
        {items.map((item) => (
            <article key={item.key} className={[styles.Card, item.highlighted ? styles.Highlighted : ''].join(' ')}>
                <div className={styles.Head}>
                    <p className={styles.Label}>{item.label}</p>
                    {item.trailing ? <div className={styles.Trailing}>{item.trailing}</div> : null}
                </div>
                <p className={styles.Value}>{item.value}</p>
                {item.subValue ? <p className={styles.SubValue}>{item.subValue}</p> : null}
            </article>
        ))}
    </section>
);

export default GranterSummaryStatCards;
