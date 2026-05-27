import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';
import classNames from 'classnames';
import { IoIosCloseCircle } from 'react-icons/io';
import Modal, { useModal } from '@/components/common/shared/headless/Modal/Modal';
import Portal from '@/components/common/shared/headless/Portal/Portal';
import styles from './ImagePreviewBox.module.scss';

export type ImagePreviewBoxProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    src?: string | null;
    alt?: string;
    previewAlt?: string;
    emptyText?: string;
    width?: string | number;
    height?: string | number;
    radius?: string | number;
    fit?: CSSProperties['objectFit'];
};

const MIN_PREVIEW_ZOOM = 1;
const MAX_PREVIEW_ZOOM = 20;
const PREVIEW_ZOOM_SENSITIVITY = 0.00045;
const PREVIEW_MAX_VIEWPORT_WIDTH_RATIO = 0.6;
const PREVIEW_MAX_VIEWPORT_HEIGHT_RATIO = 0.9;
const PREVIEW_MIN_MODAL_HEIGHT = 320;

const toCssUnit = (value?: string | number) => {
    if (typeof value === 'number') return `${value}px`;
    return value;
};

const getNextPreviewZoom = (currentZoom: number, deltaY: number) =>
    Math.min(
        MAX_PREVIEW_ZOOM,
        Math.max(MIN_PREVIEW_ZOOM, currentZoom * Math.exp(deltaY * -PREVIEW_ZOOM_SENSITIVITY))
    );

const getPreviewModalSize = (naturalWidth: number, naturalHeight: number) => {
    if (!naturalWidth || !naturalHeight || typeof window === 'undefined') return null;

    const maxWidth = window.innerWidth * PREVIEW_MAX_VIEWPORT_WIDTH_RATIO;
    const maxHeight = window.innerHeight * PREVIEW_MAX_VIEWPORT_HEIGHT_RATIO;
    const scale = Math.min(maxWidth / naturalWidth, maxHeight / naturalHeight, 1);
    const scaledWidth = Math.round(naturalWidth * scale);
    const scaledHeight = Math.round(naturalHeight * scale);
    const minHeight = Math.min(PREVIEW_MIN_MODAL_HEIGHT, Math.round(maxHeight));

    return {
        width: scaledWidth,
        height: Math.max(scaledHeight, minHeight),
    };
};

type ImagePreviewContentProps = {
    src: string;
    alt: string;
    viewportWidth?: number;
    viewportHeight?: number;
};

const ImagePreviewContent = ({ src, alt, viewportWidth, viewportHeight }: ImagePreviewContentProps) => {
    const { closeModal } = useModal();
    const [zoom, setZoom] = useState(MIN_PREVIEW_ZOOM);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isZoomedIn = zoom > 1.001;

    useEffect(() => {
        const element = scrollRef.current;
        if (!element) return;

        const handleWheel = (event: WheelEvent) => {
            if (!event.ctrlKey) return;
            event.preventDefault();
            setZoom((prev) => getNextPreviewZoom(prev, event.deltaY));
        };

        element.addEventListener('wheel', handleWheel, { passive: false });
        return () => {
            element.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div className={styles.PreviewFrame}>
            <button
                type="button"
                className={styles.PreviewClose}
                aria-label="이미지 닫기"
                onClick={() => closeModal()}
            >
                <IoIosCloseCircle size={28} />
            </button>
            <div
                ref={scrollRef}
                className={styles.PreviewViewport}
                style={{
                    width: viewportWidth ? `${viewportWidth}px` : 'auto',
                    height: viewportHeight ? `${viewportHeight}px` : 'auto',
                    overflowX: isZoomedIn ? 'auto' : 'hidden',
                    overflowY: isZoomedIn ? 'auto' : 'hidden',
                }}
                onClick={() => closeModal()}
            >
                <div
                    className={styles.PreviewCanvas}
                    style={{
                        width: `${zoom * 100}%`,
                        height: `${zoom * 100}%`,
                    }}
                    onClick={(event) => event.stopPropagation()}
                >
                    <img className={styles.PreviewImage} src={src} alt={alt} />
                </div>
            </div>
        </div>
    );
};

const ImagePreviewBox = ({
    src,
    alt = '이미지',
    previewAlt,
    emptyText = '이미지 없음',
    width = '100%',
    height = '100%',
    radius = 8,
    fit = 'cover',
    className,
    style,
    onClick,
    ...props
}: ImagePreviewBoxProps) => {
    const [previewModalSize, setPreviewModalSize] = useState<{ width: number; height: number } | null>(null);
    const cssVariables = {
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--radius': toCssUnit(radius),
        '--object-fit': fit,
    } as CSSProperties;

    useEffect(() => {
        if (!src || typeof window === 'undefined') {
            setPreviewModalSize(null);
            return;
        }

        let cancelled = false;
        let naturalWidth = 0;
        let naturalHeight = 0;

        const updatePreviewSize = () => {
            if (!naturalWidth || !naturalHeight || cancelled) return;
            setPreviewModalSize(getPreviewModalSize(naturalWidth, naturalHeight));
        };

        const previewImage = new window.Image();
        previewImage.onload = () => {
            naturalWidth = previewImage.naturalWidth;
            naturalHeight = previewImage.naturalHeight;
            updatePreviewSize();
        };
        previewImage.src = src;

        window.addEventListener('resize', updatePreviewSize);

        return () => {
            cancelled = true;
            window.removeEventListener('resize', updatePreviewSize);
        };
    }, [src]);

    if (!src) {
        return (
            <div
                {...props}
                className={classNames(styles.ImagePreviewBox, styles.Empty, className)}
                style={{ ...cssVariables, ...style }}
            >
                <span>{emptyText}</span>
            </div>
        );
    }

    return (
        <Modal>
            <Modal.Trigger className={styles.Trigger} style={cssVariables}>
                <div
                    {...props}
                    className={classNames(styles.ImagePreviewBox, className)}
                    style={{ ...cssVariables, ...style }}
                    onClick={onClick}
                >
                    <img src={src} alt={alt} />
                </div>
            </Modal.Trigger>

            <Portal>
                <Modal.Backdrop className={styles.PreviewBackdrop} />
                <Modal.Content
                    className={styles.PreviewContent}
                    width={previewModalSize?.width ?? 'auto'}
                    height={previewModalSize?.height ?? 'auto'}
                    maxHeight="90vh"
                >
                    <ImagePreviewContent
                        src={src}
                        alt={previewAlt ?? alt}
                        viewportWidth={previewModalSize?.width}
                        viewportHeight={previewModalSize?.height}
                    />
                </Modal.Content>
            </Portal>
        </Modal>
    );
};

export default ImagePreviewBox;
