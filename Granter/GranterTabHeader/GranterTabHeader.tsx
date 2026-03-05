import React from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import GranterBaseButton from '../GranterBaseButton/GranterBaseButton';
import styles from './GranterTabHeader.module.scss';

export type GranterTabHeaderItem = {
    key: string;
    label: React.ReactNode;
};

export type GranterTabHeaderProps = {
    className?: string;
    title: React.ReactNode;
    tabs: GranterTabHeaderItem[];
    activeTabKey: string;
    rightSlot?: React.ReactNode;
    onTabChange?: (tabKey: string) => void;
    onSettingClick?: () => void;
};

const GranterTabHeader = ({
    className,
    title,
    tabs,
    activeTabKey,
    rightSlot,
    onTabChange,
    onSettingClick,
}: GranterTabHeaderProps) => (
    <header className={[styles.TabHeader, className ?? ''].filter(Boolean).join(' ')}>
        <div className={styles.HeaderRow}>
            <div className={styles.TitleGroup}>
                <h2>{title}</h2>
                <button type="button" className={styles.SettingButton} aria-label="설정" onClick={onSettingClick}>
                    <IoSettingsOutline size={20} />
                </button>
            </div>
            <div className={styles.ActionGroup}>{rightSlot}</div>
        </div>

        <div className={styles.TabRow} role="tablist" aria-label={`${title} 탭`}>
            {tabs.map((tab) => {
                const isActive = tab.key === activeTabKey;
                return (
                    <GranterBaseButton
                        key={tab.key}
                        size="sm"
                        variant="ghost"
                        role="tab"
                        aria-selected={isActive}
                        className={[styles.TabButton, isActive ? styles.TabButtonActive : ''].filter(Boolean).join(' ')}
                        onClick={() => onTabChange?.(tab.key)}
                    >
                        {tab.label}
                    </GranterBaseButton>
                );
            })}
        </div>
    </header>
);

export default GranterTabHeader;
