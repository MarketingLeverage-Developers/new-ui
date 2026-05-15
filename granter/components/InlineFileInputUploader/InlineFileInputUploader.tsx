import React, { useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { IoCloseOutline } from 'react-icons/io5';
import styles from './InlineFileInputUploader.module.scss';

export type InlineFileInputUploaderType = 'image' | 'file';

export type InlineFileInputUploaderProps<TItem extends object> = {
    type: InlineFileInputUploaderType;
    value?: TItem[];
    onChange?: (next: TItem[]) => void;
    uploader: (args: { files: File[] }) => Promise<TItem[]>;
    getItemName?: (item: TItem, index: number) => string;
    multiple?: boolean;
    accept?: string;
    maxFiles?: number;
    disabled?: boolean;
    placeholder?: React.ReactNode;
    buttonText?: React.ReactNode;
    message?: React.ReactNode;
    className?: string;
};

const toRecord = (item: object): Record<string, unknown> => item as Record<string, unknown>;

const firstString = (record: Record<string, unknown>, keys: string[]) => {
    for (const key of keys) {
        const value = record[key];
        if (typeof value === 'string' && value.trim()) return value;
    }

    return undefined;
};

const getDefaultItemName = (item: object, index: number) => {
    const record = toRecord(item);
    return (
        firstString(record, ['originalFileName', 'storedFileName', 'imageName', 'name', 'fileName']) ??
        `첨부 ${index + 1}`
    );
};

const InlineFileInputUploader = <TItem extends object>({
    type,
    value = [],
    onChange,
    uploader,
    getItemName = getDefaultItemName,
    multiple,
    accept,
    maxFiles,
    disabled = false,
    placeholder = '파일을 첨부해주세요',
    buttonText = '파일첨부',
    message,
    className,
}: InlineFileInputUploaderProps<TItem>) => {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);
    const resolvedMultiple = multiple ?? type === 'image';
    const resolvedMaxFiles = maxFiles ?? (type === 'image' ? 5 : 5);
    const blocked = disabled || uploading;

    const displayText = useMemo(() => {
        if (value.length === 0) return placeholder;
        const firstName = getItemName(value[0], 0);

        return value.length > 1 ? `${firstName} 외 ${value.length - 1}개` : firstName;
    }, [getItemName, placeholder, value]);

    const hasValue = value.length > 0;

    const openFileDialog = () => {
        if (blocked) return;
        inputRef.current?.click();
    };

    const commitUpload = async (files: File[]) => {
        if (blocked || files.length === 0) return;

        const uploadFiles = resolvedMultiple
            ? files.slice(0, Math.max(resolvedMaxFiles - value.length, 0))
            : files.slice(0, 1);
        if (uploadFiles.length === 0) return;

        setUploading(true);
        try {
            const uploaded = await uploader({ files: uploadFiles });
            const next = resolvedMultiple
                ? [...value, ...uploaded].slice(0, resolvedMaxFiles)
                : uploaded.slice(0, 1);
            onChange?.(next);
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        void commitUpload(Array.from(event.target.files ?? []));
    };

    const clearFiles = () => {
        if (blocked) return;
        onChange?.([]);
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className={styles.Root}>
            <div className={classNames(styles.Input, className, { [styles.Disabled]: blocked })}>
                <input
                    id={inputId}
                    ref={inputRef}
                    type="file"
                    className={styles.HiddenInput}
                    accept={accept ?? (type === 'image' ? 'image/png,image/jpeg,image/gif' : undefined)}
                    multiple={resolvedMultiple}
                    disabled={blocked}
                    onChange={handleInputChange}
                />

                <div className={styles.LeftText}>{displayText}</div>

                <button
                    type="button"
                    className={classNames(styles.AttachButton, hasValue && styles.ClearButton)}
                    disabled={blocked}
                    aria-label={hasValue ? '첨부 파일 제거' : undefined}
                    onClick={hasValue ? clearFiles : openFileDialog}
                >
                    {uploading ? '업로드중...' : hasValue ? <IoCloseOutline size={18} /> : buttonText}
                </button>
            </div>

            {message ? <div className={styles.Message}>{message}</div> : null}
        </div>
    );
};

export default InlineFileInputUploader;
