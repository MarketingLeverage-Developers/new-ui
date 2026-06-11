import React from 'react';
import classNames from 'classnames';
import styles from './DetailInputField.module.scss';

export type DetailInputFieldProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    label: React.ReactNode;
    children: React.ReactNode;
    icon?: React.ReactNode;
    hint?: React.ReactNode;
    controlClassName?: string;
};

const DetailInputField = ({
    label,
    children,
    icon,
    hint,
    className,
    controlClassName,
    ...props
}: DetailInputFieldProps) => (
    <div className={classNames(styles.Root, className)} {...props}>
        <div className={styles.Label}>
            {icon ? <span className={styles.Icon}>{icon}</span> : null}
            <span>{label}</span>
        </div>
        <div className={classNames(styles.Control, controlClassName)}>{children}</div>
        {hint ? <p className={styles.Hint}>{hint}</p> : null}
    </div>
);

export default DetailInputField;
