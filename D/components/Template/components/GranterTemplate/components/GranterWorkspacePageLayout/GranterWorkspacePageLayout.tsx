import React from 'react';
import classNames from 'classnames';
import styles from './GranterWorkspacePageLayout.module.scss';

export type GranterWorkspacePageLayoutProps = {
    children: React.ReactNode;
    className?: string;
};

const GranterWorkspacePageLayout = ({ children, className }: GranterWorkspacePageLayoutProps) => (
    <div id="workspace-page-layout" className={classNames(styles.Layout, className)}>
        {children}
    </div>
);

export default GranterWorkspacePageLayout;
