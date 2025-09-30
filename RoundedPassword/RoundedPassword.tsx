import React, { useState, type InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './RoundedPassword.module.scss';
import { STATUS, type Status } from '@/shared/types/css/Status';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

type RoundedPasswordProps = {
    status?: Status;
    helperText?: React.ReactNode;
    wrapperStyle?: React.CSSProperties; // 다은 추가
    wrapperClassName?: string; // 다은 추가
    inputStyle?: React.CSSProperties; // 다은 추가
} & InputHTMLAttributes<HTMLInputElement>;

const isFilled = (v: unknown) =>
    v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : String(v).length > 0);

const RoundedPassword: React.FC<RoundedPasswordProps> = ({
    status = STATUS.DEFAULT,
    helperText,
    value,
    onBlur,
    wrapperClassName, // 다은 추가
    wrapperStyle, // 다은 추가
    inputStyle, // 다은 추가
    ...props
}) => {
    const [touched, setTouched] = useState(false);
    const [visible, setVisible] = useState(false);

    const filled = isFilled(value);
    const showFeedback = touched || filled;

    const cn = classNames(styles.RoundedPassword, {
        [styles.Error]: showFeedback && status === STATUS.ERROR,
        [styles.Success]: showFeedback && status === STATUS.SUCCESS,
        [styles.Touched]: touched,
    });

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
        setTouched(true);
        onBlur?.(e);
    };
    const { style: styleFromProps, ...restProps } = props; // 다은 추가
    return (
        <div className={cn} style={wrapperStyle}>
            {/* 다은 추가 - style={wrapperStyle} */}
            <input
                {...props}
                type={visible ? 'text' : 'password'}
                value={value}
                onBlur={handleBlur}
                className={styles.Input}
                style={{ ...styleFromProps, ...inputStyle }} // 다은 추가
            />
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
            {showFeedback && status !== STATUS.DEFAULT && helperText && (
                <span className={styles.Helper}>{helperText}</span>
            )}
        </div>
    );
};

export default RoundedPassword;
