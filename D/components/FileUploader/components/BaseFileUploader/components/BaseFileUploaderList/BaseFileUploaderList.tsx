import React, { useMemo } from 'react';
import { RiDownload2Fill } from 'react-icons/ri';
import styles from './BaseFileUploaderList.module.scss';
import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';
import { Common } from '@/shared/primitives/C/Common';
import Modal, { useModal } from '@/shared/headless/Modal/Modal';
import Portal from '@/shared/headless/Portal/Portal';

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

const ImagePreviewContent = ({ src, name, prefix }: { src: string; name: string; prefix?: string }) => {
    const { closeModal } = useModal();
    const [zoom, setZoom] = React.useState(1);
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY * -0.001;
                setZoom((prev) => Math.min(Math.max(prev + delta, 0.1), 5));
            }
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    return (
        <div
            ref={scrollRef}
            style={{
                width: '100%',
                height: '100%',
                padding: '0 10%',
                boxSizing: 'border-box',
                overflowY: 'auto',
                overflowX: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
            }}
            onClick={() => closeModal()}
        >
            <div
                style={{
                    width: `${zoom * 100}%`,
                    transition: 'width 0.1s ease-out',
                    flexShrink: 0,
                    margin: 'auto 0',
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'default',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Common.Image
                    className={styles.ImageModalImage}
                    src={src}
                    prefix={prefix}
                    alt={name}
                    width="100%"
                    block
                    style={{
                        height: 'auto',
                        maxHeight: 'none',
                        maxWidth: 'none',
                    }}
                />
            </div>
        </div>
    );
};

const BaseFileUploaderList: React.FC = () => {
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

                return (
                    <div key={p.key} className={styles.ImageItem}>
                        <Modal>
                            <Modal.Trigger className={styles.ImageTrigger}>
                                <div className={styles.ImageThumb}>
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

                                    <div className={styles.ImageDim} />
                                    <div className={styles.ImageActions}>
                                        <a
                                            className={styles.ImageDownload}
                                            href={downloadUrl}
                                            download
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`download ${p.name}`}
                                            onClick={(event) => event.stopPropagation()}
                                        >
                                            <RiDownload2Fill />
                                        </a>
                                    </div>

                                    {showRemove ? (
                                        <button
                                            type="button"
                                            className={styles.ImageRemove}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleRemove(p.key);
                                            }}
                                            aria-label="remove image"
                                        >
                                            <span className={styles.RemoveIcon}>×</span>
                                        </button>
                                    ) : null}
                                </div>
                            </Modal.Trigger>
                            <Portal>
                                <Modal.Backdrop className={styles.ImageModalBackdrop} />
                                <Modal.Content
                                    className={styles.ImageModalContent}
                                    style={{ overflow: 'hidden', display: 'block' }}
                                >
                                    <ImagePreviewContent src={p.url} prefix={apiPrefix} name={p.name} />
                                </Modal.Content>
                            </Portal>
                        </Modal>

                        <div className={styles.ImageCaption}>
                            <span className={styles.ImageName}>{p.name}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BaseFileUploaderList;

// import React, { useMemo } from 'react';
// import { RiDownload2Fill } from 'react-icons/ri';
// import styles from './BaseFileUploaderList.module.scss';
// import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';
// import { Common } from '@/shared/primitives/C/Common';

// type FileType = 'IMAGE' | 'ZIP' | 'VIDEO' | 'ETC';

// type PreviewItem =
//     | {
//           kind: 'image';
//           key: string;
//           name: string;
//           url: string;
//       }
//     | {
//           kind: 'file';
//           key: string;
//           name: string;
//           metaText?: string;
//           url?: string;
//       };

// const isFileType = (value: unknown): value is FileType =>
//     value === 'IMAGE' || value === 'ZIP' || value === 'VIDEO' || value === 'ETC';

// const BaseFileUploaderList: React.FC = () => {
//     const { type, serverItems, removeItem, getItemKey, showRemove } = useFileUploader();
//     const apiPrefix = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : undefined;
//     const apiOrigin = import.meta.env.VITE_API_URL;

//     const previews = useMemo<PreviewItem[]>(() => {
//         if (type === 'image') {
//             const items = (serverItems ?? []) as Array<{
//                 imageUUID: string;
//                 imageName: string;
//                 imageUrl: string;
//             }>;

//             const mapped: PreviewItem[] = items
//                 .filter((it) => Boolean(it?.imageUUID) && Boolean(it?.imageUrl))
//                 .map((it) => ({
//                     kind: 'image' as const,
//                     key: getItemKey(it),
//                     name: it.imageName || 'image',
//                     url: it.imageUrl,
//                 }));

//             return mapped;
//         }

//         /**
//          * ✅ 핵심:
//          * getItemKey는 (ServerImage | ServerFile)을 받는데
//          * 여기서 fileType이 string이라 그대로 넘기면 타입 에러가 남.
//          *
//          * -> fileType을 FileType으로 "정제"해서 넘기면 해결됨
//          */
//         const items = (serverItems ?? []) as Array<{
//             fileUUID: string;
//             originalFileName: string;
//             storedFileName: string;
//             filePath: string;
//             fileType: unknown;
//         }>;

//         const mapped: PreviewItem[] = items
//             .filter((it) => Boolean(it?.fileUUID))
//             .map((it) => {
//                 const safeFileType: FileType = isFileType(it.fileType) ? it.fileType : 'ETC';

//                 return {
//                     kind: 'file' as const,
//                     key: getItemKey({
//                         fileUUID: it.fileUUID,
//                         originalFileName: it.originalFileName,
//                         storedFileName: it.storedFileName,
//                         filePath: it.filePath,
//                         fileType: safeFileType,
//                     }),
//                     name: it.originalFileName || it.storedFileName || 'file',
//                     metaText: safeFileType ? String(safeFileType) : undefined,
//                     url: it.filePath || undefined,
//                 };
//             });

//         return mapped;
//     }, [getItemKey, serverItems, type]);

//     if (previews.length === 0) return null;

//     const handleRemove = (key: string) => {
//         removeItem(key);
//     };

//     if (type === 'file') {
//         return (
//             <div className={styles.FileList}>
//                 {previews.map((p) => {
//                     if (p.kind !== 'file') return null;

//                     return (
//                         <div key={p.key} className={styles.FileBar}>
//                             <div className={styles.FileBarLeft}>
//                                 <span className={styles.FileBarName}>{p.name}</span>
//                                 {p.metaText ? <span className={styles.FileBarSize}>{p.metaText}</span> : null}
//                             </div>

//                             <div className={styles.FileBarRight}>
//                                 {p.url ? (
//                                     <a className={styles.FileBarLink} href={p.url} target="_blank" rel="noreferrer">
//                                         보기
//                                     </a>
//                                 ) : null}

//                                 {showRemove ? (
//                                     <button
//                                         type="button"
//                                         className={styles.FileBarRemove}
//                                         onClick={() => handleRemove(p.key)}
//                                         aria-label="remove file"
//                                     >
//                                         <span className={styles.RemoveIcon}>×</span>
//                                     </button>
//                                 ) : null}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         );
//     }

//     const resolveDownloadUrl = (url: string) => {
//         if (/^https?:\/\//i.test(url)) return url;
//         if (url.startsWith('/api/') && apiOrigin) return `${apiOrigin}${url}`;
//         if (apiPrefix) return `${apiPrefix}${url.startsWith('/') ? '' : '/'}${url}`;
//         return url;
//     };

//     return (
//         <div className={styles.ImageList}>
//             {previews.map((p) => {
//                 if (p.kind !== 'image') return null;

//                 const downloadUrl = resolveDownloadUrl(p.url);

//                 return (
//                     <div key={p.key} className={styles.ImageItem}>
//                         <div className={styles.ImageThumb}>
//                             <Common.Image
//                                 className={styles.ImageThumbImg}
//                                 src={p.url}
//                                 prefix={apiPrefix}
//                                 alt={p.name}
//                                 width="100%"
//                                 height="100%"
//                                 fit="cover"
//                                 block
//                             />

//                             <div className={styles.ImageDim} />
//                             <div className={styles.ImageActions}>
//                                 <a
//                                     className={styles.ImageDownload}
//                                     href={downloadUrl}
//                                     download
//                                     target="_blank"
//                                     rel="noreferrer"
//                                     aria-label={`download ${p.name}`}
//                                 >
//                                     <RiDownload2Fill />
//                                 </a>
//                             </div>

//                             {showRemove ? (
//                                 <button
//                                     type="button"
//                                     className={styles.ImageRemove}
//                                     onClick={() => handleRemove(p.key)}
//                                     aria-label="remove image"
//                                 >
//                                     <span className={styles.RemoveIcon}>×</span>
//                                 </button>
//                             ) : null}
//                         </div>

//                         <div className={styles.ImageCaption}>
//                             <span className={styles.ImageName}>{p.name}</span>
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default BaseFileUploaderList;
