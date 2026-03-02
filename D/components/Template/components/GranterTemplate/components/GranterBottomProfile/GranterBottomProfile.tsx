import React from 'react';
import GranterMenu, { type GranterMenuSection } from '../GranterMenu/GranterMenu';
import styles from './GranterBottomProfile.module.scss';

export type GranterBottomProfileProps = {
    menuSections?: GranterMenuSection[];
    activeMenuKey?: string;
    onMenuItemClick?: (itemKey: string) => void;
    profileName?: React.ReactNode;
    profileRole?: React.ReactNode;
    profileAvatar?: React.ReactNode;
    onProfileClick?: () => void;
};

const GranterBottomProfile = ({
    menuSections,
    activeMenuKey,
    onMenuItemClick,
    profileName,
    profileRole,
    profileAvatar,
    onProfileClick,
}: GranterBottomProfileProps) => (
    <div className={styles.Wrap}>
        {menuSections?.length ? (
            <GranterMenu
                sections={menuSections}
                compact
                hideSectionLabel
                activeItemKey={activeMenuKey}
                onItemClick={onMenuItemClick}
            />
        ) : null}

        <button type="button" className={styles.ProfileButton} onClick={onProfileClick}>
            <span className={styles.ProfileAvatar}>{profileAvatar ?? '👤'}</span>

            <span className={styles.ProfileCopy}>
                <span className={styles.ProfileName}>{profileName ?? '사용자'}</span>
                <span className={styles.ProfileRole}>{profileRole ?? '멤버'}</span>
            </span>

            <span className={styles.ProfileArrow}>›</span>
        </button>
    </div>
);

export default GranterBottomProfile;
