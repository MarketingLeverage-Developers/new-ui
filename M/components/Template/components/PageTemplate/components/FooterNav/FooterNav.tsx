import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './FooterNav.module.scss';
import { FiHome, FiMessageCircle, FiMenu, FiPlus } from 'react-icons/fi';

export type FooterNavVariant = 'base';

export type FooterNavItem = {
    key?: string;
    icon?: React.ReactNode;
    text?: React.ReactNode;
    active?: boolean;
    onClick?: () => void;
};

export type FooterNavMenuItem = {
    key?: string;
    icon?: React.ComponentType<{ className?: string }>;
    label: React.ReactNode;
    onClick?: () => void;
};

export type FooterNavFabProps = {
    icon?: React.ReactNode;
    menuItems?: FooterNavMenuItem[];
};

export type FooterNavProps = {
    variant: 'base';
    items?: FooterNavItem[];
    fab?: FooterNavFabProps | null;
    className?: string;
};

const defaultFooterNavItems: FooterNavItem[] = [
    { key: 'home', icon: <FiHome />, text: '홈' },
    { key: 'inquiry', icon: <FiMessageCircle />, text: '문의' },
    { key: 'menu', icon: <FiMenu />, text: '메뉴' },
];

const FooterNavItemView = ({ icon, text, active, onClick }: FooterNavItem) => (
    <button
        type="button"
        className={classNames(styles.FooterNavItem, active && styles.FooterNavItemActive)}
        onClick={onClick}
    >
        <span className={styles.FooterNavIcon}>{icon}</span>
        <span className={styles.FooterNavText}>{text}</span>
    </button>
);

const FooterNavFab = ({ icon, menuItems = [] }: FooterNavFabProps) => {
    const [open, setOpen] = useState(false);
    const hasMenu = menuItems.length > 0;

    return (
        <div className={styles.FooterNavFabWrapper}>
            {hasMenu ? (
                <ul className={classNames(styles.FooterNavFabMenu, open && styles.FooterNavFabMenuOpen)}>
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <li
                                key={item.key ?? index}
                                className={styles.FooterNavFabMenuItem}
                                style={{ transitionDelay: `${index * 40}ms` }}
                                onClick={item.onClick}
                            >
                                {Icon ? <Icon className={styles.FooterNavFabMenuIcon} /> : null}
                                <span className={styles.FooterNavFabMenuText}>{item.label}</span>
                            </li>
                        );
                    })}
                </ul>
            ) : null}
            <button type="button" className={styles.FooterNavFabButton} onClick={() => setOpen((prev) => !prev)}>
                <span className={classNames(styles.FooterNavFabIcon, open && styles.FooterNavFabIconRotated)}>
                    {icon ?? <FiPlus />}
                </span>
            </button>
        </div>
    );
};

const FooterNav = ({ variant, items, fab, className }: FooterNavProps) => {
    if (variant !== 'base') return null;

    const renderItems = items && items.length > 0 ? items : defaultFooterNavItems;
    const splitIndex = Math.ceil(renderItems.length / 2);
    const leftItems = renderItems.slice(0, splitIndex);
    const rightItems = renderItems.slice(splitIndex);

    return (
        <nav className={classNames(styles.FooterNav, className)}>
            <div className={styles.FooterNavSide}>
                {leftItems.map((item, index) => (
                    <FooterNavItemView key={item.key ?? index} {...item} />
                ))}
            </div>

            {fab === null ? null : (
                <div className={styles.FooterNavFabSlot}>
                    <FooterNavFab {...(fab ?? {})} />
                </div>
            )}

            <div className={styles.FooterNavSide}>
                {rightItems.map((item, index) => (
                    <FooterNavItemView key={item.key ?? index} {...item} />
                ))}
            </div>
        </nav>
    );
};

export default FooterNav;
