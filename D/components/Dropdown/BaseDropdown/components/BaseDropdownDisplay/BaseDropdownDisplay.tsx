import React from 'react';
import classNames from 'classnames';
import styles from './BaseDropdownDisplay.module.scss';

export type BaseDropdownDisplayProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
};

const BaseDropdownDisplay: React.FC<BaseDropdownDisplayProps> = ({ className, ...props }) => (
    <div {...props} className={classNames(styles.Display, className)} />
);

export default BaseDropdownDisplay;
