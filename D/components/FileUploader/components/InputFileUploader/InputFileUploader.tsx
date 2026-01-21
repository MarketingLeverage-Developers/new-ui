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

    const { type, disabled, accept, multiple, serverItems, inputId, inputRef, addFiles, isUploading } =
        useFileUploader();

    const displayText = useMemo(() => {
        const count = Array.isArray(serverItems) ? serverItems.length : 0;
        if (count === 0) return placeholder;

        if (type === 'image') {
            return `${count}개 파일 선택됨`;
        }

        const first = serverItems[0] as any;
        return first?.originalFileName ?? first?.storedFileName ?? placeholder;
    }, [placeholder, serverItems, type]);

    const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const picked = Array.from(e.target.files ?? []);
        if (picked.length === 0) return;

        addFiles(picked);

        e.currentTarget.value = '';
    };

    const handleOpen = () => {
        if (disabled || isUploading) return;
        inputRef.current?.click();
    };

    const rootClassName = classNames(styles.InputFileUploader, className, {
        [styles.Disabled]: disabled || isUploading,
    });

    return (
        <div className={styles.InputFileUploaderWrapper}>
            <div className={rootClassName}>
                <input
                    id={inputId}
                    ref={inputRef}
                    type="file"
                    className={styles.HiddenInput}
                    disabled={disabled || isUploading}
                    multiple={multiple}
                    accept={accept}
                    onChange={handlePick}
                />

                <div className={styles.LeftText}>{displayText}</div>

                <button
                    type="button"
                    className={styles.AttachButton}
                    onClick={handleOpen}
                    disabled={disabled || isUploading}
                >
                    {isUploading ? '업로드중...' : buttonText}
                </button>
            </div>

            {message ? <div className={styles.Message}>{message}</div> : null}
        </div>
    );
};

export default InputFileUploader;
