import React from 'react';
import classNames from 'classnames';
import Dropdown from '../../../../../../shared/headless/Dropdown/Dropdown';
import styles from './BaseDropdownContent.module.scss';

export type BaseDropdownContentProps = React.ComponentProps<typeof Dropdown.Content> & {
    contentVariant?: 'base' | 'date-range';
};

const BaseDropdownContent: React.FC<BaseDropdownContentProps> = ({
    className,
    contentVariant = 'base',
    ...props
}) => (
    <Dropdown.Content
        {...props}
        className={classNames(styles.Content, contentVariant === 'date-range' && styles.DateRangeContent, className)}
    />
);

export default BaseDropdownContent;
