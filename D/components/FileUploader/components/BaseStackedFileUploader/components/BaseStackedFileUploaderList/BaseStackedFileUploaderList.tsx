import React, { useMemo } from 'react';
import styles from './BaseStackedFileUploaderList.module.scss';
import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';

type FileType = 'IMAGE' | 'ZIP' | 'VIDEO' | 'ETC';

type PreviewItem =
    | {
          kind: 'image';
          key: string;
          name: string;
          url: string;
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

const BaseStackedFileUploaderList: React.FC = () => {
    const { type, serverItems, removeItem, getItemKey, showRemove } = useFileUploader();

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
                                        onClick={() => handleRemove(p.key)}
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

    return (
        <div className={styles.ImageList}>
            {previews.map((p) => {
                if (p.kind !== 'image') return null;

                return (
                    <div key={p.key} className={styles.ImageItem}>
                        <div className={styles.ImageThumb}>
                            <img className={styles.ImageThumbImg} src={p.url} alt={p.name} />

                            {showRemove ? (
                                <button
                                    type="button"
                                    className={styles.ImageRemove}
                                    onClick={() => handleRemove(p.key)}
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
