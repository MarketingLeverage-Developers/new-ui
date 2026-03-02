import React from 'react';
import classNames from 'classnames';
import styles from './GranterHomeDashboardCard.module.scss';

export type GranterHomeDashboardTab = {
    key: string;
    label: React.ReactNode;
};

export type GranterHomeDashboardCardProps = {
    tabs: GranterHomeDashboardTab[];
    activeTabKey: string;
    onTabChange?: (tabKey: string) => void;
    actionLabel?: React.ReactNode;
    onActionClick?: () => void;
    children: React.ReactNode;
    className?: string;
};

const GranterHomeDashboardCard = ({
    tabs,
    activeTabKey,
    onTabChange,
    actionLabel,
    onActionClick,
    children,
    className,
}: GranterHomeDashboardCardProps) => (
    <section className={classNames(styles.DashboardCard, className)}>
        <div className={styles.DashboardHead}>
            <div className={styles.DashboardTabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        className={classNames(styles.DashboardTab, {
                            [styles.DashboardTabActive]: activeTabKey === tab.key,
                        })}
                        onClick={() => onTabChange?.(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {actionLabel ? (
                <button type="button" className={styles.ActionButton} onClick={onActionClick}>
                    {actionLabel}
                </button>
            ) : null}
        </div>

        <div className={styles.DashboardBody}>{children}</div>
    </section>
);

export default GranterHomeDashboardCard;
