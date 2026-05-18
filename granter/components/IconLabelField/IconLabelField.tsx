import React from 'react';
import classNames from 'classnames';
import styles from './IconLabelField.module.scss';

export type IconLabelFieldProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    label: React.ReactNode;
    icon?: React.ReactNode;
    children: React.ReactNode;
    required?: boolean;
    helperText?: React.ReactNode;
    rightRender?: React.ReactNode;
    contentClassName?: string;
};

const IconLabelField = ({
    label,
    icon,
    children,
    required = false,
    helperText,
    rightRender,
    className,
    contentClassName,
    ...props
}: IconLabelFieldProps) => (
    <div className={classNames(styles.Root, className)} {...props}>
        <div className={styles.Label}>
            <span className={styles.LabelMain}>
                {icon ? <span className={styles.Icon}>{icon}</span> : null}
                <span className={styles.LabelText}>{label}</span>
                {required ? <span className={styles.RequiredMark}>*</span> : null}
            </span>
            {rightRender ? <span className={styles.RightRender}>{rightRender}</span> : null}
        </div>
        <div className={classNames(styles.Content, contentClassName)}>{children}</div>
        {helperText ? <p className={styles.HelperText}>{helperText}</p> : null}
    </div>
);

export default IconLabelField;
