import React from 'react';
import styles from './GranterTaxInvoiceStatusChip.module.scss';

export type GranterTaxInvoiceStatusTone = 'completed' | 'pending' | 'failed' | 'neutral';

export type GranterTaxInvoiceStatusChipProps = {
    label: React.ReactNode;
    tone?: GranterTaxInvoiceStatusTone;
    pulse?: boolean;
};

const GranterTaxInvoiceStatusChip = ({
    label,
    tone = 'neutral',
    pulse = false,
}: GranterTaxInvoiceStatusChipProps) => (
    <span
        className={[
            styles.Chip,
            styles[`Tone${tone.charAt(0).toUpperCase()}${tone.slice(1)}`],
            pulse ? styles.Pulse : '',
        ]
            .filter(Boolean)
            .join(' ')}
    >
        {label}
    </span>
);

export default GranterTaxInvoiceStatusChip;
