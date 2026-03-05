import React from 'react';
import GranterBaseButton, { type GranterBaseButtonVariant } from '../GranterBaseButton/GranterBaseButton';
import GranterTaxInvoiceStatusChip, {
    type GranterTaxInvoiceStatusTone,
} from '../GranterTaxInvoiceStatusChip/GranterTaxInvoiceStatusChip';
import styles from './GranterTaxInvoiceTable.module.scss';

export type GranterTaxInvoiceRow = {
    key: string;
    issuedAt: React.ReactNode;
    partnerName: React.ReactNode;
    memo: React.ReactNode;
    statusLabel: React.ReactNode;
    statusTone?: GranterTaxInvoiceStatusTone;
    statusPulse?: boolean;
    totalAmount: React.ReactNode;
    supplyAmount: React.ReactNode;
    taxAmount: React.ReactNode;
    actionLabel?: React.ReactNode;
    actionVariant?: GranterBaseButtonVariant;
    actionDisabled?: boolean;
};

export type GranterTaxInvoiceTableProps = {
    className?: string;
    rows: GranterTaxInvoiceRow[];
    emptyText?: React.ReactNode;
    onRowClick?: (row: GranterTaxInvoiceRow) => void;
    onActionClick?: (row: GranterTaxInvoiceRow) => void;
};

const GranterTaxInvoiceTable = ({
    className,
    rows,
    emptyText = '데이터가 없습니다.',
    onRowClick,
    onActionClick,
}: GranterTaxInvoiceTableProps) => (
    <div className={[styles.TableWrap, className ?? ''].filter(Boolean).join(' ')}>
        <table className={styles.Table}>
            <thead>
                <tr>
                    <th>발급일자</th>
                    <th>거래처 상호/이름</th>
                    <th>적요</th>
                    <th className={styles.Center}>상태</th>
                    <th className={styles.Right}>합계금액</th>
                    <th className={styles.Right}>공급가액</th>
                    <th className={styles.Right}>세액</th>
                    <th className={styles.Center}>작업</th>
                </tr>
            </thead>
            <tbody>
                {rows.length ? (
                    rows.map((row) => (
                        <tr key={row.key} onClick={() => onRowClick?.(row)}>
                            <td>{row.issuedAt}</td>
                            <td>{row.partnerName}</td>
                            <td>{row.memo}</td>
                            <td className={styles.Center}>
                                <GranterTaxInvoiceStatusChip
                                    tone={row.statusTone ?? 'neutral'}
                                    label={row.statusLabel}
                                    pulse={row.statusPulse}
                                />
                            </td>
                            <td className={styles.Right}>{row.totalAmount}</td>
                            <td className={styles.Right}>{row.supplyAmount}</td>
                            <td className={styles.Right}>{row.taxAmount}</td>
                            <td className={styles.Center}>
                                {row.actionLabel ? (
                                    <div
                                        onClick={(event) => {
                                            event.stopPropagation();
                                        }}
                                    >
                                        <GranterBaseButton
                                            variant={row.actionVariant ?? 'outline'}
                                            size="sm"
                                            disabled={row.actionDisabled}
                                            onClick={() => onActionClick?.(row)}
                                        >
                                            {row.actionLabel}
                                        </GranterBaseButton>
                                    </div>
                                ) : (
                                    <span className={styles.EmptyAction}>-</span>
                                )}
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={8} className={styles.EmptyRow}>
                            {emptyText}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default GranterTaxInvoiceTable;
