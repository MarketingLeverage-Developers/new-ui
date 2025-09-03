// shared/primitives/RoundedInput/RoundedInput.tsx

import React, { useState, type InputHTMLAttributes } from 'react';
import styles from './RoundedInput.module.scss';
import classNames from 'classnames';
import { STATUS, type Status } from '@/shared/types/css/Status';

type RoundedInputProps = {
    wrapperStyle?: React.CSSProperties;
    status?: Status;
    helperText?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

const isFilled = (v: unknown) =>
    v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : String(v).length > 0);

const RoundedInput: React.FC<RoundedInputProps> = ({
    wrapperStyle,
    className,
    onBlur,
    status = STATUS.DEFAULT,
    helperText,
    value, // value를 분해해서 filled 판단에 사용
    ...props
}) => {
    const [touched, setTouched] = useState(false);
    const filled = isFilled(value);
    const showFeedback = touched || filled;

    const cn = classNames(styles.RoundedInput, className, {
        [styles.Error]: showFeedback && status === STATUS.ERROR,
        [styles.Success]: showFeedback && status === STATUS.SUCCESS,
        [styles.Touched]: touched,
    });

    const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
        setTouched(true);
        onBlur?.(e);
    };

    return (
        <div className={cn} style={{ ...wrapperStyle }}>
            <input {...props} value={value} onBlur={handleBlur} />
            {showFeedback && status !== STATUS.DEFAULT && helperText && (
                <span className={styles.Helper}>{helperText}</span>
            )}
        </div>
    );
};

export default RoundedInput;
