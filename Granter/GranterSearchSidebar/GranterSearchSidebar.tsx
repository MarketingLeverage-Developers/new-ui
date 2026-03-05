import React from 'react';
import styles from './GranterSearchSidebar.module.scss';
import Count, { type GranterSearchSidebarCountProps } from './components/Count/Count';
import Empty, { type GranterSearchSidebarEmptyProps } from './components/Empty/Empty';
import Header, { type GranterSearchSidebarHeaderProps } from './components/Header/Header';
import Item, { type GranterSearchSidebarItemProps } from './components/Item/Item';
import List, { type GranterSearchSidebarListProps } from './components/List/List';
import SearchInput, {
    type GranterSearchSidebarSearchInputProps,
} from './components/SearchInput/SearchInput';

export type { GranterSearchSidebarCountProps } from './components/Count/Count';
export type { GranterSearchSidebarEmptyProps } from './components/Empty/Empty';
export type { GranterSearchSidebarHeaderProps } from './components/Header/Header';
export type { GranterSearchSidebarItemProps } from './components/Item/Item';
export type { GranterSearchSidebarListProps } from './components/List/List';
export type { GranterSearchSidebarSearchInputProps } from './components/SearchInput/SearchInput';

export type GranterSearchSidebarRootProps = {
    className?: string;
    children: React.ReactNode;
};

type GranterSearchSidebarCompound = React.FC<GranterSearchSidebarRootProps> & {
    Header: React.FC<GranterSearchSidebarHeaderProps>;
    SearchInput: React.FC<GranterSearchSidebarSearchInputProps>;
    Count: React.FC<GranterSearchSidebarCountProps>;
    List: React.FC<GranterSearchSidebarListProps>;
    Item: React.FC<GranterSearchSidebarItemProps>;
    Empty: React.FC<GranterSearchSidebarEmptyProps>;
};

const GranterSearchSidebarRoot: React.FC<GranterSearchSidebarRootProps> = ({ className, children }) => (
    <aside className={[styles.SearchSidebar, className ?? ''].filter(Boolean).join(' ')}>
        {children}
    </aside>
);

const GranterSearchSidebar = Object.assign(GranterSearchSidebarRoot, {
    Header,
    SearchInput,
    Count,
    List,
    Item,
    Empty,
}) as GranterSearchSidebarCompound;

export default GranterSearchSidebar;
