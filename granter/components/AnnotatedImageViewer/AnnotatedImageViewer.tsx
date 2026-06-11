import React from 'react';
import classNames from 'classnames';
import { FiImage, FiMaximize2, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import Button from '../Button/Button';
import Text from '../Text/Text';
import styles from './AnnotatedImageViewer.module.scss';

export type AnnotatedImageViewerRegion = {
    id: string | number;
    label?: React.ReactNode;
    x: number;
    y: number;
    width: number;
    height: number;
};

export type AnnotatedImageViewerAsset = {
    id: string | number;
    src: string;
    alt?: string;
    title?: React.ReactNode;
    originalWidth?: number | null;
    originalHeight?: number | null;
};

export type AnnotatedImageViewerProps = {
    assets?: AnnotatedImageViewerAsset[];
    selectedAssetId?: string | number | null;
    onSelectAsset?: (id: string | number) => void;
    regions?: AnnotatedImageViewerRegion[];
    selectedRegionId?: string | number | null;
    onSelectRegion?: (id: string | number) => void;
    onOpenFullView?: () => void;
    showViewActionButton?: boolean;
    displayMode?: 'canvas' | 'document';
    emptyText?: React.ReactNode;
    className?: string;
};

const IMAGE_ZOOM_MIN = 0.25;
const IMAGE_ZOOM_MAX = 2;
const IMAGE_ZOOM_STEP = 0.25;
const PAN_DRAG_THRESHOLD = 3;

const toPercent = (value: number) => `${Math.max(0, Math.min(1, Number(value) || 0)) * 100}%`;

const clampImageZoom = (value: number) => Math.max(IMAGE_ZOOM_MIN, Math.min(IMAGE_ZOOM_MAX, value));

const getRegionStyle = (region: AnnotatedImageViewerRegion) => ({
    left: toPercent(region.x),
    top: toPercent(region.y),
    width: toPercent(region.width),
    height: toPercent(region.height),
});

type PanDragState = {
    pointerId: number;
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
    moved: boolean;
};

const AnnotatedImageViewer = ({
    assets = [],
    selectedAssetId,
    onSelectAsset,
    regions = [],
    selectedRegionId,
    onSelectRegion,
    onOpenFullView,
    showViewActionButton = true,
    displayMode = 'canvas',
    emptyText = '연결된 참고 이미지가 없습니다.',
    className,
}: AnnotatedImageViewerProps) => {
    const selectedAsset =
        assets.find((asset) => String(asset.id) === String(selectedAssetId)) ?? assets[0] ?? null;
    const selectedAssetKey = selectedAsset ? String(selectedAsset.id) : '';
    const hasAssetTabs = assets.length > 1;
    const [imageZoom, setImageZoom] = React.useState(1);
    const [loadedImageSizes, setLoadedImageSizes] = React.useState<Record<string, { width: number; height: number }>>({});
    const [isPanning, setIsPanning] = React.useState(false);
    const stageRef = React.useRef<HTMLDivElement | null>(null);
    const regionButtonRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
    const panDragRef = React.useRef<PanDragState | null>(null);
    const suppressClickRef = React.useRef(false);
    const loadedImageSize = selectedAssetKey ? loadedImageSizes[selectedAssetKey] : undefined;
    const sourceImageWidth = selectedAsset?.originalWidth || loadedImageSize?.width || 0;
    const sourceImageHeight = selectedAsset?.originalHeight || loadedImageSize?.height || 0;
    const imageFrameStyle: React.CSSProperties | undefined = sourceImageWidth
        ? {
              width: `${sourceImageWidth * imageZoom}px`,
              ...(sourceImageHeight ? { height: `${sourceImageHeight * imageZoom}px` } : {}),
          }
        : undefined;
    const hasToolbar = hasAssetTabs;

    React.useEffect(() => {
        setImageZoom(1);
    }, [selectedAssetKey]);

    const setRegionButtonRef = React.useCallback(
        (regionId: string | number, node: HTMLButtonElement | null) => {
            const key = String(regionId);

            if (node) {
                regionButtonRefs.current.set(key, node);
                return;
            }

            regionButtonRefs.current.delete(key);
        },
        []
    );

    const scrollSelectedRegionIntoView = React.useCallback(
        (behavior: ScrollBehavior = 'smooth') => {
            if (selectedRegionId === null || selectedRegionId === undefined) return;

            const regionKey = String(selectedRegionId);

            window.requestAnimationFrame(() => {
                const stage = stageRef.current;
                const regionNode = regionButtonRefs.current.get(regionKey);
                if (!stage || !regionNode) return;

                if (displayMode === 'document') {
                    regionNode.scrollIntoView({
                        behavior,
                        block: 'center',
                        inline: 'center',
                    });
                    return;
                }

                const stageRect = stage.getBoundingClientRect();
                const regionRect = regionNode.getBoundingClientRect();
                const targetLeft =
                    stage.scrollLeft + regionRect.left - stageRect.left + regionRect.width / 2 - stage.clientWidth / 2;
                const targetTop =
                    stage.scrollTop + regionRect.top - stageRect.top + regionRect.height / 2 - stage.clientHeight / 2;

                stage.scrollTo({
                    left: Math.max(0, targetLeft),
                    top: Math.max(0, targetTop),
                    behavior,
                });
            });
        },
        [displayMode, selectedRegionId]
    );

    React.useEffect(() => {
        scrollSelectedRegionIntoView('smooth');
    }, [
        imageZoom,
        regions.length,
        scrollSelectedRegionIntoView,
        selectedAssetKey,
        sourceImageHeight,
        sourceImageWidth,
    ]);

    const changeImageZoom = React.useCallback((delta: number) => {
        setImageZoom((prev) => clampImageZoom(prev + delta));
    }, []);

    const handleImageStageWheel = React.useCallback(
        (event: React.WheelEvent<HTMLDivElement>) => {
            if (!selectedAsset?.src || (!event.ctrlKey && !event.metaKey)) return;

            event.preventDefault();
            event.stopPropagation();

            const stage = event.currentTarget;
            const stageRect = stage.getBoundingClientRect();
            const pointerX = event.clientX - stageRect.left;
            const pointerY = event.clientY - stageRect.top;
            const anchorX = stage.scrollLeft + pointerX;
            const anchorY = stage.scrollTop + pointerY;
            const delta = event.deltaY < 0 ? IMAGE_ZOOM_STEP : -IMAGE_ZOOM_STEP;

            setImageZoom((prev) => {
                const next = clampImageZoom(prev + delta);
                if (next === prev) return prev;

                const zoomRatio = next / prev;
                window.requestAnimationFrame(() => {
                    stage.scrollLeft = anchorX * zoomRatio - pointerX;
                    stage.scrollTop = anchorY * zoomRatio - pointerY;
                });

                return next;
            });
        },
        [selectedAsset?.src]
    );

    const handleImageLoad = React.useCallback(
        (event: React.SyntheticEvent<HTMLImageElement>) => {
            if (!selectedAssetKey) return;

            const { naturalWidth, naturalHeight } = event.currentTarget;
            if (!naturalWidth || !naturalHeight) return;

            setLoadedImageSizes((prev) => {
                const current = prev[selectedAssetKey];
                if (current?.width === naturalWidth && current?.height === naturalHeight) return prev;

                return {
                    ...prev,
                    [selectedAssetKey]: {
                        width: naturalWidth,
                        height: naturalHeight,
                    },
                };
            });
        },
        [selectedAssetKey]
    );

    const handleStagePointerDown = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            if (!selectedAsset?.src || (event.pointerType === 'mouse' && event.button !== 0)) return;

            const target = event.target;
            if (
                target instanceof HTMLElement &&
                target.closest('button, a, input, textarea, select, [role="button"]')
            ) {
                return;
            }

            const stage = event.currentTarget;
            if (stage.scrollWidth <= stage.clientWidth && stage.scrollHeight <= stage.clientHeight) return;

            panDragRef.current = {
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                scrollLeft: stage.scrollLeft,
                scrollTop: stage.scrollTop,
                moved: false,
            };
            suppressClickRef.current = false;
            stage.setPointerCapture(event.pointerId);
        },
        [selectedAsset?.src]
    );

    const handleStagePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        const drag = panDragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        const dx = event.clientX - drag.startX;
        const dy = event.clientY - drag.startY;
        const hasMoved = Math.abs(dx) > PAN_DRAG_THRESHOLD || Math.abs(dy) > PAN_DRAG_THRESHOLD;

        if (hasMoved) {
            drag.moved = true;
            suppressClickRef.current = true;
            setIsPanning(true);
        }

        if (!drag.moved) return;

        event.preventDefault();
        event.currentTarget.scrollLeft = drag.scrollLeft - dx;
        event.currentTarget.scrollTop = drag.scrollTop - dy;
    }, []);

    const stopStagePan = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        const drag = panDragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        panDragRef.current = null;
        setIsPanning(false);
    }, []);

    const handleStageClickCapture = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        if (!suppressClickRef.current) return;

        suppressClickRef.current = false;
        event.preventDefault();
        event.stopPropagation();
    }, []);

    return (
        <section className={classNames(styles.Root, className)} data-display-mode={displayMode}>
            {hasToolbar ? (
                <div className={styles.Header}>
                    {hasAssetTabs ? (
                        <div className={styles.AssetTabs}>
                            {assets.map((asset, index) => {
                                const active = String(asset.id) === String(selectedAsset?.id);

                                return (
                                    <Button
                                        key={String(asset.id)}
                                        variant={active ? 'soft' : 'outline'}
                                        size="sm"
                                        onClick={() => onSelectAsset?.(asset.id)}
                                    >
                                        {asset.title ?? `이미지 ${index + 1}`}
                                    </Button>
                                );
                            })}
                        </div>
                    ) : (
                        <span aria-hidden="true" />
                    )}

                </div>
            ) : null}

            <div className={styles.ViewerShell}>
                {selectedAsset?.src ? (
                    <div className={styles.FloatingOverlay}>
                        <div className={styles.FloatingControlStack}>
                            <div className={styles.ZoomControls}>
                                <button
                                    type="button"
                                    aria-label="이미지 확대"
                                    onClick={() => changeImageZoom(IMAGE_ZOOM_STEP)}
                                    disabled={imageZoom >= IMAGE_ZOOM_MAX}
                                >
                                    <FiZoomIn size={15} />
                                </button>
                                <button
                                    type="button"
                                    aria-label="이미지 배율 100%로 초기화"
                                    onClick={() => setImageZoom(1)}
                                >
                                    {Math.round(imageZoom * 100)}%
                                </button>
                                <button
                                    type="button"
                                    aria-label="이미지 축소"
                                    onClick={() => changeImageZoom(-IMAGE_ZOOM_STEP)}
                                    disabled={imageZoom <= IMAGE_ZOOM_MIN}
                                >
                                    <FiZoomOut size={15} />
                                </button>
                            </div>
                            {showViewActionButton ? (
                                <button
                                    type="button"
                                    className={styles.ResetViewButton}
                                    aria-label={onOpenFullView ? '이미지 전체 보기' : '이미지 보기 초기화'}
                                    onClick={() => {
                                        if (onOpenFullView) {
                                            onOpenFullView();
                                            return;
                                        }

                                        setImageZoom(1);
                                    }}
                                >
                                    <FiMaximize2 size={16} />
                                </button>
                            ) : null}
                        </div>
                    </div>
                ) : null}

                <div
                    ref={stageRef}
                    className={styles.Stage}
                    data-panning={isPanning ? 'true' : 'false'}
                    onWheel={handleImageStageWheel}
                    onPointerDown={handleStagePointerDown}
                    onPointerMove={handleStagePointerMove}
                    onPointerUp={stopStagePan}
                    onPointerCancel={stopStagePan}
                    onClickCapture={handleStageClickCapture}
                >
                    {selectedAsset?.src ? (
                        <div className={styles.ImageFrame} style={imageFrameStyle}>
                            <img
                                src={selectedAsset.src}
                                alt={selectedAsset.alt ?? '참고 이미지'}
                                onLoad={handleImageLoad}
                                draggable={false}
                            />
                            {regions.map((region, index) => {
                                const active = String(region.id) === String(selectedRegionId);

                                return (
                                    <button
                                        ref={(node) => setRegionButtonRef(region.id, node)}
                                        key={String(region.id)}
                                        type="button"
                                        className={styles.RegionBox}
                                        style={getRegionStyle(region)}
                                        data-active={active ? 'true' : 'false'}
                                        onPointerDown={(event) => event.stopPropagation()}
                                        onClick={() => onSelectRegion?.(region.id)}
                                        aria-label={`${index + 1}번 영역 선택`}
                                    >
                                        <span>{index + 1}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.Empty}>
                            <FiImage size={22} />
                            <Text size="sm" tone="muted" weight="semibold">
                                {emptyText}
                            </Text>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default AnnotatedImageViewer;
