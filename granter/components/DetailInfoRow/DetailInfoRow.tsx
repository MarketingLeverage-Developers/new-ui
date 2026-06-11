import React from 'react';
import classNames from 'classnames';
import styles from './DetailInfoRow.module.scss';

export type DetailInfoRowProps = {
    icon: React.ReactNode;
    label: React.ReactNode;
    children: React.ReactNode;
    wide?: boolean;
    className?: string;
};

const DetailInfoRow = ({
    icon,
    label,
    children,
    wide = false,
    className,
}: DetailInfoRowProps) => (
    <div className={classNames(styles.Root, wide && styles.Wide, className)}>
        <span className={styles.Icon}>{icon}</span>
        <span className={styles.Label}>{label}</span>
        <div className={styles.Value}>{children}</div>
    </div>
);

export default DetailInfoRow;
