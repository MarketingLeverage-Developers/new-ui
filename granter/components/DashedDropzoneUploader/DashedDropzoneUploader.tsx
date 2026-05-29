import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { FiDownload, FiFile, FiImage, FiPlayCircle, FiUploadCloud, FiX } from 'react-icons/fi';
import BasicModal from '../BasicModal/BasicModal';
import { useToast } from '@/components/common/shared/headless/ToastProvider/ToastProvider';
import { downloadFileFromUrl } from '@/components/common/shared/utils/download/download';
import styles from './DashedDropzoneUploader.module.scss';

export type DashedDropzoneUploaderVariant = 'image' | 'file';
const MIN_PREVIEW_ZOOM = 1;
const MAX_PREVIEW_ZOOM = 20;
const PREVIEW_ZOOM_SENSITIVITY = 0.00045;

const getNextPreviewZoom = (currentZoom: number, deltaY: number) =>
    Math.min(MAX_PREVIEW_ZOOM, Math.max(MIN_PREVIEW_ZOOM, currentZoom * Math.exp(deltaY * -PREVIEW_ZOOM_SENSITIVITY)));

export type DashedDropzoneUploaderProps<TItem extends object> = {
    variant: DashedDropzoneUploaderVariant;
    value?: TItem[];
    onChange?: (next: TItem[]) => void;
    uploader?: (args: { files: File[] }) => Promise<TItem[]>;
    getItemKey?: (item: TItem, index: number) => string;
    getItemName?: (item: TItem, index: number) => string;
    getItemUrl?: (item: TItem, index: number) => string | undefined;
    getItemMetaText?: (item: TItem, index: number) => string | undefined;
    onItemClick?: (item: TItem, index: number) => void;
    maxFiles?: number;
    maxFileSizeBytes?: number;
    maxFileSizeLabel?: string;
    multiple?: boolean;
    accept?: string;
    disabled?: boolean;
    readOnly?: boolean;
    buttonText?: string;
    guideText?: string;
    helperText?: string;
    emptyText?: string;
    showEmpty?: boolean;
    className?: string;
};

type PreviewImage = {
    name: string;
    url: string;
    type: 'image' | 'video';
};

const MP4_PATTERN = /\.mp4(?:$|[?#])/i;
const isMp4Preview = (name?: string, url?: string) => MP4_PATTERN.test(name ?? '') || MP4_PATTERN.test(url ?? '');

const formatFileSizeLimit = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${Number.isInteger(mb) ? mb : mb.toFixed(1)}MB`;
};

const toRecord = (item: object): Record<string, unknown> => item as Record<string, unknown>;

const firstString = (record: Record<string, unknown>, keys: string[]) => {
    for (const key of keys) {
        const value = record[key];
        if (typeof value === 'string' && value.trim()) return value;
    }

    return undefined;
};

const resolveItemUrl = (url?: string) => {
    const trimmedUrl = url?.trim() ?? '';
    if (!trimmedUrl) return '';
    if (/^([a-z][a-z0-9+.-]*:)?\/\//i.test(trimmedUrl) || /^(data|blob):/i.test(trimmedUrl)) return trimmedUrl;

    const apiOrigin = String(
        typeof window !== 'undefined' && window.runtimeConfig?.VITE_API_URL
            ? window.runtimeConfig.VITE_API_URL
            : import.meta.env.VITE_API_URL ?? ''
    ).replace(/\/+$/, '');

    if (!apiOrigin) return trimmedUrl;

    const path = trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`;
    if (apiOrigin.endsWith('/api') && path.startsWith('/api/')) return `${apiOrigin}${path.slice(4)}`;
    if (apiOrigin.endsWith('/api') || path.startsWith('/api/')) return `${apiOrigin}${path}`;
    return `${apiOrigin}/api${path}`;
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
    const url = firstString(record, ['imageUrl', 'filePath', 'fileUrl', 'url']);
    return resolveItemUrl(url);
};

const getDefaultItemMetaText = (item: object) => {
    const record = toRecord(item);
    const explicitType = firstString(record, ['fileType', 'type']);
    if (explicitType) return explicitType.toUpperCase();

    const name = firstString(record, ['originalFileName', 'storedFileName', 'fileName', 'name', 'filePath', 'fileUrl', 'url']);
    const sanitizedName = name?.split(/[?#]/)[0] ?? '';
    const extension = sanitizedName.includes('.') ? sanitizedName.split('.').pop() : '';

    return extension ? extension.toUpperCase() : 'FILE';
};

const ReadOnlyImagePreview = ({ preview, onClose }: { preview: PreviewImage; onClose: () => void }) => {
    const [zoom, setZoom] = useState(MIN_PREVIEW_ZOOM);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isZoomedIn = zoom > 1.001;

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const handleWheel = (event: WheelEvent) => {
            if (!event.ctrlKey) return;

            event.preventDefault();
            setZoom((prevZoom) => getNextPreviewZoom(prevZoom, event.deltaY));
        };

        el.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            el.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div
            ref={scrollRef}
            className={styles.ReadOnlyImagePreviewViewport}
            style={{
                overflowX: isZoomedIn ? 'auto' : 'hidden',
                overflowY: isZoomedIn ? 'auto' : 'hidden',
            }}
            onClick={onClose}
        >
            <div
                className={styles.ReadOnlyImagePreviewCanvas}
                style={{
                    width: `${zoom * 100}%`,
                    height: `${zoom * 100}%`,
                }}
                onClick={(event) => event.stopPropagation()}
            >
                <img className={styles.ReadOnlyImagePreviewImage} src={preview.url} alt={preview.name} />
            </div>
        </div>
    );
};

const ReadOnlyVideoPreview = ({ preview, onClose }: { preview: PreviewImage; onClose: () => void }) => (
    <div className={styles.ReadOnlyVideoPreviewViewport} onClick={onClose}>
        <div className={styles.ReadOnlyVideoPreviewCanvas} onClick={(event) => event.stopPropagation()}>
            <video
                className={styles.ReadOnlyVideoPreviewPlayer}
                src={preview.url}
                controls
                autoPlay
                playsInline
                muted
                aria-label={preview.name}
            />
        </div>
    </div>
);

const DashedDropzoneUploader = <TItem extends object>({
    variant,
    value = [],
    onChange,
    uploader,
    getItemKey = getDefaultItemKey,
    getItemName = getDefaultItemName,
    getItemUrl = getDefaultItemUrl,
    getItemMetaText = getDefaultItemMetaText,
    onItemClick,
    maxFiles,
    maxFileSizeBytes,
    maxFileSizeLabel,
    multiple,
    accept,
    disabled = false,
    readOnly = false,
    buttonText = '파일첨부',
    guideText,
    helperText,
    emptyText,
    showEmpty = true,
    className,
}: DashedDropzoneUploaderProps<TItem>) => {
    const { addToast } = useToast();
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<PreviewImage | null>(null);
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

    const isOverMaxFileSize = (file: File) =>
        typeof maxFileSizeBytes === 'number' && maxFileSizeBytes > 0 && file.size > maxFileSizeBytes;

    const showFileSizeError = (files: File[]) => {
        if (!maxFileSizeBytes || files.length === 0) return;

        const limitLabel = maxFileSizeLabel ?? formatFileSizeLimit(maxFileSizeBytes);
        const message =
            files.length === 1
                ? `${files[0].name} 파일은 ${limitLabel} 이하만 업로드할 수 있습니다.`
                : `${limitLabel} 이하 파일만 업로드할 수 있습니다. ${files.length}개 파일이 제외되었습니다.`;

        addToast({
            message,
            type: 'error',
            duration: 2400,
            dismissible: true,
        });
    };

    const commitUpload = async (files: File[]) => {
        if (blocked || files.length === 0 || !canAddMore || !uploader) return;

        const oversizedFiles = files.filter(isOverMaxFileSize);
        showFileSizeError(oversizedFiles);

        const sizeValidFiles = oversizedFiles.length ? files.filter((file) => !isOverMaxFileSize(file)) : files;
        const remainingCount = resolvedMultiple ? Math.max(resolvedMaxFiles - value.length, 0) : 1;
        const uploadFiles = sizeValidFiles.slice(0, remainingCount);
        if (uploadFiles.length === 0) {
            if (inputRef.current) inputRef.current.value = '';
            return;
        }

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

    const readOnlyItems = useMemo(
        () =>
            value.map((item, index) => ({
                item,
                index,
                key: getItemKey(item, index),
                name: getItemName(item, index),
                url: getItemUrl(item, index) ?? '',
                metaText: getItemMetaText(item, index),
            })),
        [getItemKey, getItemMetaText, getItemName, getItemUrl, value]
    );
    const visibleReadOnlyItems = useMemo(() => {
        if (variant !== 'file') return readOnlyItems;

        return readOnlyItems.filter((file) => {
            const fallbackName = `첨부 ${file.index + 1}`;
            return Boolean(file.url || (file.name.trim() && file.name !== fallbackName));
        });
    }, [readOnlyItems, variant]);

    const downloadAttachment = async (url: string, fileName: string) => {
        if (!url) {
            addToast({
                icon: '⚠️',
                message: '다운로드할 파일이 없습니다.',
                duration: 2000,
                dismissible: true,
            });
            return;
        }

        await downloadFileFromUrl(url, fileName);
    };

    if (readOnly) {
        if (visibleReadOnlyItems.length === 0 && !showEmpty) return null;

        return (
            <div className={classNames(styles.Root, className)} data-variant={variant} data-readonly="true">
                {visibleReadOnlyItems.length === 0 && showEmpty ? (
                    <p className={styles.EmptyText}>{resolvedEmptyText}</p>
                ) : null}

                {variant === 'image' && visibleReadOnlyItems.length > 0 ? (
                    <>
                        <div className={styles.ReadOnlyImageList}>
                            {visibleReadOnlyItems.map((image) => {
                                const isVideo = isMp4Preview(image.name, image.url);

                                return (
                                    <div key={image.key} className={styles.ReadOnlyImageItem}>
                                        <div className={styles.ReadOnlyImageThumbWrap}>
                                            <button
                                                type="button"
                                                className={styles.ReadOnlyImageThumbButton}
                                                disabled={!image.url}
                                                onClick={() => {
                                                    if (!image.url) return;
                                                    onItemClick?.(image.item, image.index);
                                                    setPreview({
                                                        name: image.name,
                                                        url: image.url,
                                                        type: isVideo ? 'video' : 'image',
                                                    });
                                                }}
                                            >
                                                {image.url ? (
                                                    isVideo ? (
                                                        <video src={image.url} preload="metadata" muted playsInline />
                                                    ) : (
                                                        <img src={image.url} alt={image.name} />
                                                    )
                                                ) : (
                                                    <span>
                                                        <FiImage size={18} />
                                                        이미지
                                                    </span>
                                                )}
                                            </button>
                                            {isVideo ? (
                                                <span className={styles.VideoBadge} aria-hidden="true">
                                                    <FiPlayCircle />
                                                </span>
                                            ) : null}
                                            <div className={styles.ReadOnlyImageDim} />
                                            <div className={styles.ReadOnlyImageActions}>
                                                <button
                                                    type="button"
                                                    className={styles.ReadOnlyImageDownloadButton}
                                                    aria-label={`${image.name} 다운로드`}
                                                    disabled={!image.url}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        void downloadAttachment(image.url, image.name);
                                                    }}
                                                >
                                                    <FiDownload size={24} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className={styles.ReadOnlyImageCaption}>
                                            <span className={styles.ReadOnlyImageName} title={image.name}>
                                                {image.name}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <BasicModal
                            open={Boolean(preview)}
                            onChange={() => setPreview(null)}
                            width="100%"
                            height="90%"
                            maxHeight="90vh"
                            contentClassName={styles.ReadOnlyImagePreviewModalContent}
                            backdropClassName={styles.ReadOnlyImagePreviewModalBackdrop}
                            content={
                                preview ? (
                                    preview.type === 'video' ? (
                                        <ReadOnlyVideoPreview preview={preview} onClose={() => setPreview(null)} />
                                    ) : (
                                        <ReadOnlyImagePreview preview={preview} onClose={() => setPreview(null)} />
                                    )
                                ) : null
                            }
                        />
                    </>
                ) : null}

                {variant === 'file' && visibleReadOnlyItems.length > 0 ? (
                    <div className={styles.ReadOnlyFileList}>
                        {visibleReadOnlyItems.map((file) => (
                            <div key={file.key} className={styles.ReadOnlyFileItem}>
                                <div className={styles.ReadOnlyFileMeta}>
                                    <span className={styles.ReadOnlyFileName} title={file.name}>
                                        {file.name}
                                    </span>
                                    {file.metaText ? (
                                        <span className={styles.ReadOnlyFileType}>{file.metaText}</span>
                                    ) : null}
                                </div>
                                <button
                                    type="button"
                                    className={styles.ReadOnlyFileDownloadButton}
                                    disabled={!file.url}
                                    onClick={() => {
                                        onItemClick?.(file.item, file.index);
                                        void downloadAttachment(file.url, file.name);
                                    }}
                                >
                                    다운로드
                                </button>
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }

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
                        const isVideo = isMp4Preview(name, url);

                        return (
                            <div key={getItemKey(item, index)} className={styles.ImageItem}>
                                <div className={styles.ImageThumb}>
                                    {url ? (
                                        isVideo ? (
                                            <video src={url} preload="metadata" muted playsInline />
                                        ) : (
                                            <img src={url} alt={name} />
                                        )
                                    ) : (
                                        <span>이미지</span>
                                    )}
                                    {isVideo ? (
                                        <span className={styles.VideoBadge} aria-hidden="true">
                                            <FiPlayCircle />
                                        </span>
                                    ) : null}
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
