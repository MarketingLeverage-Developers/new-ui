import React from 'react';
import GranterBaseButton from '../GranterBaseButton/GranterBaseButton';
import styles from './GranterAssetCardGrid.module.scss';

export type GranterAssetCardSummary = {
    key: string;
    label: React.ReactNode;
    value: React.ReactNode;
};

export type GranterAssetCardRow = {
    key: string;
    name: React.ReactNode;
    amount: React.ReactNode;
    meta?: React.ReactNode;
};

export type GranterAssetCard = {
    key: string;
    title: React.ReactNode;
    totalAmount?: React.ReactNode;
    viewAllLabel?: React.ReactNode;
    summaries?: GranterAssetCardSummary[];
    rows?: GranterAssetCardRow[];
    footerLabel?: React.ReactNode;
};

export type GranterAssetCardGridProps = {
    className?: string;
    cards: GranterAssetCard[];
    defaultViewAllLabel?: React.ReactNode;
    onViewAllClick?: (cardKey: string) => void;
    onRowClick?: (cardKey: string, rowKey: string) => void;
    onFooterClick?: (cardKey: string) => void;
};

const GranterAssetCardGrid = ({
    className,
    cards,
    defaultViewAllLabel = '전체보기',
    onViewAllClick,
    onRowClick,
    onFooterClick,
}: GranterAssetCardGridProps) => (
    <section className={[styles.Grid, className ?? ''].filter(Boolean).join(' ')}>
        {cards.map((card) => (
            <article key={card.key} className={styles.Card}>
                <header className={styles.CardHeader}>
                    <h3>{card.title}</h3>
                    <GranterBaseButton variant="soft" size="sm" onClick={() => onViewAllClick?.(card.key)}>
                        {card.viewAllLabel ?? defaultViewAllLabel}
                    </GranterBaseButton>
                </header>

                {card.totalAmount ? <p className={styles.CardTotal}>{card.totalAmount}</p> : null}

                {card.summaries?.length ? (
                    <div className={styles.SummaryRows}>
                        {card.summaries.map((summary) => (
                            <div key={summary.key} className={styles.SummaryRow}>
                                <span>{summary.label}</span>
                                <strong>{summary.value}</strong>
                            </div>
                        ))}
                    </div>
                ) : null}

                {card.rows?.length ? (
                    <div className={styles.RowList}>
                        {card.rows.map((row) => (
                            <button
                                key={row.key}
                                type="button"
                                className={styles.RowButton}
                                onClick={() => onRowClick?.(card.key, row.key)}
                            >
                                <div className={styles.RowText}>
                                    <p className={styles.RowName}>{row.name}</p>
                                    {row.meta ? <p className={styles.RowMeta}>{row.meta}</p> : null}
                                </div>
                                <strong className={styles.RowAmount}>{row.amount}</strong>
                            </button>
                        ))}
                    </div>
                ) : null}

                {card.footerLabel ? (
                    <button type="button" className={styles.FooterButton} onClick={() => onFooterClick?.(card.key)}>
                        {card.footerLabel}
                    </button>
                ) : null}
            </article>
        ))}
    </section>
);

export default GranterAssetCardGrid;
