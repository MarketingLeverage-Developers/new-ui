import React from 'react';
import styles from './GranterHomeMetricOverview.module.scss';

export type GranterHomeMetricFilter = {
    key: string;
    label: React.ReactNode;
};

export type GranterHomeMetricSummaryRow = {
    key: string;
    label: React.ReactNode;
    value: React.ReactNode;
};

export type GranterHomeMetricExpenseItem = {
    key: string;
    label: React.ReactNode;
    amount: React.ReactNode;
};

export type GranterHomeMetricExpenseColumn = {
    key: string;
    title: React.ReactNode;
    amount: React.ReactNode;
    ratio: React.ReactNode;
    items: GranterHomeMetricExpenseItem[];
};

export type GranterHomeMetricOverviewProps = {
    name: React.ReactNode;
    amount: React.ReactNode;
    filters?: GranterHomeMetricFilter[];
    onFilterClick?: (filterKey: string) => void;
    summaryRows?: GranterHomeMetricSummaryRow[];
    expenseColumns?: GranterHomeMetricExpenseColumn[];
};

const GranterHomeMetricOverview = ({
    name,
    amount,
    filters,
    onFilterClick,
    summaryRows,
    expenseColumns,
}: GranterHomeMetricOverviewProps) => (
    <div className={styles.MetricBox}>
        <div className={styles.MetricHeader}>
            <div>
                <p className={styles.MetricName}>{name}</p>
                <p className={styles.MetricAmount}>{amount}</p>
            </div>

            {filters?.length ? (
                <div className={styles.FilterRow}>
                    {filters.map((filter) => (
                        <button
                            key={filter.key}
                            type="button"
                            className={styles.FilterChip}
                            onClick={() => onFilterClick?.(filter.key)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>

        {summaryRows?.length ? (
            <div className={styles.SummaryTable}>
                {summaryRows.map((row) => (
                    <div key={row.key} className={styles.SummaryLine}>
                        <span>{row.label}</span>
                        <strong>{row.value}</strong>
                    </div>
                ))}
            </div>
        ) : null}

        {expenseColumns?.length ? (
            <div className={styles.ExpenseColumns}>
                {expenseColumns.map((column) => (
                    <article key={column.key} className={styles.ExpenseColumn}>
                        <header className={styles.ExpenseColumnHead}>
                            <span>{column.title}</span>
                            <strong>{column.amount}</strong>
                            <em>{column.ratio}</em>
                        </header>

                        <div className={styles.ExpenseItems}>
                            {column.items.map((item) => (
                                <button key={item.key} type="button" className={styles.ExpenseItem}>
                                    <span>{item.label}</span>
                                    <strong>{item.amount}</strong>
                                </button>
                            ))}
                        </div>
                    </article>
                ))}
            </div>
        ) : null}
    </div>
);

export default GranterHomeMetricOverview;
