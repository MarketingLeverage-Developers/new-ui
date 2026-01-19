import React, { useMemo, type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './InputFileUploader.module.scss';

import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';

export type InputFileUploaderProps = {
    placeholder?: ReactNode;
    buttonText?: ReactNode;
    className?: string;
    message?: ReactNode;
};

const InputFileUploader: React.FC<InputFileUploaderProps> = (props) => {
    const { placeholder = '파일을 첨부해주세요', buttonText = '파일첨부', className, message } = props;

    const { type, disabled, accept, multiple, files, inputId, inputRef, addFiles } = useFileUploader();

    const displayText = useMemo(() => {
        if (!files || files.length === 0) return placeholder;

        if (type === 'image') {
            return `${files.length}개 파일 선택됨`;
        }

        return files[0]?.name ?? placeholder;
    }, [files, placeholder, type]);

    const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const picked = Array.from(e.target.files ?? []);
        if (picked.length === 0) return;

        addFiles(picked);

        e.currentTarget.value = '';
    };

    const handleOpen = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    const rootClassName = classNames(styles.InputFileUploader, className, {
        [styles.Disabled]: disabled,
    });

    return (
        <div className={styles.InputFileUploaderWrapper}>
            <div className={rootClassName}>
                <input
                    id={inputId}
                    ref={inputRef}
                    type="file"
                    className={styles.HiddenInput}
                    disabled={disabled}
                    multiple={multiple}
                    accept={accept}
                    onChange={handlePick}
                />

                <div className={styles.LeftText}>{displayText}</div>

                <button type="button" className={styles.AttachButton} onClick={handleOpen} disabled={disabled}>
                    {buttonText}
                </button>
            </div>

            {message ? <div className={styles.Message}>{message}</div> : null}
        </div>
    );
};

export default InputFileUploader;
