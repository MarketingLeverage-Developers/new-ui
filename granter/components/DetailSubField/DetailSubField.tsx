import React from 'react';
import classNames from 'classnames';
import styles from './DetailSubField.module.scss';

export type DetailSubFieldTone = 'default' | 'muted' | 'accent' | 'danger';

export type DetailSubFieldProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    label: React.ReactNode;
    children?: React.ReactNode;
    value?: React.ReactNode;
    icon?: React.ReactNode;
    emptyText?: React.ReactNode;
    tone?: DetailSubFieldTone;
};

const isEmpty = (value: React.ReactNode) => value === null || value === undefined || value === '';

const DetailSubField = ({
    label,
    children,
    value,
    icon,
    emptyText = '-',
    tone = 'default',
    className,
    ...props
}: DetailSubFieldProps) => {
    const content = children ?? value;

    return (
        <div className={classNames(styles.Root, className)} {...props}>
            <div className={styles.Label}>
                {icon ? <span className={styles.Icon}>{icon}</span> : null}
                <span>{label}</span>
            </div>
            <div className={styles.Value} data-tone={tone}>
                {isEmpty(content) ? emptyText : content}
            </div>
        </div>
    );
};

export default DetailSubField;
