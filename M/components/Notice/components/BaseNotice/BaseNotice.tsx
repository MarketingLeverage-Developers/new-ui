import React, { type HTMLAttributes, type ReactNode } from 'react';
import classNames from 'classnames';
import { FiInfo } from 'react-icons/fi';
import styles from './BaseNotice.module.scss';

export type BaseNoticeStatus = 'default' | 'info' | 'error' | 'warning';

export type BaseNoticeProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    status?: BaseNoticeStatus;
    text: ReactNode;
};

const BaseNotice = (props: BaseNoticeProps) => {
    const { status = 'default', text, className, ...rest } = props;

    const rootClassName = classNames(
        styles.BaseNotice,
        {
            [styles.Default]: status === 'default',
            [styles.Info]: status === 'info',
            [styles.Error]: status === 'error',
            [styles.Warning]: status === 'warning',
        },
        className
    );

    return (
        <div className={rootClassName} {...rest}>
            {status === 'info' ? (
                <span className={styles.Icon}>
                    <FiInfo />
                </span>
            ) : null}
            <span className={styles.Text}>{text}</span>
        </div>
    );
};

export default BaseNotice;
