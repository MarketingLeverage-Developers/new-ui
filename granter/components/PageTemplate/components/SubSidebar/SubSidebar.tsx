import React from 'react';
import classNames from 'classnames';
import styles from './SubSidebar.module.scss';

export type SubSidebarProps = {
    children?: React.ReactNode;
    className?: string;
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
};

const SubSidebar = ({ children, className, onMouseEnter, onMouseLeave }: SubSidebarProps) => (
    <aside
        className={classNames(styles.SubSidebar, className)}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        {children}
    </aside>
);

export default SubSidebar;
