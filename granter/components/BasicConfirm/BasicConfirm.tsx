import React from 'react';
import classNames from 'classnames';
import styles from './BasicConfirm.module.scss';

export type BasicConfirmProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    onCancel: () => unknown | Promise<unknown>;
    onConfirm: () => unknown | Promise<unknown>;
    icon?: React.ReactNode;
    cancelText?: React.ReactNode;
    confirmText?: React.ReactNode;
    className?: string;
    actionsClassName?: string;
};

const BasicConfirm = ({
    title,
    description,
    onCancel,
    onConfirm,
    icon,
    cancelText = '취소',
    confirmText = '확인',
    className,
    actionsClassName,
}: BasicConfirmProps) => {
    const handleCancelClick = () => {
        void onCancel();
    };

    const handleConfirmClick = () => {
        void onConfirm();
    };

    return (
        <section className={classNames(styles.BasicConfirm, className)}>
            {icon ? (
                <div className={styles.Icon} aria-hidden="true">
                    {icon}
                </div>
            ) : null}

            <div className={styles.Texts}>
                <h3 className={styles.Title}>{title}</h3>
                {description ? <p className={styles.Description}>{description}</p> : null}
            </div>

            <div className={classNames(styles.Actions, actionsClassName)}>
                <button
                    type="button"
                    className={styles.ActionButton}
                    data-variant="secondary"
                    onClick={handleCancelClick}
                >
                    {cancelText}
                </button>

                <button
                    type="button"
                    className={styles.ActionButton}
                    data-variant="primary"
                    onClick={handleConfirmClick}
                >
                    {confirmText}
                </button>
            </div>
        </section>
    );
};

export default BasicConfirm;
