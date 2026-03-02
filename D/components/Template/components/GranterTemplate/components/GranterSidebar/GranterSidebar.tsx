import React from 'react';
import classNames from 'classnames';
import GranterMenu, { type GranterMenuSection } from '../GranterMenu/GranterMenu';
import GranterWorkspaceInfo from '../GranterWorkspaceInfo/GranterWorkspaceInfo';
import GranterCenterNavigation from '../GranterCenterNavigation/GranterCenterNavigation';
import GranterBottomProfile from '../GranterBottomProfile/GranterBottomProfile';
import GranterWorkspaceSidebar from '../GranterWorkspaceSidebar/GranterWorkspaceSidebar';
import styles from './GranterSidebar.module.scss';

export type GranterWorkspaceItem = {
    key: string;
    label?: React.ReactNode;
    avatar?: React.ReactNode;
    disabled?: boolean;
};

export type GranterSidebarProps = {
    workspaceItems?: GranterWorkspaceItem[];
    activeWorkspaceKey?: string;
    onWorkspaceClick?: (workspaceKey: string) => void;
    onCreateWorkspaceClick?: () => void;
    workspaceTitle: React.ReactNode;
    workspaceMeta?: React.ReactNode;
    workspaceAvatar?: React.ReactNode;
    topMenuSections?: GranterMenuSection[];
    menuSections: GranterMenuSection[];
    hiddenMenuSections?: GranterMenuSection[];
    bottomMenuSections?: GranterMenuSection[];
    activeMenuKey?: string;
    onMenuItemClick?: (itemKey: string) => void;
    profileName?: React.ReactNode;
    profileRole?: React.ReactNode;
    profileAvatar?: React.ReactNode;
    onProfileClick?: () => void;
    onSidebarToggle?: () => void;
};

const GranterSidebar = ({
    workspaceItems,
    activeWorkspaceKey,
    onWorkspaceClick,
    onCreateWorkspaceClick,
    workspaceTitle,
    workspaceMeta,
    workspaceAvatar,
    topMenuSections,
    menuSections,
    hiddenMenuSections,
    bottomMenuSections,
    activeMenuKey,
    onMenuItemClick,
    profileName,
    profileRole,
    profileAvatar,
    onProfileClick,
    onSidebarToggle,
}: GranterSidebarProps) => {
    const hasWorkspaceRail = !!workspaceItems?.length;

    return (
        <div className={styles.SidebarLayout}>
            {hasWorkspaceRail ? (
                <GranterWorkspaceSidebar
                    items={(workspaceItems ?? []).map((item) => ({
                        key: item.key,
                        label: item.label,
                        avatar: item.avatar,
                        active: item.key === activeWorkspaceKey,
                        disabled: item.disabled,
                    }))}
                    onItemClick={onWorkspaceClick}
                    onCreateClick={onCreateWorkspaceClick}
                />
            ) : null}

            <aside className={classNames(styles.NavigationSidebar, { [styles.NavigationSidebarCompact]: hasWorkspaceRail })}>
                <GranterWorkspaceInfo
                    avatar={workspaceAvatar}
                    title={workspaceTitle}
                    meta={workspaceMeta}
                    showToggle={!!onSidebarToggle}
                    onToggleClick={onSidebarToggle}
                />

                {topMenuSections?.length ? (
                    <div className={styles.TopMenuArea}>
                        <GranterMenu
                            sections={topMenuSections}
                            compact
                            hideSectionLabel
                            activeItemKey={activeMenuKey}
                            onItemClick={onMenuItemClick}
                        />
                    </div>
                ) : null}

                <GranterCenterNavigation
                    sections={menuSections}
                    hiddenSections={hiddenMenuSections}
                    activeItemKey={activeMenuKey}
                    onItemClick={onMenuItemClick}
                />

                <GranterBottomProfile
                    menuSections={bottomMenuSections}
                    activeMenuKey={activeMenuKey}
                    onMenuItemClick={onMenuItemClick}
                    profileName={profileName}
                    profileRole={profileRole}
                    profileAvatar={profileAvatar}
                    onProfileClick={onProfileClick}
                />
            </aside>
        </div>
    );
};

export default GranterSidebar;
