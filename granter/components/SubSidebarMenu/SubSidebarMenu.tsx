import React from 'react';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import styles from './SubSidebarMenu.module.scss';

export type SubSidebarMenuItem = {
    key: string;
    label: string;
    description?: string;
};

export type SubSidebarMenuProps = {
    eyebrow?: string;
    title: string;
    items: SubSidebarMenuItem[];
    activeKey?: string;
    onSelect?: (key: string) => void;
};

const noop = () => undefined;

const SubSidebarMenu = ({ eyebrow, title, items, activeKey, onSelect = noop }: SubSidebarMenuProps) => (
    <Select value={activeKey} defaultValue={items[0]?.key} onChange={onSelect}>
        <div className={styles.SubSidebarMenu}>
            {eyebrow || title ? (
                <div className={styles.Header}>
                    {eyebrow ? <span className={styles.Eyebrow}>{eyebrow}</span> : null}
                    {title ? <strong className={styles.Title}>{title}</strong> : null}
                </div>
            ) : null}

            <SubSidebarMenuItems title={title} items={items} />
        </div>
    </Select>
);

const SubSidebarMenuItems = ({ title, items }: { title: string; items: SubSidebarMenuItem[] }) => {
    const { isActive, changeSelectValue } = useSelect();

    return (
        <nav className={styles.List} aria-label={`${title} 세부 메뉴`}>
            {items.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    className={styles.ItemButton}
                    data-active={isActive(item.key) ? 'true' : 'false'}
                    onClick={() => changeSelectValue(item.key)}
                >
                    <span className={styles.ItemLabel}>{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default SubSidebarMenu;
