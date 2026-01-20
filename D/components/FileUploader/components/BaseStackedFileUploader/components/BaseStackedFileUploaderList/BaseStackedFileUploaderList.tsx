import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import styles from './BaseStackedFileUploaderList.module.scss';
import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';

type PreviewItem =
    | {
          source: 'file';
          key: string;
          name: string;
          sizeText: string;
          url?: string;
      }
    | {
          source: 'url';
          key: string;
          name: string;
          url: string;
      };

const BaseStackedFileUploaderList: React.FC = () => {
    const { type, files, defaultUrls, removeFile, removeDefaultUrl, getFileKey, stackedListView, showRemove } =
        useFileUploader();

    const resolvedStackedListView = stackedListView ?? 'single';

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

    const previews: PreviewItem[] = useMemo(() => [...urlPreviews, ...filePreviews], [urlPreviews, filePreviews]);

    useEffect(
        () => () => {
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

    // ✅ file 타입은 stacked에서도 bar 유지
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

    const imageListClassName = classNames(styles.ImageList, {
        [styles.Single]: resolvedStackedListView === 'single',
        [styles.Grid]: resolvedStackedListView === 'grid',
    });

    return (
        <div className={imageListClassName}>
            {previews.map((p) => (
                <div
                    key={p.key}
                    className={classNames(styles.ImageItem, {
                        [styles.SingleItem]: resolvedStackedListView === 'single',
                        [styles.GridItem]: resolvedStackedListView === 'grid',
                    })}
                >
                    <div
                        className={classNames(styles.ImageThumb, {
                            [styles.SingleThumb]: resolvedStackedListView === 'single',
                            [styles.GridThumb]: resolvedStackedListView === 'grid',
                        })}
                    >
                        {'url' in p && p.url ? <img className={styles.ImageThumbImg} src={p.url} alt={p.name} /> : null}

                        {showRemove ? (
                            <button
                                type="button"
                                className={classNames(styles.ImageRemove, {
                                    [styles.SingleRemove]: resolvedStackedListView === 'single',
                                    [styles.GridRemove]: resolvedStackedListView === 'grid',
                                })}
                                onClick={() => handleRemove(p)}
                                aria-label="remove image"
                            >
                                <span className={styles.RemoveIcon}>×</span>
                            </button>
                        ) : null}
                    </div>

                    <div
                        className={classNames(styles.ImageCaption, {
                            [styles.SingleCaption]: resolvedStackedListView === 'single',
                            [styles.GridCaption]: resolvedStackedListView === 'grid',
                        })}
                    >
                        <span
                            className={classNames(styles.ImageName, {
                                [styles.SingleName]: resolvedStackedListView === 'single',
                                [styles.GridName]: resolvedStackedListView === 'grid',
                            })}
                            title={p.name}
                        >
                            {p.name}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BaseStackedFileUploaderList;

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
