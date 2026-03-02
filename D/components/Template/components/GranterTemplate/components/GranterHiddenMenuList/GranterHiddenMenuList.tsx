import React from 'react';
import GranterMenu, { type GranterMenuSection } from '../GranterMenu/GranterMenu';
import styles from './GranterHiddenMenuList.module.scss';

export type GranterHiddenMenuListProps = {
    title?: React.ReactNode;
    sections: GranterMenuSection[];
    activeItemKey?: string;
    onItemClick?: (itemKey: string) => void;
};

const GranterHiddenMenuList = ({
    title = '숨긴 메뉴',
    sections,
    activeItemKey,
    onItemClick,
}: GranterHiddenMenuListProps) => {
    const hiddenCount = sections.reduce((count, section) => count + section.items.length, 0);

    if (hiddenCount <= 0) return null;

    return (
        <details className={styles.Wrap}>
            <summary className={styles.Summary}>
                <span>{title}</span>
                <span className={styles.Count}>{hiddenCount}</span>
            </summary>

            <GranterMenu sections={sections} activeItemKey={activeItemKey} onItemClick={onItemClick} />
        </details>
    );
};

export default GranterHiddenMenuList;
