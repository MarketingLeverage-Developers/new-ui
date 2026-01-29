import React, { useMemo } from 'react';
import { RiDownload2Fill } from 'react-icons/ri';
import { FaCheck } from 'react-icons/fa';
import styles from './BaseStackedFileUploaderList.module.scss';
import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';
import { Common } from '@/shared/primitives/C/Common';
import type { ServerImage } from '@/shared/types/common/model';

type FileType = 'IMAGE' | 'ZIP' | 'VIDEO' | 'ETC';

type PreviewItem =
    | {
          kind: 'image';
          key: string;
          name: string;
          url: string;
          source: ServerImage;
      }
    | {
          kind: 'file';
          key: string;
          name: string;
          metaText?: string;
          url?: string;
      };

const isFileType = (value: unknown): value is FileType =>
    value === 'IMAGE' || value === 'ZIP' || value === 'VIDEO' || value === 'ETC';

export type BaseStackedFileUploaderListProps = {
    onSelect?: (item: ServerImage) => void;
    selectedImageUUID?: string;
};

const BaseStackedFileUploaderList: React.FC<BaseStackedFileUploaderListProps> = ({
    onSelect,
    selectedImageUUID,
}) => {
    const { type, serverItems, removeItem, getItemKey, showRemove } = useFileUploader();
    const apiPrefix = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : undefined;
    const apiOrigin = import.meta.env.VITE_API_URL;

    const previews = useMemo<PreviewItem[]>(() => {
        if (type === 'image') {
            const items = (serverItems ?? []) as Array<{
                imageUUID: string;
                imageName: string;
                imageUrl: string;
            }>;

            const mapped: PreviewItem[] = items
                .filter((it) => Boolean(it?.imageUUID) && Boolean(it?.imageUrl))
                .map((it) => ({
                    kind: 'image' as const,
                    key: getItemKey(it),
                    name: it.imageName || 'image',
                    url: it.imageUrl,
                    source: it,
                }));

            return mapped;
        }

        /**
         * ✅ 핵심:
         * getItemKey는 (ServerImage | ServerFile)을 받는데
         * 여기서 fileType이 string이라 그대로 넘기면 타입 에러가 남.
         *
         * -> fileType을 FileType으로 "정제"해서 넘기면 해결됨
         */
        const items = (serverItems ?? []) as Array<{
            fileUUID: string;
            originalFileName: string;
            storedFileName: string;
            filePath: string;
            fileType: unknown;
        }>;

        const mapped: PreviewItem[] = items
            .filter((it) => Boolean(it?.fileUUID))
            .map((it) => {
                const safeFileType: FileType = isFileType(it.fileType) ? it.fileType : 'ETC';

                return {
                    kind: 'file' as const,
                    key: getItemKey({
                        fileUUID: it.fileUUID,
                        originalFileName: it.originalFileName,
                        storedFileName: it.storedFileName,
                        filePath: it.filePath,
                        fileType: safeFileType,
                    }),
                    name: it.originalFileName || it.storedFileName || 'file',
                    metaText: safeFileType ? String(safeFileType) : undefined,
                    url: it.filePath || undefined,
                };
            });

        return mapped;
    }, [getItemKey, serverItems, type]);

    if (previews.length === 0) return null;

    const handleRemove = (key: string) => {
        removeItem(key);
    };

    if (type === 'file') {
        return (
            <div className={styles.FileList}>
                {previews.map((p) => {
                    if (p.kind !== 'file') return null;

                    return (
                        <div key={p.key} className={styles.FileBar}>
                            <div className={styles.FileBarLeft}>
                                <span className={styles.FileBarName}>{p.name}</span>
                                {p.metaText ? <span className={styles.FileBarSize}>{p.metaText}</span> : null}
                            </div>

                            <div className={styles.FileBarRight}>
                                {p.url ? (
                                    <a className={styles.FileBarLink} href={p.url} target="_blank" rel="noreferrer">
                                        보기
                                    </a>
                                ) : null}

                                {showRemove ? (
                                    <button
                                        type="button"
                                        className={styles.FileBarRemove}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(p.key);
                                        }}
                                        aria-label="remove file"
                                    >
                                        <span className={styles.RemoveIcon}>×</span>
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    const resolveDownloadUrl = (url: string) => {
        if (/^https?:\/\//i.test(url)) return url;
        if (url.startsWith('/api/') && apiOrigin) return `${apiOrigin}${url}`;
        if (apiPrefix) return `${apiPrefix}${url.startsWith('/') ? '' : '/'}${url}`;
        return url;
    };

    return (
        <div className={styles.ImageList}>
            {previews.map((p) => {
                if (p.kind !== 'image') return null;

                const downloadUrl = resolveDownloadUrl(p.url);
                const isSelected = Boolean(selectedImageUUID) && p.source.imageUUID === selectedImageUUID;

                return (
                    <div key={p.key} className={styles.ImageItem}>
                        <div
                            className={`${styles.ImageThumb} ${isSelected ? styles.ImageThumbSelected : ''}`}
                            onClick={onSelect ? () => onSelect(p.source) : undefined}
                            style={onSelect ? { cursor: 'pointer' } : undefined}
                            role={onSelect ? 'button' : undefined}
                            tabIndex={onSelect ? 0 : undefined}
                            onKeyDown={
                                onSelect
                                    ? (e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                              e.preventDefault();
                                              onSelect(p.source);
                                          }
                                      }
                                    : undefined
                            }
                        >
                            <Common.Image
                                className={styles.ImageThumbImg}
                                src={p.url}
                                prefix={apiPrefix}
                                alt={p.name}
                                width="100%"
                                height="100%"
                                fit="cover"
                                block
                            />

                            {isSelected ? (
                                <div className={styles.ImageSelectedOverlay} aria-hidden="true">
                                    <FaCheck />
                                </div>
                            ) : null}

                            <div className={styles.ImageDim} />

                            <div className={styles.ImageActions}>
                                <a
                                    className={styles.ImageDownload}
                                    href={downloadUrl}
                                    download
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`download ${p.name}`}
                                >
                                    <RiDownload2Fill />
                                </a>
                            </div>

                            {showRemove ? (
                                <button
                                    type="button"
                                    className={styles.ImageRemove}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(p.key);
                                    }}
                                    aria-label="remove image"
                                >
                                    <span className={styles.RemoveIcon}>×</span>
                                </button>
                            ) : null}
                        </div>

                        <div className={styles.ImageCaption}>
                            <span className={styles.ImageName}>{p.name}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BaseStackedFileUploaderList;
