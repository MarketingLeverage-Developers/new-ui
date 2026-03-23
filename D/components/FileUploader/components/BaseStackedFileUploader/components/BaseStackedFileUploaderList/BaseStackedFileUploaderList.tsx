import React, { useMemo } from 'react';
import { RiDownload2Fill } from 'react-icons/ri';
import { FaCheck } from 'react-icons/fa';
import styles from './BaseStackedFileUploaderList.module.scss';
import { useFileUploader } from '../../../../FileUploader';
import { Common } from '../../../../../../../C/Common';
import type { ServerImage } from '@/shared/types/common/model';
import VideoDefaultImage from '../../../../../../../shared/assets/components/C/components/Image/video-default.svg';
import Modal, { useModal } from '../../../../../../../shared/headless/Modal/Modal'; // ✅ 추가
import Portal from '../../../../../../../shared/headless/Portal/Portal'; // ✅ 추가
import { isMp4Preview, resolveMediaUrl, useVideoThumbnailMap } from './videoPreview';

type FileType = 'IMAGE' | 'ZIP' | 'VIDEO' | 'ETC';
const MIN_PREVIEW_ZOOM = 1;
const MAX_PREVIEW_ZOOM = 20;
const PREVIEW_ZOOM_SENSITIVITY = 0.00045;

const getNextPreviewZoom = (currentZoom: number, deltaY: number) =>
    Math.min(MAX_PREVIEW_ZOOM, Math.max(MIN_PREVIEW_ZOOM, currentZoom * Math.exp(deltaY * -PREVIEW_ZOOM_SENSITIVITY)));

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

const ImagePreviewContent = ({
    src,
    name,
    prefix,
    fallbackSrc,
}: {
    src: string;
    name: string;
    prefix?: string;
    fallbackSrc?: string;
}) => {
    const { closeModal } = useModal();
    const [zoom, setZoom] = React.useState(MIN_PREVIEW_ZOOM);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const isZoomedIn = zoom > 1.001;

    React.useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (e.ctrlKey) {
                e.preventDefault();
                setZoom((prev) => getNextPreviewZoom(prev, e.deltaY));
            }
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    return (
        <div
            ref={scrollRef}
            className={styles.ImagePreviewViewport}
            style={{
                overflowX: isZoomedIn ? 'auto' : 'hidden',
                overflowY: isZoomedIn ? 'auto' : 'hidden',
            }}
            onClick={() => closeModal()}
        >
            <div
                className={styles.ImagePreviewCanvas}
                style={{
                    width: `${zoom * 100}%`,
                    height: `${zoom * 100}%`,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Common.Image
                    className={styles.ImageModalImage}
                    src={src}
                    prefix={prefix}
                    fallbackSrc={fallbackSrc}
                    alt={name}
                    width="100%"
                    height="100%"
                    fit="contain"
                    block
                    style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                    }}
                />
            </div>
        </div>
    );
};

const VideoPreviewContent = ({ src, name }: { src: string; name: string }) => {
    const { closeModal } = useModal();

    return (
        <div className={styles.VideoPreviewViewport} onClick={() => closeModal()}>
            <div className={styles.VideoPreviewCanvas} onClick={(e) => e.stopPropagation()}>
                <video className={styles.VideoModalPlayer} src={src} controls autoPlay playsInline muted aria-label={name} />
            </div>
        </div>
    );
};

export type BaseStackedFileUploaderListProps = {
    onSelect?: (item: ServerImage) => void;
    selectedImageUUID?: string;
};

const BaseStackedFileUploaderList: React.FC<BaseStackedFileUploaderListProps> = ({ onSelect, selectedImageUUID }) => {
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

    const videoPreviewTargets = useMemo(
        () =>
            previews.flatMap((preview) =>
                preview.kind === 'image' && isMp4Preview(preview.name, preview.url)
                    ? [{ key: preview.key, name: preview.name, url: preview.url }]
                    : []
            ),
        [previews]
    );
    const videoThumbnailMap = useVideoThumbnailMap(videoPreviewTargets, apiPrefix, apiOrigin);

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
                                <div className={styles.FileBarNameWrap}>
                                    <span className={styles.FileBarName} title={p.name}>
                                        {p.name}
                                    </span>
                                </div>
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

    return (
        <div className={styles.ImageList}>
            {previews.map((p) => {
                if (p.kind !== 'image') return null;

                const downloadUrl = resolveMediaUrl(p.url, apiPrefix, apiOrigin);
                const isSelected = Boolean(selectedImageUUID) && p.source.imageUUID === selectedImageUUID;
                const isVideoPreview = isMp4Preview(p.name, p.url);
                const fallbackSrc = isVideoPreview ? VideoDefaultImage : undefined;
                const videoThumbnail = videoThumbnailMap[p.key];
                const previewSrc =
                    isVideoPreview && videoThumbnail?.sourceUrl === downloadUrl ? videoThumbnail.thumbnailUrl || p.url : p.url;

                // ✅ 클릭 핸들러 로직 분기: 선택 모드 vs 모달 열기 모드
                // onSelect가 있으면 선택(Select), 없으면 모달 Trigger로 동작해야 함.
                // 하지만 Modal 구조상 Trigger 안에 감싸야 하므로 조건부 렌더링 필요

                const thumbnailContent = (
                    <div className={styles.ImageThumb}>
                        <Common.Image
                            className={styles.ImageThumbImg}
                            src={previewSrc}
                            prefix={apiPrefix}
                            fallbackSrc={fallbackSrc}
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
                                    e.stopPropagation(); // 모달/선택 트리거 방지
                                    handleRemove(p.key);
                                }}
                                aria-label="remove image"
                            >
                                <span className={styles.RemoveIcon}>×</span>
                            </button>
                        ) : null}
                    </div>
                );

                return (
                    <div key={p.key} className={styles.ImageItem}>
                        {/* ✅ onSelect가 있으면: 그냥 div로 감싸서 클릭 시 선택
                            ✅ onSelect가 없으면: Modal.Trigger로 감싸서 클릭 시 확대
                        */}
                        {onSelect ? (
                            <div
                                className={`${styles.ImageThumbWrapper} ${isSelected ? styles.ImageThumbSelected : ''}`}
                                onClick={() => onSelect(p.source)}
                                style={{ cursor: 'pointer' }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onSelect(p.source);
                                    }
                                }}
                            >
                                {thumbnailContent}
                            </div>
                        ) : (
                            <Modal>
                                <Modal.Trigger className={styles.ImageTrigger}>{thumbnailContent}</Modal.Trigger>
                                <Portal>
                                    <Modal.Backdrop className={styles.ImageModalBackdrop} />
                                    <Modal.Content className={styles.ImageModalContent}>
                                        {isVideoPreview ? (
                                            <VideoPreviewContent src={downloadUrl} name={p.name} />
                                        ) : (
                                            <ImagePreviewContent
                                                src={previewSrc}
                                                prefix={apiPrefix}
                                                name={p.name}
                                                fallbackSrc={fallbackSrc}
                                            />
                                        )}
                                    </Modal.Content>
                                </Portal>
                            </Modal>
                        )}

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
// import React, { useMemo } from 'react';
// import { RiDownload2Fill } from 'react-icons/ri';
// import { FaCheck } from 'react-icons/fa';
// import styles from './BaseStackedFileUploaderList.module.scss';
// import { useFileUploader } from '../../../../FileUploader';
// import { Common } from '../../../../../../../C/Common';
// import type { ServerImage } from '../../../../../../../shared/types/common/model';

// type FileType = 'IMAGE' | 'ZIP' | 'VIDEO' | 'ETC';

// type PreviewItem =
//     | {
//           kind: 'image';
//           key: string;
//           name: string;
//           url: string;
//           source: ServerImage;
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

// export type BaseStackedFileUploaderListProps = {
//     onSelect?: (item: ServerImage) => void;
//     selectedImageUUID?: string;
// };

// const BaseStackedFileUploaderList: React.FC<BaseStackedFileUploaderListProps> = ({
//     onSelect,
//     selectedImageUUID,
// }) => {
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
//                     source: it,
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
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             handleRemove(p.key);
//                                         }}
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
//                 const isSelected = Boolean(selectedImageUUID) && p.source.imageUUID === selectedImageUUID;

//                 return (
//                     <div key={p.key} className={styles.ImageItem}>
//                         <div
//                             className={`${styles.ImageThumb} ${isSelected ? styles.ImageThumbSelected : ''}`}
//                             onClick={onSelect ? () => onSelect(p.source) : undefined}
//                             style={onSelect ? { cursor: 'pointer' } : undefined}
//                             role={onSelect ? 'button' : undefined}
//                             tabIndex={onSelect ? 0 : undefined}
//                             onKeyDown={
//                                 onSelect
//                                     ? (e) => {
//                                           if (e.key === 'Enter' || e.key === ' ') {
//                                               e.preventDefault();
//                                               onSelect(p.source);
//                                           }
//                                       }
//                                     : undefined
//                             }
//                         >
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

//                             {isSelected ? (
//                                 <div className={styles.ImageSelectedOverlay} aria-hidden="true">
//                                     <FaCheck />
//                                 </div>
//                             ) : null}

//                             <div className={styles.ImageDim} />

//                             <div className={styles.ImageActions}>
//                                 <a
//                                     className={styles.ImageDownload}
//                                     href={downloadUrl}
//                                     download
//                                     target="_blank"
//                                     rel="noreferrer"
//                                     onClick={(e) => e.stopPropagation()}
//                                     aria-label={`download ${p.name}`}
//                                 >
//                                     <RiDownload2Fill />
//                                 </a>
//                             </div>

//                             {showRemove ? (
//                                 <button
//                                     type="button"
//                                     className={styles.ImageRemove}
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleRemove(p.key);
//                                     }}
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

// export default BaseStackedFileUploaderList;
