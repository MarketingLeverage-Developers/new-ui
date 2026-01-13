import type React from 'react';
import { useRef, useState, type InputHTMLAttributes } from 'react';
import styles from './RoundedFileInput.module.scss';
import classNames from 'classnames';
import { STATUS, type Status } from '@/shared/types/css/Status';

type RoundedFileInputProps = {
    wrapperStyle?: React.CSSProperties;
    status?: Status;
    helperText?: React.ReactNode;
    placeholder?: string;
    buttonText?: string;
    onFileChange?: (file: File | null) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'>;

const RoundedFileInput: React.FC<RoundedFileInputProps> = ({
    wrapperStyle,
    className,
    status = STATUS.DEFAULT,
    helperText,
    placeholder = '파일을 첨부해주세요',
    buttonText = '파일첨부',
    onFileChange,
    disabled,
    ...props
}) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const filled = !!fileName;
    const showFeedback = touched || filled;

    const cn = classNames(styles.RoundedFileInput, className, {
        [styles.Error]: showFeedback && status === STATUS.ERROR,
        [styles.Success]: showFeedback && status === STATUS.SUCCESS,
        [styles.Disabled]: disabled,
    });

    const handleClick = () => {
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileName(file?.name || null);
        setTouched(true);
        onFileChange?.(file);
    };

    return (
        <div className={cn} style={{ ...wrapperStyle }}>
            <input ref={inputRef} type="file" onChange={handleChange} disabled={disabled} {...props} />
            <span className={styles.Placeholder}>{fileName || placeholder}</span>
            <button type="button" className={styles.Button} onClick={handleClick} disabled={disabled}>
                {buttonText}
            </button>
            {showFeedback && status !== STATUS.DEFAULT && helperText && (
                <span className={styles.Helper}>{helperText}</span>
            )}
        </div>
    );
};

export default RoundedFileInput;
