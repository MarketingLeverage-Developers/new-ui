import React, { useState, type InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './RoundedPassword.module.scss';
import { STATUS, type Status } from '@/shared/types/css/Status';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

type RoundedPasswordProps = {
    status?: Status;
    helperText?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

const RoundedPassword = ({ status = STATUS.DEFAULT, helperText, ...props }: RoundedPasswordProps) => {
    const [visible, setVisible] = useState(false);

    const roundedPasswordClassName = classNames(styles.RoundedPassword, {
        [styles.Error]: status === STATUS.ERROR,
        [styles.Success]: status === STATUS.SUCCESS,
    });

    return (
        <div className={roundedPasswordClassName}>
            <input {...props} type={visible ? 'text' : 'password'} className={styles.Input} />
            <button
                type="button"
                className={styles.EyeButton}
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
                {visible ? (
                    <AiFillEye className={styles.EyeIcon} aria-hidden="true" />
                ) : (
                    <AiFillEyeInvisible className={styles.EyeIcon} aria-hidden="true" />
                )}
            </button>
            {status !== STATUS.DEFAULT && <span className={styles.Helper}>{helperText}</span>}
        </div>
    );
};

export default RoundedPassword;
