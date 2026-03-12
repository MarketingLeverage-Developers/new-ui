import React from 'react';
import classNames from 'classnames';
import styles from './Sidebar.module.scss';

export type SidebarProps = {
    children?: React.ReactNode;
    className?: string;
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
};

const Sidebar = ({ children, className, onMouseEnter, onMouseLeave }: SidebarProps) => (
    <aside
        className={classNames(styles.Sidebar, className)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        {children}
    </aside>
);

export default Sidebar;
