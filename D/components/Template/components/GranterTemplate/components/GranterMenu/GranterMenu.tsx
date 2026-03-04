import React from 'react';
import classNames from 'classnames';
import GranterNavButton from '../../../../../Button/components/GranterNavButton/GranterNavButton';
import styles from './GranterMenu.module.scss';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type GranterMenuItem = {
    key: string;
    label: React.ReactNode;
    icon?: IconType;
    badge?: React.ReactNode;
    disabled?: boolean;
};

export type GranterMenuSection = {
    key: string;
    label?: React.ReactNode;
    items: GranterMenuItem[];
};

type GranterMenuProps = {
    sections: GranterMenuSection[];
    activeItemKey?: string;
    onItemClick?: (itemKey: string) => void;
    compact?: boolean;
    hideSectionLabel?: boolean;
};

const GranterMenu = ({ sections, activeItemKey, onItemClick, compact, hideSectionLabel }: GranterMenuProps) => (
    <nav className={classNames(styles.Menu, { [styles.MenuCompact]: compact })} aria-label="Granter menu">
        {sections.map((section) => (
            <div key={section.key} className={styles.Section}>
                {section.label && !hideSectionLabel ? <p className={styles.SectionLabel}>{section.label}</p> : null}

                {section.items.map((item) => (
                    <GranterNavButton
                        key={item.key}
                        label={item.label}
                        icon={item.icon}
                        badge={item.badge}
                        active={activeItemKey === item.key}
                        disabled={item.disabled}
                        onClick={() => {
                            if (item.disabled) return;
                            onItemClick?.(item.key);
                        }}
                    />
                ))}
            </div>
        ))}
    </nav>
);

export default GranterMenu;
