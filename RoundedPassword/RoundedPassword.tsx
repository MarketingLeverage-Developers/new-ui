import React, { useState, type InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './RoundedPassword.module.scss';
import { STATUS, type Status } from '@/shared/types/css/Status';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

type RoundedPasswordProps = {
    status?: Status;
    helperText?: React.ReactNode;
    wrapperStyle?: React.CSSProperties; // 래퍼 스타일
    wrapperClassName?: string; //  래퍼 클래스
    inputStyle?: React.CSSProperties; //  인풋 스타일
} & InputHTMLAttributes<HTMLInputElement>;

const isFilled = (v: unknown) =>
    v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : String(v).length > 0);

const RoundedPassword: React.FC<RoundedPasswordProps> = ({
    status = STATUS.DEFAULT,
    helperText,
    value,
    onBlur,
    wrapperClassName,
    wrapperStyle,
    inputStyle,
    className,
    ...props
}) => {
    const [touched, setTouched] = useState(false);
    const [visible, setVisible] = useState(false);

    const filled = isFilled(value);
    const showFeedback = touched || filled;

    const cn = classNames(styles.RoundedPassword, wrapperClassName, {
        [styles.Error]: showFeedback && status === STATUS.ERROR,
        [styles.Success]: showFeedback && status === STATUS.SUCCESS,
        [styles.Touched]: touched,
    });

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
        setTouched(true);
        onBlur?.(e);
    };

    const { style: styleFromProps, ...restProps } = props;

    return (
        <div className={cn} style={wrapperStyle}>
            <input
                {...restProps}
                type={visible ? 'text' : 'password'}
                value={value}
                onBlur={handleBlur}
                className={classNames(styles.Input, className)}
                style={{ ...styleFromProps, ...inputStyle }}
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
