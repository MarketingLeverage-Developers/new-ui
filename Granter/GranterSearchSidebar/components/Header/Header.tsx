import React from 'react';
import { FiSettings } from 'react-icons/fi';
import styles from '../../GranterSearchSidebar.module.scss';

export type GranterSearchSidebarHeaderProps = {
    title?: React.ReactNode;
    trailing?: React.ReactNode;
    onSettingClick?: () => void;
};

const Header = ({ title, trailing, onSettingClick }: GranterSearchSidebarHeaderProps) => (
    <div className={styles.Header}>
        <strong>{title}</strong>
        {trailing ? (
            <>{trailing}</>
        ) : onSettingClick ? (
            <button type="button" className={styles.SettingButton} aria-label="설정" onClick={onSettingClick}>
                <FiSettings size={15} />
            </button>
        ) : null}
    </div>
);

export default Header;
