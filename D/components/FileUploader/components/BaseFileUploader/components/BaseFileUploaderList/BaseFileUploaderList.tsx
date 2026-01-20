import React, { useEffect, useMemo } from 'react';
import styles from './BaseFileUploaderList.module.scss';
import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';

type PreviewItem =
    | {
          source: 'file';
          key: string;
          name: string;
          sizeText: string;
          url?: string; // image면 objectURL
      }
    | {
          source: 'url';
          key: string;
          name: string;
          sizeText?: string;
          url: string; // server url
      };

const BaseFileUploaderList: React.FC = () => {
    const { type, files, defaultUrls, removeFile, removeDefaultUrl, getFileKey, showRemove } = useFileUploader();

    const filePreviews: PreviewItem[] = useMemo(
        () =>
            files.map((file) => {
                const key = getFileKey(file);
                const url = type === 'image' ? URL.createObjectURL(file) : undefined;

                return {
                    source: 'file',
                    key,
                    name: file.name,
                    sizeText: formatBytes(file.size),
                    url,
                };
            }),
        [files, getFileKey, type]
    );

    const urlPreviews: PreviewItem[] = useMemo(
        () =>
            defaultUrls.map((u) => ({
                source: 'url',
                key: `url_${u}`,
                name: extractNameFromUrl(u),
                url: u,
            })),
        [defaultUrls]
    );

    const previews: PreviewItem[] = useMemo(() => [...urlPreviews, ...filePreviews], [filePreviews, urlPreviews]);

    useEffect(
        () => () => {
            // ✅ File에서 만든 objectURL만 revoke
            filePreviews.forEach((p) => {
                if (p.source === 'file' && p.url) URL.revokeObjectURL(p.url);
            });
        },
        [filePreviews]
    );

    if (previews.length === 0) return null;

    const handleRemove = (p: PreviewItem) => {
        if (p.source === 'file') removeFile(p.key);
        else removeDefaultUrl(p.url);
    };

    // ✅ file 타입: url도 파일로 취급해서 FileBar로 보여줌
    if (type === 'file') {
        return (
            <div className={styles.FileList}>
                {previews.map((p) => (
                    <div key={p.key} className={styles.FileBar}>
                        <div className={styles.FileBarLeft}>
                            <span className={styles.FileBarName}>{p.name}</span>
                            {p.source === 'file' ? <span className={styles.FileBarSize}>{p.sizeText}</span> : null}
                        </div>

                        {showRemove ? (
                            <button
                                type="button"
                                className={styles.FileBarRemove}
                                onClick={() => handleRemove(p)}
                                aria-label="remove file"
                            >
                                <span className={styles.RemoveIcon}>×</span>
                            </button>
                        ) : null}
                    </div>
                ))}
            </div>
        );
    }

    // ✅ image 타입: url도 이미지로 렌더
    return (
        <div className={styles.ImageList}>
            {previews.map((p) => (
                <div key={p.key} className={styles.ImageItem}>
                    <div className={styles.ImageThumb}>
                        {'url' in p && p.url ? <img className={styles.ImageThumbImg} src={p.url} alt={p.name} /> : null}

                        {showRemove ? (
                            <button
                                type="button"
                                className={styles.ImageRemove}
                                onClick={() => handleRemove(p)}
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

const extractNameFromUrl = (url: string) => {
    try {
        const u = new URL(url);
        const last = u.pathname.split('/').filter(Boolean).pop();
        return last ? decodeURIComponent(last) : url;
    } catch {
        const last = url.split('?')[0].split('#')[0].split('/').filter(Boolean).pop();
        return last ?? url;
    }
};
