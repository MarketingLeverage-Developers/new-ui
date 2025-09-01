import RoundedInput from '@/shared/primitives/RoundedInput/RoundedInput';
import React, { useState, type HtmlHTMLAttributes } from 'react';
import styles from './PasswordInput.module.scss';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import type { Status } from '@/shared/types/css/Status';

type PasswordInputProps = {
    placeholder: string;
    status?: Status;
    helperText?: React.ReactNode;
} & HtmlHTMLAttributes<HTMLDivElement>;

const PasswordInput = ({ placeholder, status, helperText, ...props }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleToggle = () => setShowPassword((prev) => !prev);
    return (
        <div className={styles.PasswordInput} style={{ ...props.style }}>
            <RoundedInput
                status={status}
                helperText={helperText}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
            />
            <div className={styles.Icon}>
                {showPassword ? <IoEye onClick={handleToggle} /> : <IoEyeOff onClick={handleToggle} />}
            </div>
        </div>
    );
};

export default PasswordInput;
