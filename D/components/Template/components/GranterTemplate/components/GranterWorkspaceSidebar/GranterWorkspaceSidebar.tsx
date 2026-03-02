import React from 'react';
import classNames from 'classnames';
import styles from './GranterWorkspaceSidebar.module.scss';

export type GranterWorkspaceSidebarItem = {
    key: string;
    label?: React.ReactNode;
    avatar?: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
};

export type GranterWorkspaceSidebarProps = {
    items: GranterWorkspaceSidebarItem[];
    onItemClick?: (itemKey: string) => void;
    onCreateClick?: () => void;
};

const GranterWorkspaceSidebar = ({ items, onItemClick, onCreateClick }: GranterWorkspaceSidebarProps) => (
    <div className={styles.Wrap}>
        <div className={styles.Items}>
            {items.map((item) => (
                <button
                    key={item.key}
                    type="button"
                    disabled={item.disabled}
                    className={classNames(styles.ItemButton, {
                        [styles.ItemButtonActive]: item.active,
                        [styles.ItemButtonDisabled]: item.disabled,
                    })}
                    onClick={() => onItemClick?.(item.key)}
                >
                    <span className={styles.Avatar}>
                        {item.avatar ?? String(item.label ?? '').slice(0, 1).toUpperCase()}
                    </span>
                </button>
            ))}
        </div>

        <button type="button" className={styles.CreateButton} onClick={onCreateClick}>
            +
        </button>
    </div>
);

export default GranterWorkspaceSidebar;
