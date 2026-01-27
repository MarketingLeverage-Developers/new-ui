import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './BaseInput.module.scss';
import type { InputCommonProps } from '../../Input';

export type BaseInputStatus = 'default' | 'error' | 'success';

export type BaseInputExtraProps = {
    status?: BaseInputStatus;
    message?: string;
    prefix?: ReactNode;
    suffix?: ReactNode;
};

type BaseInputProps = InputCommonProps & BaseInputExtraProps;

const BaseInput: React.FC<BaseInputProps> = (props) => {
    const { status = 'default', message, disabled, className, prefix, suffix, ...inputProps } = props;

    const wrapperClassName = classNames(
        styles.BaseInput,
        status === 'error' && styles.Error,
        status === 'success' && styles.Success,
        disabled && styles.Disabled,
        className
    );

    return (
        <div className={wrapperClassName}>
            {prefix ? <div className={styles.Prefix}>{prefix}</div> : null}

            <input disabled={disabled} {...inputProps} />

            {suffix ? <div className={styles.Suffix}>{suffix}</div> : null}

            {message ? <span className={styles.Message}>{message}</span> : null}
        </div>
    );
};

export default BaseInput;
