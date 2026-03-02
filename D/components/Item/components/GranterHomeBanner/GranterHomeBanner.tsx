import React from 'react';
import classNames from 'classnames';
import styles from './GranterHomeBanner.module.scss';

export type GranterHomeBannerVariant = 'sync' | 'guide' | 'last-month';

export type GranterHomeBannerProps = {
    variant?: GranterHomeBannerVariant;
    title: React.ReactNode;
    description?: React.ReactNode;
    actionLabel?: React.ReactNode;
    onActionClick?: () => void;
    className?: string;
};

const GranterHomeBanner = ({
    variant = 'sync',
    title,
    description,
    actionLabel,
    onActionClick,
    className,
}: GranterHomeBannerProps) => (
    <section
        className={classNames(
            styles.Banner,
            {
                [styles.BannerSync]: variant === 'sync',
                [styles.BannerGuide]: variant === 'guide',
                [styles.BannerLastMonth]: variant === 'last-month',
            },
            className
        )}
    >
        <div>
            <p className={styles.BannerTitle}>{title}</p>
            {description ? <p className={styles.BannerDesc}>{description}</p> : null}
        </div>

        {actionLabel ? (
            <button type="button" className={styles.ActionButton} onClick={onActionClick}>
                {actionLabel}
            </button>
        ) : null}
    </section>
);

export default GranterHomeBanner;
