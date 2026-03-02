import React from 'react';
import classNames from 'classnames';
import styles from './GranterHomeContent.module.scss';

export type GranterHomeContentProps = {
    children: React.ReactNode;
    className?: string;
};

const GranterHomeContent = ({ children, className }: GranterHomeContentProps) => (
    <div className={classNames(styles.Content, className)}>{children}</div>
);

export default GranterHomeContent;
