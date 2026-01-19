import React, { type ReactNode } from 'react';
import styles from './BaseInput.module.scss';
import type { InputCommonProps } from '../../Input';

export type BaseInputStatus = 'default' | 'error' | 'success';

export type BaseInputExtraProps = {
    status?: BaseInputStatus;
    message?: string;

    /** ✅ 왼쪽에 붙는 영역 (예: "총 광고비*", 아이콘 등) */
    prefix?: ReactNode;

    /** ✅ 오른쪽에 붙는 영역 (예: "원", 버튼, 아이콘 등) */
    suffix?: ReactNode;
};

type BaseInputProps = InputCommonProps & BaseInputExtraProps;

const BaseInput: React.FC<BaseInputProps> = (props) => {
    const { status = 'default', message, disabled, className, prefix, suffix, ...inputProps } = props;

    const wrapperClassName = [
        styles.BaseInput,
        status === 'error' ? styles.Error : '',
        status === 'success' ? styles.Success : '',
        disabled ? styles.Disabled : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

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
