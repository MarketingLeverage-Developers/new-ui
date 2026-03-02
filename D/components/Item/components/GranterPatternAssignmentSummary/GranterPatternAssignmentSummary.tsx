import React from 'react';
import classNames from 'classnames';
import styles from './GranterPatternAssignmentSummary.module.scss';

export type GranterPatternAssignmentSummaryRow = {
    key: string;
    label: React.ReactNode;
    value: React.ReactNode;
};

export type GranterPatternAssignmentSummaryProps = {
    rows: GranterPatternAssignmentSummaryRow[];
    className?: string;
    emptyText?: React.ReactNode;
};

const GranterPatternAssignmentSummary = ({ rows, className, emptyText }: GranterPatternAssignmentSummaryProps) => (
    <div className={classNames(styles.Summary, className)}>
        {rows.length === 0 ? (
            <div className={styles.Empty}>{emptyText ?? 'No assignment values'}</div>
        ) : (
            rows.map((row) => (
                <div key={row.key} className={styles.Row}>
                    <span className={styles.Label}>{row.label}</span>
                    <strong className={styles.Value}>{row.value}</strong>
                </div>
            ))
        )}
    </div>
);

export default GranterPatternAssignmentSummary;
