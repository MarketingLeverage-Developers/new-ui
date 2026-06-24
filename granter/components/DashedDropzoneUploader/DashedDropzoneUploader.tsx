import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { FiDownload, FiFile, FiImage, FiPlayCircle, FiUploadCloud, FiX } from 'react-icons/fi';
import { IoIosCloseCircle } from 'react-icons/io';
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
    getItemDateText?: (item: TItem, index: number) => string | undefined;
    getItemSizeText?: (item: TItem, index: number) => string | undefined;
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

const VIDEO_PREVIEW_PATTERN = /\.(?:mp4|mov|webm|m4v|avi|mkv)(?:$|[?#])/i;
const IMAGE_PREVIEW_PATTERN = /\.(?:png|jpe?g|gif|webp|bmp|svg)(?:$|[?#])/i;
const isVideoPreview = (name?: string, url?: string, metaText?: string) => {
    const normalizedMeta = metaText?.toLowerCase() ?? '';
    return (
        VIDEO_PREVIEW_PATTERN.test(name ?? '') ||
        VIDEO_PREVIEW_PATTERN.test(url ?? '') ||
        normalizedMeta === 'video' ||
        normalizedMeta.startsWith('video/')
    );
};
const isImagePreview = (name?: string, url?: string, metaText?: string) => {
    const normalizedMeta = metaText?.toLowerCase() ?? '';
    return (
        IMAGE_PREVIEW_PATTERN.test(name ?? '') ||
        IMAGE_PREVIEW_PATTERN.test(url ?? '') ||
        normalizedMeta === 'image' ||
        normalizedMeta.startsWith('image/') ||
        ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(normalizedMeta)
    );
};

const getPreviewType = (
    variant: DashedDropzoneUploaderVariant,
    name?: string,
    url?: string,
    metaText?: string
): PreviewImage['type'] | null => {
    if (!url) return null;

    if (isImagePreview(undefined, url, metaText)) return 'image';
    if (isVideoPreview(undefined, url, metaText)) return 'video';
    if (isVideoPreview(name)) return 'video';
    if (variant === 'image' || isImagePreview(name)) return 'image';

    return null;
};

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

const formatDateText = (value: unknown) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        const year = value.getFullYear();
        const month = `${value.getMonth() + 1}`.padStart(2, '0');
        const day = `${value.getDate()}`.padStart(2, '0');
        return `${year}.${month}.${day}`;
    }

    if (typeof value !== 'string' && typeof value !== 'number') return undefined;

    const rawValue = `${value}`.trim();
    if (!rawValue) return undefined;

    const dateLikeMatch = rawValue.match(/^(\d{4})[-./](\d{1,2})[-./](\d{1,2})/);
    if (dateLikeMatch) {
        const year = dateLikeMatch[1] ?? '';
        const month = dateLikeMatch[2] ?? '';
        const day = dateLikeMatch[3] ?? '';
        if (year && month && day) return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
    }

    const parsedDate = new Date(rawValue);
    if (Number.isNaN(parsedDate.getTime())) return undefined;

    const year = parsedDate.getFullYear();
    const month = `${parsedDate.getMonth() + 1}`.padStart(2, '0');
    const day = `${parsedDate.getDate()}`.padStart(2, '0');
    return `${year}.${month}.${day}`;
};

const formatFileSizeText = (value: unknown) => {
    if (typeof value === 'string') {
        const trimmedValue = value.trim();
        if (!trimmedValue) return undefined;
        const numericValue = Number(trimmedValue);
        if (Number.isFinite(numericValue)) return formatFileSizeText(numericValue);
        return trimmedValue.replace(/\s+/g, '');
    }

    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return undefined;

    const units = ['B', 'KB', 'MB', 'GB'];
    let size = value;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }

    const fixedSize = size >= 10 || unitIndex === 0 ? Math.round(size).toString() : size.toFixed(1);
    return `${fixedSize}${units[unitIndex] ?? ''}`;
};

const getDefaultItemDateText = (item: object) => {
    const record = toRecord(item);
    return formatDateText(
        record.createdAt ??
            record.created_at ??
            record.createdDate ??
            record.uploadedAt ??
            record.uploaded_at ??
            record.updatedAt ??
            record.updated_at
    );
};

const getDefaultItemSizeText = (item: object) => {
    const record = toRecord(item);
    return formatFileSizeText(
        record.fileSize ?? record.fileSizeBytes ?? record.size ?? record.bytes ?? record.contentLength
    );
};

const FileThumbnail = ({
    name,
    url,
    previewType,
}: {
    name: string;
    url?: string;
    previewType: PreviewImage['type'] | null;
}) => (
    <span className={styles.FileThumbnail} data-preview-type={previewType ?? 'file'}>
        {url && previewType === 'image' ? (
            <img src={url} alt="" />
        ) : url && previewType === 'video' ? (
            <>
                <video src={url} preload="metadata" muted playsInline aria-label={name} />
                <span className={styles.FileThumbnailVideoBadge} aria-hidden="true">
                    <FiPlayCircle size={18} />
                </span>
            </>
        ) : (
            <FiFile size={18} />
        )}
    </span>
);

const ReadOnlyPreviewCloseButton = ({ onClose }: { onClose: () => void }) => (
    <button
        type="button"
        className={styles.ReadOnlyPreviewClose}
        aria-label="미리보기 닫기"
        onClick={(event) => {
            event.stopPropagation();
            onClose();
        }}
    >
        <IoIosCloseCircle size={28} />
    </button>
);

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
        <div className={styles.ReadOnlyPreviewFrame}>
            <ReadOnlyPreviewCloseButton onClose={onClose} />
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
        </div>
    );
};

const ReadOnlyVideoPreview = ({ preview, onClose }: { preview: PreviewImage; onClose: () => void }) => (
    <div className={styles.ReadOnlyPreviewFrame}>
        <ReadOnlyPreviewCloseButton onClose={onClose} />
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
    getItemDateText = getDefaultItemDateText,
    getItemSizeText = getDefaultItemSizeText,
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
                dateText: getItemDateText(item, index),
                sizeText: getItemSizeText(item, index),
            })),
        [getItemDateText, getItemKey, getItemMetaText, getItemName, getItemSizeText, getItemUrl, value]
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

    const openPreview = (
        item: TItem,
        index: number,
        name: string,
        url: string,
        type: PreviewImage['type'] | null
    ) => {
        if (!url || !type) return;

        onItemClick?.(item, index);
        setPreview({
            name,
            url,
            type,
        });
    };

    const previewModal = (
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
    );

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
                                const previewType = getPreviewType(variant, image.name, image.url, image.metaText);
                                const isVideo = previewType === 'video';

                                return (
                                    <div key={image.key} className={styles.ReadOnlyImageItem}>
                                        <div className={styles.ReadOnlyImageThumbWrap}>
                                            <button
                                                type="button"
                                                className={styles.ReadOnlyImageThumbButton}
                                                disabled={!image.url}
                                                onClick={() => {
                                                    if (!image.url) return;
                                                    openPreview(image.item, image.index, image.name, image.url, previewType);
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

                        {previewModal}
                    </>
                ) : null}

                {variant === 'file' && visibleReadOnlyItems.length > 0 ? (
                    <div className={styles.ReadOnlyFileList}>
                        {visibleReadOnlyItems.map((file) => {
                            const previewType = getPreviewType(variant, file.name, file.url, file.metaText);
                            const canPreview = Boolean(file.url && previewType);
                            const clickable = canPreview || Boolean(onItemClick);
                            const fileSummary = (
                                <>
                                    <FileThumbnail name={file.name} url={file.url} previewType={previewType} />
                                    <span className={styles.FileName} title={file.name}>
                                        {file.name}
                                    </span>
                                </>
                            );

                            return (
                                <div key={file.key} className={styles.FileItem}>
                                    {clickable ? (
                                        <button
                                            type="button"
                                            className={styles.FilePrimaryButton}
                                            onClick={() => {
                                                if (canPreview) {
                                                    openPreview(file.item, file.index, file.name, file.url, previewType);
                                                    return;
                                                }
                                                onItemClick?.(file.item, file.index);
                                            }}
                                        >
                                            {fileSummary}
                                        </button>
                                    ) : (
                                        <div className={styles.FilePrimaryButton}>{fileSummary}</div>
                                    )}
                                    {file.dateText || file.sizeText ? (
                                        <div className={styles.FileItemMetaGroup}>
                                            {file.dateText ? <span>{file.dateText}</span> : null}
                                            {file.sizeText ? <span>{file.sizeText}</span> : null}
                                        </div>
                                    ) : null}
                                    <button
                                        type="button"
                                        className={styles.FileDownloadIconButton}
                                        aria-label={`${file.name} 다운로드`}
                                        disabled={!file.url}
                                        onClick={() => {
                                            onItemClick?.(file.item, file.index);
                                            void downloadAttachment(file.url, file.name);
                                        }}
                                    >
                                        <FiDownload size={20} />
                                    </button>
                                </div>
                            );
                        })}
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
                        const metaText = getItemMetaText(item, index);
                        const previewType = getPreviewType(variant, name, url, metaText);
                        const isVideo = previewType === 'video';
                        const canPreview = Boolean(url && previewType);

                        return (
                            <div key={getItemKey(item, index)} className={styles.ImageItem}>
                                <div className={styles.ImageThumb}>
                                    <button
                                        type="button"
                                        className={styles.ImageThumbPreviewButton}
                                        disabled={!canPreview}
                                        onClick={() => openPreview(item, index, name, url ?? '', previewType)}
                                    >
                                        {url ? (
                                            isVideo ? (
                                                <video src={url} preload="metadata" muted playsInline />
                                            ) : (
                                                <img src={url} alt={name} />
                                            )
                                        ) : (
                                            <span>이미지</span>
                                        )}
                                    </button>
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
                                {canPreview || onItemClick ? (
                                    <button
                                        type="button"
                                        className={styles.ItemNameButton}
                                        title={name}
                                        onClick={() => {
                                            if (canPreview) {
                                                openPreview(item, index, name, url ?? '', previewType);
                                                return;
                                            }
                                            onItemClick?.(item, index);
                                        }}
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
                        const url = getItemUrl(item, index);
                        const metaText = getItemMetaText(item, index);
                        const dateText = getItemDateText(item, index);
                        const sizeText = getItemSizeText(item, index);
                        const previewType = getPreviewType(variant, name, url, metaText);
                        const canPreview = Boolean(url && previewType);
                        const clickable = canPreview || Boolean(onItemClick);
                        const fileContent = (
                            <>
                                <FileThumbnail name={name} url={url} previewType={previewType} />
                                <span className={styles.FileName} title={name}>
                                    {name}
                                </span>
                            </>
                        );

                        return (
                            <div key={getItemKey(item, index)} className={styles.FileItem}>
                                {clickable ? (
                                    <button
                                        type="button"
                                        className={styles.FilePrimaryButton}
                                        onClick={() => {
                                            if (canPreview) {
                                                openPreview(item, index, name, url ?? '', previewType);
                                                return;
                                            }
                                            onItemClick?.(item, index);
                                        }}
                                    >
                                        {fileContent}
                                    </button>
                                ) : (
                                    <div className={styles.FilePrimaryButton}>{fileContent}</div>
                                )}
                                {dateText || sizeText ? (
                                    <div className={styles.FileItemMetaGroup}>
                                        {dateText ? <span>{dateText}</span> : null}
                                        {sizeText ? <span>{sizeText}</span> : null}
                                    </div>
                                ) : null}
                                {url ? (
                                    <button
                                        type="button"
                                        className={styles.FileDownloadIconButton}
                                        aria-label={`${name} 다운로드`}
                                        onClick={() => void downloadAttachment(url, name)}
                                    >
                                        <FiDownload size={20} />
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    className={styles.RemoveFileButton}
                                    disabled={blocked}
                                    aria-label={`${name} 제거`}
                                    onClick={() => removeItem(index)}
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : null}

            {previewModal}
        </div>
    );
};

export default DashedDropzoneUploader;
