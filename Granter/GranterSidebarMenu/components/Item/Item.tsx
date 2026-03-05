import React from 'react';
import type { IconType } from 'react-icons';
import styles from '../../GranterSidebarMenu.module.scss';

export type GranterSidebarMenuItemProps = {
    label: React.ReactNode;
    icon?: IconType;
    badge?: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
    onClick?: () => void;
};

const Item = ({ label, icon: Icon, badge, active = false, disabled = false, onClick }: GranterSidebarMenuItemProps) => (
    <button
        type="button"
        disabled={disabled}
        className={[styles.ItemButton, active ? styles.ItemButtonActive : ''].filter(Boolean).join(' ')}
        onClick={onClick}
    >
        <span className={styles.ItemMain}>
            {Icon ? <Icon size={16} /> : null}
            <span>{label}</span>
        </span>
        {badge ? <span className={styles.ItemBadge}>{badge}</span> : null}
    </button>
);

export default Item;
