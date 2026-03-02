import React from 'react';
import classNames from 'classnames';
import styles from './GranterPatternLayout.module.scss';

export type GranterPatternLayoutProps = {
    left: React.ReactNode;
    right: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
};

const GranterPatternLayout = ({ left, right, footer, className }: GranterPatternLayoutProps) => (
    <div className={classNames(styles.Layout, className)}>
        <div className={styles.TopRow}>
            <div className={styles.Panel}>{left}</div>
            <div className={styles.Connector} />
            <div className={styles.Panel}>{right}</div>
        </div>
        {footer ? <div className={styles.Footer}>{footer}</div> : null}
    </div>
);

export default GranterPatternLayout;
