import React from 'react';
import classNames from 'classnames';
import { HiChevronDown } from 'react-icons/hi2';
import HeadlessDropdown from '../../../shared/headless/Dropdown/Dropdown';
import styles from './SidebarMenu.module.scss';

export type MenuProps = {
    children: React.ReactNode;
    className?: string;
};

export type MenuHeaderProps = {
    children: React.ReactNode;
    className?: string;
};

export type MenuNavigationProps = {
    children: React.ReactNode;
    ariaLabel?: string;
    className?: string;
};

export type MenuSectionProps = {
    label?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
};

export type MenuGroupProps = {
    children: React.ReactNode;
    title?: React.ReactNode;
    className?: string;
};

export type MenuItemIcon =
    | React.ElementType<{ className?: string; size?: number }>
    | React.ReactNode;

export type MenuItemProps = {
    label: React.ReactNode;
    icon?: MenuItemIcon;
    activeIcon?: MenuItemIcon;
    isActive?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    badge?: React.ReactNode;
    disabled?: boolean;
    className?: string;
};

export type MenuFooterProps = {
    children: React.ReactNode;
    className?: string;
};

export type MenuDropdownProps = {
    children: React.ReactNode;
    className?: string;
};

export type MenuDropdownTriggerProps = React.ComponentProps<typeof HeadlessDropdown.Trigger>;

export type MenuDropdownContentProps = Omit<React.ComponentProps<typeof HeadlessDropdown.Content>, 'className'> & {
    className?: string;
};

export type MenuDropdownItemProps = {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    className?: string;
};

export type MenuMetaButtonProps = {
    avatar: React.ReactNode;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    variant?: 'workspace' | 'profile';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
    chevron?: React.ReactNode;
    disabled?: boolean;
};

// Backward-compatible type aliases.
export type SidebarMenuProps = MenuProps;
export type SidebarMenuHeaderProps = MenuHeaderProps;
export type SidebarMenuNavigationProps = MenuNavigationProps;
export type SidebarMenuSectionProps = MenuSectionProps;
export type SidebarMenuGroupProps = MenuGroupProps;
export type SidebarMenuItemIcon = MenuItemIcon;
export type SidebarMenuItemProps = MenuItemProps;
export type SidebarMenuFooterProps = MenuFooterProps;
export type SidebarMenuDropdownProps = MenuDropdownProps;
export type SidebarMenuDropdownTriggerProps = MenuDropdownTriggerProps;
export type SidebarMenuDropdownContentProps = MenuDropdownContentProps;
export type SidebarMenuDropdownItemProps = MenuDropdownItemProps;
export type SidebarMenuMetaButtonProps = MenuMetaButtonProps;

const MenuHeader = ({ children, className }: MenuHeaderProps) => (
    <div className={classNames(styles.WorkspaceSection, className)}>{children}</div>
);

const MenuNavigation = ({
    children,
    ariaLabel = '주 메뉴',
    className,
}: MenuNavigationProps) => (
    <nav className={classNames(styles.Navigation, className)} aria-label={ariaLabel}>
        {children}
    </nav>
);

const MenuSection = ({ label, children, className }: MenuSectionProps) => (
    <div className={classNames(styles.Group, className)}>
        {label ? <div className={styles.GroupTitle}>{label}</div> : null}
        {children}
    </div>
);

const MenuGroup = ({ children, title, className }: MenuGroupProps) => (
    <MenuSection label={title} className={className}>
        {children}
    </MenuSection>
);

const renderMenuIcon = (icon?: MenuItemIcon) => {
    if (!icon) return null;

    if (React.isValidElement<{ className?: string }>(icon)) {
        const currentClassName = icon.props.className;
        return React.cloneElement(icon, {
            className: classNames(styles.Icon, currentClassName),
        });
    }

    if (typeof icon === 'function') {
        const IconComponent = icon as React.ElementType<{ className?: string; size?: number }>;
        return <IconComponent className={styles.Icon} size={16} />;
    }

    if (typeof icon === 'string' || typeof icon === 'number') {
        return <span className={styles.Icon}>{icon}</span>;
    }

    return null;
};

const MenuItem = ({
    label,
    icon,
    activeIcon,
    isActive = false,
    onClick,
    badge,
    disabled = false,
    className,
}: MenuItemProps) => (
    <button
        type="button"
        className={classNames(styles.MenuButton, className)}
        data-active={isActive ? 'true' : 'false'}
        disabled={disabled}
        onClick={onClick}
    >
        <span className={styles.ActiveBackground} aria-hidden="true" />

        <span className={styles.MenuButtonCopy}>
            {renderMenuIcon(isActive ? activeIcon ?? icon : icon ?? activeIcon)}
            <span className={styles.Label}>{label}</span>
        </span>

        {badge ? <span className={styles.Badge}>{badge}</span> : null}
    </button>
);

const MenuFooter = ({ children, className }: MenuFooterProps) => (
    <div className={classNames(styles.Footer, className)}>{children}</div>
);

const MenuDropdown = ({ children }: MenuDropdownProps) => (
    <HeadlessDropdown>{children}</HeadlessDropdown>
);

const MenuDropdownTrigger = ({ children, className, ...props }: MenuDropdownTriggerProps) => (
    <HeadlessDropdown.Trigger className={classNames(styles.DropdownTrigger, className)} {...props}>
        {children}
    </HeadlessDropdown.Trigger>
);

const MenuDropdownContent = ({
    children,
    className,
    keepMounted = false,
    ...props
}: MenuDropdownContentProps) => (
    <HeadlessDropdown.Content
        className={classNames(styles.Dropdown, className)}
        keepMounted={keepMounted}
        {...props}
    >
        {children}
    </HeadlessDropdown.Content>
);

const MenuDropdownItem = ({
    children,
    onClick,
    disabled = false,
    className,
}: MenuDropdownItemProps) => (
    <button
        type="button"
        className={classNames(styles.DropdownItem, className)}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
);

const MenuMetaButton = ({
    avatar,
    title,
    subtitle,
    variant = 'workspace',
    onClick,
    className,
    chevron,
    disabled = false,
}: MenuMetaButtonProps) => {
    const isWorkspace = variant === 'workspace';

    return (
        <button
            type="button"
            className={classNames(
                isWorkspace ? styles.WorkspaceButton : styles.ProfileButton,
                className
            )}
            onClick={onClick}
            disabled={disabled}
        >
            <div className={isWorkspace ? styles.WorkspaceMeta : styles.ProfileMeta}>
                <span className={isWorkspace ? styles.WorkspaceAvatar : styles.ProfileAvatar} aria-hidden="true">
                    {avatar}
                </span>

                <span className={isWorkspace ? styles.WorkspaceCopy : styles.ProfileCopy}>
                    <span className={isWorkspace ? styles.WorkspaceName : styles.ProfileName}>{title}</span>
                    {subtitle ? (
                        <span className={isWorkspace ? styles.WorkspaceSummary : styles.ProfileRole}>{subtitle}</span>
                    ) : null}
                </span>
            </div>

            {chevron ?? (
                <HiChevronDown className={isWorkspace ? styles.WorkspaceChevron : styles.ProfileChevron} />
            )}
        </button>
    );
};

type MenuComponent = ((props: MenuProps) => React.ReactElement) & {
    Header: typeof MenuHeader;
    Navigation: typeof MenuNavigation;
    Section: typeof MenuSection;
    Group: typeof MenuGroup;
    Item: typeof MenuItem;
    Footer: typeof MenuFooter;
    Dropdown: typeof MenuDropdown;
    DropdownTrigger: typeof MenuDropdownTrigger;
    DropdownContent: typeof MenuDropdownContent;
    DropdownItem: typeof MenuDropdownItem;
    MetaButton: typeof MenuMetaButton;
};

const Menu = (({
    children,
    className,
}: MenuProps) => (
    <div className={classNames(styles.SidebarMenu, className)}>
        {children}
    </div>
)) as MenuComponent;

export default Menu;

Menu.Header = MenuHeader;
Menu.Navigation = MenuNavigation;
Menu.Section = MenuSection;
Menu.Group = MenuGroup;
Menu.Item = MenuItem;
Menu.Footer = MenuFooter;
Menu.Dropdown = MenuDropdown;
Menu.DropdownTrigger = MenuDropdownTrigger;
Menu.DropdownContent = MenuDropdownContent;
Menu.DropdownItem = MenuDropdownItem;
Menu.MetaButton = MenuMetaButton;
