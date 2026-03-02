import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { FiChevronDown } from 'react-icons/fi';
import styles from './GranterSupportMenu.module.scss';

export type GranterSupportMenuItem = {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    href?: string;
    external?: boolean;
    danger?: boolean;
    onClick?: () => void;
};

export type GranterSupportMenuGroup = {
    key: string;
    items: GranterSupportMenuItem[];
};

export type GranterSupportMenuProps = {
    label?: React.ReactNode;
    groups: GranterSupportMenuGroup[];
};

const GranterSupportMenu = ({ label = '고객지원', groups }: GranterSupportMenuProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!open) return;
            if (!rootRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <div ref={rootRef} className={styles.Wrap}>
            <button type="button" className={styles.Trigger} onClick={() => setOpen((prev) => !prev)}>
                {label}
                <FiChevronDown size={14} className={styles.Caret} />
            </button>

            {open ? (
                <div className={styles.Menu}>
                    {groups.map((group) => (
                        <div key={group.key} className={styles.Group}>
                            {group.items.map((item) =>
                                item.href ? (
                                    <a
                                        key={item.key}
                                        href={item.href}
                                        target={item.external ? '_blank' : undefined}
                                        rel={item.external ? 'noreferrer noopener' : undefined}
                                        className={classNames(styles.MenuItem, {
                                            [styles.MenuItemDanger]: item.danger,
                                        })}
                                        onClick={() => {
                                            item.onClick?.();
                                            setOpen(false);
                                        }}
                                    >
                                        {item.icon ? <span className={styles.Icon}>{item.icon}</span> : null}
                                        <span>{item.label}</span>
                                    </a>
                                ) : (
                                    <button
                                        key={item.key}
                                        type="button"
                                        className={classNames(styles.MenuItem, {
                                            [styles.MenuItemDanger]: item.danger,
                                        })}
                                        onClick={() => {
                                            item.onClick?.();
                                            setOpen(false);
                                        }}
                                    >
                                        {item.icon ? <span className={styles.Icon}>{item.icon}</span> : null}
                                        <span>{item.label}</span>
                                    </button>
                                )
                            )}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default GranterSupportMenu;
