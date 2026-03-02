import React from 'react';
import styles from './GranterHomeAssetCardGrid.module.scss';

export type GranterHomeAssetSummary = {
    key: string;
    label: React.ReactNode;
    value: React.ReactNode;
};

export type GranterHomeAssetRow = {
    key: string;
    name: React.ReactNode;
    amount: React.ReactNode;
    meta?: React.ReactNode;
};

export type GranterHomeAssetCard = {
    key: string;
    title: React.ReactNode;
    total?: React.ReactNode;
    summaries?: GranterHomeAssetSummary[];
    rows?: GranterHomeAssetRow[];
    footer?: React.ReactNode;
};

export type GranterHomeAssetCardGridProps = {
    cards: GranterHomeAssetCard[];
    viewAllLabel?: React.ReactNode;
};

const GranterHomeAssetCardGrid = ({ cards, viewAllLabel = '전체보기' }: GranterHomeAssetCardGridProps) => (
    <section className={styles.AssetGrid}>
        {cards.map((card) => (
            <article key={card.key} className={styles.AssetCard}>
                <header className={styles.AssetCardHeader}>
                    <h3>{card.title}</h3>
                    <button type="button" className={styles.GhostButton}>
                        {viewAllLabel}
                    </button>
                </header>

                {card.total ? <p className={styles.AssetCardTotal}>{card.total}</p> : null}

                {card.summaries?.length ? (
                    <div className={styles.SummaryStack}>
                        {card.summaries.map((summary) => (
                            <div key={summary.key} className={styles.SummaryRow}>
                                <span>{summary.label}</span>
                                <strong>{summary.value}</strong>
                            </div>
                        ))}
                    </div>
                ) : null}

                {card.rows?.length ? (
                    <div className={styles.AssetRows}>
                        {card.rows.map((row) => (
                            <button key={row.key} type="button" className={styles.AssetRow}>
                                <div>
                                    <p className={styles.AssetRowName}>{row.name}</p>
                                    {row.meta ? <p className={styles.AssetRowMeta}>{row.meta}</p> : null}
                                </div>
                                <strong className={styles.AssetRowAmount}>{row.amount}</strong>
                            </button>
                        ))}
                    </div>
                ) : null}

                {card.footer ? (
                    <button type="button" className={styles.AssetFooter}>
                        {card.footer}
                    </button>
                ) : null}
            </article>
        ))}
    </section>
);

export default GranterHomeAssetCardGrid;
