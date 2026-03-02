import React from 'react';
import GranterMenu, { type GranterMenuSection } from '../GranterMenu/GranterMenu';
import GranterHiddenMenuList from '../GranterHiddenMenuList/GranterHiddenMenuList';
import styles from './GranterCenterNavigation.module.scss';

export type GranterCenterNavigationProps = {
    sections: GranterMenuSection[];
    hiddenSections?: GranterMenuSection[];
    activeItemKey?: string;
    onItemClick?: (itemKey: string) => void;
};

const GranterCenterNavigation = ({
    sections,
    hiddenSections,
    activeItemKey,
    onItemClick,
}: GranterCenterNavigationProps) => (
    <div className={styles.Wrap} id="sidebar-navigation-scrollable">
        <GranterMenu sections={sections} activeItemKey={activeItemKey} onItemClick={onItemClick} />

        {hiddenSections?.length ? (
            <GranterHiddenMenuList sections={hiddenSections} activeItemKey={activeItemKey} onItemClick={onItemClick} />
        ) : null}
    </div>
);

export default GranterCenterNavigation;
