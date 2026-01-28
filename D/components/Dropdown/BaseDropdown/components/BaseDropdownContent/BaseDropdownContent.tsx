import React from 'react';
import classNames from 'classnames';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import styles from './BaseDropdownContent.module.scss';

export type BaseDropdownContentProps = React.ComponentProps<typeof Dropdown.Content>;

const BaseDropdownContent: React.FC<BaseDropdownContentProps> = ({ className, ...props }) => (
    <Dropdown.Content {...props} className={classNames(styles.Content, className)} />
);

export default BaseDropdownContent;
