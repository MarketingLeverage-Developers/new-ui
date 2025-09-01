import React, { type InputHTMLAttributes } from 'react';
import styles from './RoundedInput.module.scss';
import classNames from 'classnames';
import { STATUS, type Status } from '@/shared/types/css/Status';

type RoundedInputProps = {
    status?: Status;
    helperText?: React.ReactNode;
    wrapperStyle?: React.CSSProperties;
} & InputHTMLAttributes<HTMLInputElement>;

const RoundedInput = ({ status = STATUS.DEFAULT, helperText, wrapperStyle, ...props }: RoundedInputProps) => {
    const rounedInputClassName = classNames(styles.RoundedInput, {
        [styles.Error]: status === STATUS.ERROR,
        [styles.Success]: status === STATUS.SUCCESS,
    });

    return (
        <div className={rounedInputClassName} style={{ ...wrapperStyle }}>
            <input {...props} />
            {status !== 'default' && <span>{helperText}</span>}
        </div>
    );
};

export default RoundedInput;
