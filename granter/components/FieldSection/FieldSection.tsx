import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './FieldSection.module.scss';

export type FieldSectionProps = {
    title: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    titleClassName?: string;
    rowsClassName?: string;
};

export type FieldSectionEmptyProps = {
    children?: React.ReactNode;
    className?: string;
};

const FieldSectionEmpty = ({ children, className }: FieldSectionEmptyProps) => (
    <p className={classNames(styles.Empty, className)}>{children}</p>
);

const FieldSection = ({ title, children, className, titleClassName, rowsClassName }: FieldSectionProps) => (
    <div className={classNames(styles.Root, className)}>
        <Text size={16} weight="medium" className={classNames(styles.Title, titleClassName)}>
            {title}
        </Text>
        <div className={classNames(styles.Rows, rowsClassName)}>
            {children}
        </div>
    </div>
);

FieldSection.Empty = FieldSectionEmpty;

export default FieldSection;
