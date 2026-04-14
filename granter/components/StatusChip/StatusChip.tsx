import React from 'react';
import classNames from 'classnames';
import styles from './StatusChip.module.scss';

export type StatusChipTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'violet';
export type StatusChipSize = 'md' | 'sm';

export type StatusChipProps = {
    children: React.ReactNode;
    tone?: StatusChipTone;
    size?: StatusChipSize;
    className?: string;
    style?: React.CSSProperties;
};

const StatusChip = ({
    children,
    tone = 'neutral',
    size = 'md',
    className,
    style,
}: StatusChipProps) => (
    <span
        className={classNames(styles.Chip, styles[`Tone-${tone}`], styles[`Size-${size}`], className)}
        style={style}
    >
        {children}
    </span>
);

export default StatusChip;
