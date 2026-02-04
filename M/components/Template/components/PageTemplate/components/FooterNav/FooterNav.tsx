import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { matchPath, useLocation } from 'react-router-dom';
import { FiMessageCircle, FiMenu, FiMoon, FiPlus, FiPower, FiSun } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { ROUTES } from '@/app/routes';
import { AppPageMenu } from '@/features/navigation/components/AppPageMenu';
import { useProgressNavigate } from '@/features/route-progress/logic/hooks';
import { useUserAuthQuery } from '@/features/user/auth/logic/query';
import { USER_ROLE } from '@/features/user/auth/logic/types';
import useUserLogoutMutation from '@/features/user/logout/logic/mutation';
import Modal from '@/shared/headless/Modal/Modal';
import { useToast } from '@/shared/headless/ToastProvider/ToastProvider';
import { useTheme } from '@/shared/hooks/client/useTheme';
import styles from './FooterNav.module.scss';

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
    className?: string;
};

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
    const handleItemClick = (onClick?: () => void) => () => {
        onClick?.();
        setOpen(false);
    };

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
                                onClick={handleItemClick(item.onClick)}
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

const FooterNavBase = ({ className }: { className?: string }) => {
    const navigate = useProgressNavigate();
    const { pathname } = useLocation();
    const { addToast } = useToast();
    const { mutateAsync: userLogoutMutate } = useUserLogoutMutation();
    const { res } = useUserAuthQuery();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    const user = res?.body;
    const roleKey = user?.role ? (user.role.toLowerCase() as keyof typeof USER_ROLE) : undefined;
    const roleLabel = roleKey ? USER_ROLE[roleKey] : '';
    const logoutName = [user?.name, roleLabel].filter(Boolean).join(' ');
    const logoutSuffix = logoutName ? ` ${logoutName}` : '';

    const isActivePath = (patterns?: string | string[] | null): boolean => {
        if (!patterns) return false;
        const list = Array.isArray(patterns) ? patterns : [patterns];
        return list.some((pattern) => !!matchPath({ path: pattern, end: false }, pathname));
    };

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    const handleLogoutButtonClick = async () => {
        addToast({
            icon: '👋',
            message: `안녕히가세요!${logoutSuffix} 님!`,
            duration: 2400,
            dismissible: true,
        });
        await userLogoutMutate();
        navigate(ROUTES.LOGIN.PATH);
    };

    const themeItem: FooterNavMenuItem = {
        icon: theme === 'dark' ? FiSun : FiMoon,
        label: theme === 'dark' ? '라이트 모드' : '다크 모드',
        onClick: toggleTheme,
    };

    const fabItems: FooterNavMenuItem[] = [
        themeItem,
        { icon: FiPower, label: '로그아웃', onClick: handleLogoutButtonClick },
    ];

    const navItems: FooterNavItem[] = [
        {
            key: 'inquiry',
            icon: <FiMessageCircle />,
            text: '문의내역',
            active: isActivePath(ROUTES.INQUIRY_HISTORY.PATH),
            onClick: () => navigate(ROUTES.INQUIRY_HISTORY.PATH),
        },
        {
            key: 'menu',
            icon: <FiMenu />,
            text: '메뉴',
            active: menuOpen,
            onClick: () => setMenuOpen(true),
        },
    ];
    const splitIndex = Math.ceil(navItems.length / 2);
    const leftItems = navItems.slice(0, splitIndex);
    const rightItems = navItems.slice(splitIndex);

    return (
        <>
            <nav className={classNames(styles.FooterNav, className)}>
                <div className={styles.FooterNavSide}>
                    {leftItems.map((item, index) => (
                        <FooterNavItemView key={item.key ?? index} {...item} />
                    ))}
                </div>

                <div className={styles.FooterNavFabSlot}>
                    <FooterNavFab menuItems={fabItems} />
                </div>

                <div className={styles.FooterNavSide}>
                    {rightItems.map((item, index) => (
                        <FooterNavItemView key={item.key ?? index} {...item} />
                    ))}
                </div>
            </nav>
            <Modal value={menuOpen} onChange={(value) => setMenuOpen(value)}>
                <Modal.Backdrop />
                <Modal.Content
                    className={styles.FooterNavMenuContent}
                    width="80vw"
                    height="100vh"
                    maxHeight="100vh"
                    style={{ top: 0, left: 0, transform: 'translateX(0)', maxWidth: 520 }}
                >
                    <div className={styles.FooterNavMenuHeader}>
                        <span className={styles.FooterNavMenuTitle}>메뉴</span>
                        <button type="button" className={styles.FooterNavMenuClose} onClick={() => setMenuOpen(false)}>
                            <IoMdClose size={22} />
                        </button>
                    </div>
                    <AppPageMenu />
                </Modal.Content>
            </Modal>
        </>
    );
};

const FooterNav = ({ className }: FooterNavProps) => <FooterNavBase className={className} />;

export default FooterNav;
