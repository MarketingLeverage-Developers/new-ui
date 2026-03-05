import React from 'react';
import classNames from 'classnames';
import styles from './GranterPageMenu.module.scss';
import GranterMenu, { type GranterMenuSection } from '../GranterMenu/GranterMenu';

export type GranterPageMenuProps = {
    sections: GranterMenuSection[];
    activeItemKey?: string;
    onItemClick?: (itemKey: string) => void;
    compact?: boolean;
    hideSectionLabel?: boolean;
    className?: string;
    contentClassName?: string;
};

export const GranterPageMenu = ({
    sections,
    activeItemKey,
    onItemClick,
    compact,
    hideSectionLabel,
    className,
    contentClassName,
}: GranterPageMenuProps) => (
    <div className={classNames(styles.GranterPageMenuDesktop, className)}>
        <aside className={styles.NavigationSidebar}>
            <div className={classNames(styles.CenterMenuArea, contentClassName)}>
                <GranterMenu
                    sections={sections}
                    activeItemKey={activeItemKey}
                    onItemClick={onItemClick}
                    compact={compact}
                    hideSectionLabel={hideSectionLabel}
                />
            </div>
        </aside>
    </div>
);
