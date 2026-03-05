import React from 'react';
import styles from '../../GranterSearchSidebar.module.scss';

export type GranterSearchSidebarItemProps = {
    title: React.ReactNode;
    subMeta?: React.ReactNode;
    leading?: React.ReactNode;
    trailing?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
};

const Item = ({ title, subMeta, leading, trailing, active = false, onClick }: GranterSearchSidebarItemProps) => (
    <button
        type="button"
        className={[styles.ItemButton, active ? styles.ItemButtonActive : ''].filter(Boolean).join(' ')}
        onClick={onClick}
    >
        <div
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
            }}
        >
            <span className={styles.ItemTitle} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                {leading ? <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{leading}</span> : null}
                {title}
            </span>
            {trailing ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>{trailing}</span>
            ) : null}
        </div>
        {subMeta ? <span className={styles.ItemMeta}>{subMeta}</span> : null}
    </button>
);

export default Item;
