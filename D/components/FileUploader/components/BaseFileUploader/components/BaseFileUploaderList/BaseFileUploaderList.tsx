import React, { useEffect, useMemo } from 'react';
import styles from './BaseFileUploaderList.module.scss';
import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';

type PreviewItem = {
    key: string;
    name: string;
    sizeText: string;
    url?: string;
};

const BaseFileUploaderList: React.FC = () => {
    const { type, files, removeFile, getFileKey } = useFileUploader();

    const previews: PreviewItem[] = useMemo(
        () =>
            files.map((file) => {
                const key = getFileKey(file);
                const url = type === 'image' ? URL.createObjectURL(file) : undefined;

                return {
                    key,
                    name: file.name,
                    sizeText: formatBytes(file.size),
                    url,
                };
            }),
        [files, getFileKey, type]
    );

    useEffect(
        () => () => {
            previews.forEach((p) => {
                if (p.url) URL.revokeObjectURL(p.url);
            });
        },
        [previews]
    );

    if (files.length === 0) return null;

    // ✅ file도 여러 개면 여러 줄로 보여주기
    if (type === 'file') {
        return (
            <div className={styles.FileList}>
                {previews.map((p) => (
                    <div key={p.key} className={styles.FileBar}>
                        <div className={styles.FileBarLeft}>
                            <span className={styles.FileBarName}>{p.name}</span>
                            <span className={styles.FileBarSize}>{p.sizeText}</span>
                        </div>

                        <button
                            type="button"
                            className={styles.FileBarRemove}
                            onClick={() => removeFile(p.key)}
                            aria-label="remove file"
                        >
                            <span className={styles.RemoveIcon}>×</span>
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    // ✅ image는 기존 그대로
    return (
        <div className={styles.ImageList}>
            {previews.map((p) => (
                <div key={p.key} className={styles.ImageItem}>
                    <div className={styles.ImageThumb}>
                        {p.url ? <img className={styles.ImageThumbImg} src={p.url} alt={p.name} /> : null}

                        <button
                            type="button"
                            className={styles.ImageRemove}
                            onClick={() => removeFile(p.key)}
                            aria-label="remove image"
                        >
                            <span className={styles.RemoveIcon}>×</span>
                        </button>
                    </div>

                    <div className={styles.ImageCaption}>
                        <span className={styles.ImageName}>{p.name}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BaseFileUploaderList;

const formatBytes = (bytes: number) => {
    const mb = bytes / 1024 / 1024;
    if (mb >= 1) return `${mb.toFixed(0)}MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(0)}KB`;
};
