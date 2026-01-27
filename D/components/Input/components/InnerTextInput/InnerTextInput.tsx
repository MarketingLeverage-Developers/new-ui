import React, { forwardRef, useState, type InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './InnerTextInput.module.scss';
import { STATUS, type Status } from '@/shared/types/css/Status';

export type InnerTextInputProps = {
    innerText: string;
    unit?: string;
    wrapperStyle?: React.CSSProperties;
    status?: Status;
    helperText?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

const isFilled = (v: unknown) => v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : String(v).length > 0);

const InnerTextInput = forwardRef<HTMLInputElement, InnerTextInputProps>(
    ({ innerText, unit, wrapperStyle, className, onBlur, status = STATUS.DEFAULT, helperText, value, ...props }, ref) => {
        const [touched, setTouched] = useState(false);

        const filled = isFilled(value);
        const showFeedback = (touched || filled) && status !== STATUS.DEFAULT;

        const cn = classNames(styles.InnerTextInput, className, {
            [styles.Error]: showFeedback && status === STATUS.ERROR,
            [styles.Success]: showFeedback && status === STATUS.SUCCESS,
            [styles.Touched]: touched,
        });

        const handleBlur: React.FocusEventHandler<HTMLInputElement> = (e) => {
            setTouched(true);
            onBlur?.(e);
        };

        return (
            <div className={cn} style={wrapperStyle}>
                <span className={styles.InnerText}>{innerText}</span>
                <input ref={ref} value={value ?? ''} onBlur={handleBlur} className={styles.Input} {...props} />
                {unit && <span className={styles.Unit}>{unit}</span>}
                {showFeedback && helperText && <span className={styles.Helper}>{helperText}</span>}
            </div>
        );
    }
);

InnerTextInput.displayName = 'InnerTextInput';

export default InnerTextInput;
