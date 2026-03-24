import React from 'react';
import classNames from 'classnames';
import styles from './StatusChip.module.scss';

export type StatusChipTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export type StatusChipProps = {
    children: React.ReactNode;
    tone?: StatusChipTone;
    className?: string;
};

const StatusChip = ({ children, tone = 'neutral', className }: StatusChipProps) => (
    <span className={classNames(styles.Chip, styles[`Tone-${tone}`], className)}>{children}</span>
);

export default StatusChip;
