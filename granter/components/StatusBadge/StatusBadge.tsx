import React from 'react';
import classNames from 'classnames';
import styles from './StatusBadge.module.scss';

export type StatusBadgeProps = {
    children: React.ReactNode;
    color?: string;
    dotColor?: string;
    showDot?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

const StatusBadge = ({
    children,
    color,
    dotColor,
    showDot = true,
    className,
    style,
}: StatusBadgeProps) => {
    const badgeStyle = {
        ...style,
        ...(color ? { ['--status-badge-color' as string]: color } : {}),
        ...(dotColor ? { ['--status-badge-dot-color' as string]: dotColor } : {}),
    } as React.CSSProperties;

    return (
        <span className={classNames(styles.Badge, className)} style={badgeStyle}>
            {showDot ? <span className={styles.Dot} aria-hidden="true" /> : null}
            <span className={styles.Label}>{children}</span>
        </span>
    );
};

export default StatusBadge;
