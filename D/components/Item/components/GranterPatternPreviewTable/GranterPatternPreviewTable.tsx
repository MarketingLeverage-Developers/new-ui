import React from 'react';
import classNames from 'classnames';
import styles from './GranterPatternPreviewTable.module.scss';

export type GranterPatternPreviewRow = {
    key: string;
    date: React.ReactNode;
    time?: React.ReactNode;
    asset: React.ReactNode;
    assetMeta?: React.ReactNode;
    content: React.ReactNode;
    amount: React.ReactNode;
    direction?: 'in' | 'out';
};

export type GranterPatternPreviewTableProps = {
    rows: GranterPatternPreviewRow[];
    className?: string;
    emptyText?: React.ReactNode;
};

const GranterPatternPreviewTable = ({ rows, className, emptyText }: GranterPatternPreviewTableProps) => (
    <div className={classNames(styles.TableWrap, className)}>
        <table className={styles.Table}>
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Asset</th>
                    <th>Counterparty</th>
                    <th className={styles.AmountHead}>Amount</th>
                </tr>
            </thead>
            <tbody>
                {rows.length === 0 ? (
                    <tr>
                        <td colSpan={4} className={styles.Empty}>
                            {emptyText ?? 'No preview transactions'}
                        </td>
                    </tr>
                ) : (
                    rows.map((row) => (
                        <tr key={row.key}>
                            <td>
                                <div className={styles.DateCell}>
                                    <span>{row.date}</span>
                                    {row.time ? <small>{row.time}</small> : null}
                                </div>
                            </td>
                            <td>
                                <div className={styles.AssetCell}>
                                    <span>{row.asset}</span>
                                    {row.assetMeta ? <small>{row.assetMeta}</small> : null}
                                </div>
                            </td>
                            <td className={styles.ContentCell}>{row.content}</td>
                            <td
                                className={classNames(styles.AmountCell, {
                                    [styles.AmountIn]: row.direction === 'in',
                                })}
                            >
                                {row.amount}
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);

export default GranterPatternPreviewTable;
