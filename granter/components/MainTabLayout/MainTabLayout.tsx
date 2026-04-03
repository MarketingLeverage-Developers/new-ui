import React from 'react';
import classNames from 'classnames';
import styles from './MainTabLayout.module.scss';

export type MainTabLayoutItem = {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    disabled?: boolean;
};

export type MainTabLayoutProps = {
    items: MainTabLayoutItem[];
    activeKey?: string;
    defaultActiveKey?: string;
    onChange?: (nextKey: string) => void;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    navigationAriaLabel?: string;
    stickyNavigation?: boolean;
    stickyNavigationTop?: number | string;
};

type MainTabLayoutCssVariables = React.CSSProperties & {
    '--granter-main-tab-sticky-top'?: string;
};

const noop = () => undefined;

const MainTabLayout = ({
    items,
    activeKey,
    defaultActiveKey,
    onChange = noop,
    children,
    className,
    contentClassName,
    navigationAriaLabel = '메인 탐색',
    stickyNavigation = false,
    stickyNavigationTop = 20,
}: MainTabLayoutProps) => {
    const [internalActiveKey, setInternalActiveKey] = React.useState(
        defaultActiveKey ?? items[0]?.key
    );
    const isControlled = typeof activeKey === 'string';
    const resolvedActiveKey = activeKey ?? internalActiveKey;

    const handleSelect = React.useCallback(
        (nextKey: string) => {
            if (!isControlled) {
                setInternalActiveKey(nextKey);
            }

            onChange(nextKey);
        },
        [isControlled, onChange]
    );

    const mainTabLayoutStyle: MainTabLayoutCssVariables = {
        '--granter-main-tab-sticky-top':
            typeof stickyNavigationTop === 'number'
                ? `${stickyNavigationTop}px`
                : stickyNavigationTop,
    };

    return (
        <div className={classNames(styles.MainTabLayout, className)} style={mainTabLayoutStyle}>
            <aside className={styles.Navigation}>
                <nav
                    className={styles.NavigationList}
                    data-sticky={stickyNavigation ? 'true' : 'false'}
                    aria-label={navigationAriaLabel}
                >
                    {items.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={styles.NavigationItem}
                            data-active={resolvedActiveKey === item.key ? 'true' : 'false'}
                            disabled={item.disabled}
                            onClick={() => {
                                if (item.disabled) return;
                                handleSelect(item.key);
                            }}
                        >
                            {item.icon ? (
                                <span className={styles.NavigationItemIcon}>{item.icon}</span>
                            ) : null}
                            <span className={styles.NavigationItemLabel}>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <div className={classNames(styles.Content, contentClassName)}>{children}</div>
        </div>
    );
};

export default MainTabLayout;
