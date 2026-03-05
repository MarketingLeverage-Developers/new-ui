import React from 'react';
import styles from './GranterSidebarMenu.module.scss';
import Footer, { type GranterSidebarMenuFooterProps } from './components/Footer/Footer';
import Item, { type GranterSidebarMenuItemProps } from './components/Item/Item';
import Logo, { type GranterSidebarMenuLogoProps } from './components/Logo/Logo';
import Content, { type GranterSidebarMenuContentProps } from './components/Content/Content';
import Section, { type GranterSidebarMenuSectionProps } from './components/Section/Section';

export type { GranterSidebarMenuFooterProps } from './components/Footer/Footer';
export type { GranterSidebarMenuItemProps } from './components/Item/Item';
export type { GranterSidebarMenuLogoProps } from './components/Logo/Logo';
export type { GranterSidebarMenuContentProps } from './components/Content/Content';
export type { GranterSidebarMenuSectionProps } from './components/Section/Section';

export type GranterSidebarMenuRootProps = {
    className?: string;
    children: React.ReactNode;
};

type GranterSidebarMenuCompound = React.FC<GranterSidebarMenuRootProps> & {
    Logo: React.FC<GranterSidebarMenuLogoProps>;
    Content: React.FC<GranterSidebarMenuContentProps>;
    Section: React.FC<GranterSidebarMenuSectionProps>;
    Item: React.FC<GranterSidebarMenuItemProps>;
    Footer: React.FC<GranterSidebarMenuFooterProps>;
};

const GranterSidebarMenuRoot: React.FC<GranterSidebarMenuRootProps> = ({ className, children }) => (
    <aside className={[styles.SidebarMenu, className ?? ''].filter(Boolean).join(' ')}>
        {children}
    </aside>
);

const GranterSidebarMenu = Object.assign(GranterSidebarMenuRoot, {
    Logo,
    Content,
    Section,
    Item,
    Footer,
}) as GranterSidebarMenuCompound;

export default GranterSidebarMenu;
