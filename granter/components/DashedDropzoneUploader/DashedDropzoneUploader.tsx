import React, { useId, useRef, useState } from 'react';
import classNames from 'classnames';
import { FiFile, FiImage, FiUploadCloud, FiX } from 'react-icons/fi';
import styles from './DashedDropzoneUploader.module.scss';

export type DashedDropzoneUploaderVariant = 'image' | 'file';

export type DashedDropzoneUploaderProps<TItem extends object> = {
    variant: DashedDropzoneUploaderVariant;
    value?: TItem[];
    onChange?: (next: TItem[]) => void;
    uploader: (args: { files: File[] }) => Promise<TItem[]>;
    getItemKey?: (item: TItem, index: number) => string;
    getItemName?: (item: TItem, index: number) => string;
    getItemUrl?: (item: TItem, index: number) => string | undefined;
    onItemClick?: (item: TItem, index: number) => void;
    maxFiles?: number;
    multiple?: boolean;
    accept?: string;
    disabled?: boolean;
    readOnly?: boolean;
    buttonText?: string;
    guideText?: string;
    helperText?: string;
    emptyText?: string;
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

const getDefaultItemKey = (item: object, index: number) => {
    const record = toRecord(item);
    return (
        firstString(record, ['imageUUID', 'fileUUID', 'id', 'uuid', 'key']) ??
        `dashed-dropzone-upload-${index}`
    );
};

const getDefaultItemName = (item: object, index: number) => {
    const record = toRecord(item);
    return (
        firstString(record, ['imageName', 'originalFileName', 'storedFileName', 'name', 'fileName']) ??
        `첨부 ${index + 1}`
    );
};

const getDefaultItemUrl = (item: object) => {
    const record = toRecord(item);
    const url = firstString(record, ['imageUrl', 'filePath', 'url']);
    if (!url || /^https?:\/\//i.test(url) || url.startsWith('blob:') || url.startsWith('data:')) return url;

    const baseUrl = String(import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
    if (!baseUrl) return url;

    return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/api/${url}`;
};

const DashedDropzoneUploader = <TItem extends object>({
    variant,
    value = [],
    onChange,
    uploader,
    getItemKey = getDefaultItemKey,
    getItemName = getDefaultItemName,
    getItemUrl = getDefaultItemUrl,
    onItemClick,
    maxFiles,
    multiple,
    accept,
    disabled = false,
    readOnly = false,
    buttonText = '파일첨부',
    guideText,
    helperText,
    emptyText,
    className,
}: DashedDropzoneUploaderProps<TItem>) => {
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const resolvedMaxFiles = maxFiles ?? (variant === 'image' ? 5 : 1);
    const resolvedMultiple = multiple ?? variant === 'image';
    const blocked = disabled || uploading || readOnly;
    const canAddMore = !resolvedMultiple ? true : value.length < resolvedMaxFiles;
    const resolvedGuideText =
        guideText ??
        (variant === 'image'
            ? `${resolvedMaxFiles}개 이하의 이미지를 첨부해주세요.`
            : resolvedMaxFiles === 1
              ? '파일 1개를 첨부해주세요.'
              : `${resolvedMaxFiles}개 이하의 파일을 첨부해주세요.`);
    const resolvedHelperText =
        helperText ??
        (variant === 'image'
            ? 'jpg, png, gif 파일을 등록할 수 있습니다.'
            : '문서, 이미지, 압축 파일을 등록할 수 있습니다.');
    const resolvedEmptyText =
        emptyText ?? (variant === 'image' ? '첨부된 이미지가 없습니다.' : '첨부된 파일이 없습니다.');

    const openFileDialog = () => {
        if (blocked || !canAddMore) return;
        inputRef.current?.click();
    };

    const commitUpload = async (files: File[]) => {
        if (blocked || files.length === 0 || !canAddMore) return;

        const remainingCount = resolvedMultiple ? Math.max(resolvedMaxFiles - value.length, 0) : 1;
        const uploadFiles = files.slice(0, remainingCount);
        if (uploadFiles.length === 0) return;

        setUploading(true);
        try {
            const uploaded = await uploader({ files: uploadFiles });
            const next = resolvedMultiple ? [...value, ...uploaded].slice(0, resolvedMaxFiles) : uploaded.slice(0, 1);
            onChange?.(next);
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const removeItem = (targetIndex: number) => {
        if (blocked) return;
        onChange?.(value.filter((_, index) => index !== targetIndex));
    };

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        void commitUpload(Array.from(event.target.files ?? []));
    };

    const handleDragEnter: React.DragEventHandler<HTMLDivElement> = (event) => {
        if (blocked || !canAddMore) return;
        event.preventDefault();
        event.stopPropagation();
        setDragging(true);
    };

    const handleDragOver: React.DragEventHandler<HTMLDivElement> = (event) => {
        if (blocked || !canAddMore) return;
        event.preventDefault();
        event.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave: React.DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
    };

    const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
        if (blocked || !canAddMore) return;
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
        void commitUpload(Array.from(event.dataTransfer.files ?? []));
    };

    return (
        <div className={classNames(styles.Root, className)} data-variant={variant}>
            {!readOnly ? (
                <div
                    className={styles.Dropzone}
                    data-dragging={dragging ? 'true' : 'false'}
                    data-disabled={blocked || !canAddMore ? 'true' : 'false'}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className={styles.DropzoneLeft}>
                        <span className={styles.DropzoneIcon}>
                            {variant === 'image' ? <FiImage size={30} /> : <FiFile size={30} />}
                        </span>
                        <div className={styles.DropzoneText}>
                            <span className={styles.GuideText}>{resolvedGuideText}</span>
                            <span className={styles.HelperText}>{resolvedHelperText}</span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className={styles.UploadButton}
                        disabled={blocked || !canAddMore}
                        onClick={openFileDialog}
                    >
                        <FiUploadCloud size={16} />
                        {uploading ? '업로드 중' : buttonText}
                    </button>
                    <input
                        ref={inputRef}
                        id={inputId}
                        className={styles.HiddenInput}
                        type="file"
                        accept={accept ?? (variant === 'image' ? 'image/*' : undefined)}
                        multiple={resolvedMultiple}
                        disabled={blocked || !canAddMore}
                        onChange={handleInputChange}
                    />
                </div>
            ) : null}

            {value.length === 0 ? <p className={styles.EmptyText}>{resolvedEmptyText}</p> : null}

            {variant === 'image' && value.length > 0 ? (
                <div className={styles.ImageList}>
                    {value.map((item, index) => {
                        const url = getItemUrl(item, index);
                        const name = getItemName(item, index);

                        return (
                            <div key={getItemKey(item, index)} className={styles.ImageItem}>
                                <div className={styles.ImageThumb}>
                                    {url ? <img src={url} alt={name} /> : <span>이미지</span>}
                                    {readOnly ? null : (
                                        <button
                                            type="button"
                                            className={styles.RemoveImageButton}
                                            disabled={blocked}
                                            aria-label={`${name} 제거`}
                                            onClick={() => removeItem(index)}
                                        >
                                            <FiX size={14} />
                                        </button>
                                    )}
                                </div>
                                {onItemClick ? (
                                    <button
                                        type="button"
                                        className={styles.ItemNameButton}
                                        title={name}
                                        onClick={() => onItemClick(item, index)}
                                    >
                                        {name}
                                    </button>
                                ) : (
                                    <span className={styles.ImageName} title={name}>
                                        {name}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : null}

            {variant === 'file' && value.length > 0 ? (
                <div className={styles.FileList}>
                    {value.map((item, index) => {
                        const name = getItemName(item, index);
                        const fileContent = (
                            <>
                                <span className={styles.FileIcon}>
                                    <FiFile size={16} />
                                </span>
                                <span className={styles.FileName} title={name}>
                                    {name}
                                </span>
                                {readOnly ? null : (
                                    <button
                                        type="button"
                                        className={styles.RemoveFileButton}
                                        disabled={blocked}
                                        aria-label={`${name} 제거`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            removeItem(index);
                                        }}
                                    >
                                        <FiX size={14} />
                                    </button>
                                )}
                            </>
                        );

                        return onItemClick ? (
                            <button
                                type="button"
                                key={getItemKey(item, index)}
                                className={styles.FileItem}
                                onClick={() => onItemClick?.(item, index)}
                            >
                                {fileContent}
                            </button>
                        ) : (
                            <div key={getItemKey(item, index)} className={styles.FileItem}>
                                {fileContent}
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

export default DashedDropzoneUploader;
