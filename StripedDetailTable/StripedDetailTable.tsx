import React from 'react';
import classNames from 'classnames';
import styles from './StripedDetailTable.module.scss';

export interface StripedDetailColumn<T extends Record<string, any> = Record<string, any>> {
    key: keyof T | string;
    header: React.ReactNode;
    render?: (row: T, rowIndex: number) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
    width?: string;
}

export interface StripedDetailTableProps<T extends Record<string, any> = Record<string, any>> {
    columns: StripedDetailColumn<T>[];
    data: T[];
    /** true면 헤더부터 줄무늬 색 반전 */
    reverse?: boolean;
    className?: string;
}

const StripedDetailTable = <T extends Record<string, any>>({
    columns,
    data,
    reverse = false,
    className,
}: StripedDetailTableProps<T>) => {
    const getStripeClassName = (position: number) =>
        classNames(styles.Row, {
            [styles.RowEven]: (!reverse && position % 2 === 0) || (reverse && position % 2 !== 0),
            [styles.RowOdd]: (!reverse && position % 2 !== 0) || (reverse && position % 2 === 0),
        });

    const wrapperClassName = classNames(styles.TableWrapper, className);

    const headerClassName = getStripeClassName(0); // 헤더 position = 0

    return (
        <div className={wrapperClassName}>
            <table className={styles.Table}>
                <thead className={styles.Thead}>
                    <tr className={headerClassName}>
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className={styles.HeaderCell}
                                style={{
                                    textAlign: column.align ?? 'left',
                                    width: column.width,
                                }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className={styles.Tbody}>
                    {data.map((row, rowIndex) => {
                        const rowClassName = getStripeClassName(rowIndex + 1); // row는 position = index + 1

                        return (
                            <tr key={rowIndex} className={rowClassName}>
                                {columns.map((column) => {
                                    const content = column.render
                                        ? column.render(row, rowIndex)
                                        : (row[column.key as keyof T] as React.ReactNode);

                                    return (
                                        <td
                                            key={String(column.key)}
                                            className={styles.Cell}
                                            style={{ textAlign: column.align ?? 'left' }}
                                        >
                                            {content}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}

                    {data.length === 0 && (
                        <tr className={styles.EmptyRow}>
                            <td className={styles.EmptyCell} colSpan={columns.length}>
                                데이터가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StripedDetailTable;
