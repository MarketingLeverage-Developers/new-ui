import React from 'react';
import classNames from 'classnames';
import { FiImage, FiMaximize2, FiTrash2, FiZoomIn, FiZoomOut } from 'react-icons/fi';
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

export type AnnotatedImageViewerRegionDraft = Pick<AnnotatedImageViewerRegion, 'x' | 'y' | 'width' | 'height'>;

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
    onCreateRegion?: (region: AnnotatedImageViewerRegionDraft) => void;
    onUpdateRegion?: (id: string | number, region: AnnotatedImageViewerRegionDraft) => void;
    onDeleteRegion?: (id: string | number) => void;
    createRegionDisabled?: boolean;
    onImageLoad?: (assetId: string | number, size: { width: number; height: number }) => void;
    onOpenFullView?: () => void;
    showAssetTabs?: boolean;
    showViewActionButton?: boolean;
    displayMode?: 'canvas' | 'document';
    emptyText?: React.ReactNode;
    className?: string;
};

const IMAGE_ZOOM_MIN = 0.25;
const IMAGE_ZOOM_MAX = 2;
const IMAGE_ZOOM_STEP = 0.25;
const PAN_DRAG_THRESHOLD = 3;
const REGION_MIN_SIZE = 0.015;

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

type CreateDragState = {
    pointerId: number;
    start: { x: number; y: number };
};

type RegionDragState = {
    pointerId: number;
    regionId: string | number;
    startClientX: number;
    startClientY: number;
    origin: AnnotatedImageViewerRegionDraft;
    moved: boolean;
};

type RegionResizeState = RegionDragState;

const AnnotatedImageViewer = ({
    assets = [],
    selectedAssetId,
    onSelectAsset,
    regions = [],
    selectedRegionId,
    onSelectRegion,
    onCreateRegion,
    onUpdateRegion,
    onDeleteRegion,
    createRegionDisabled = false,
    onImageLoad,
    onOpenFullView,
    showAssetTabs = true,
    showViewActionButton = true,
    displayMode = 'canvas',
    emptyText = '연결된 참고 이미지가 없습니다.',
    className,
}: AnnotatedImageViewerProps) => {
    const selectedAsset =
        assets.find((asset) => String(asset.id) === String(selectedAssetId)) ?? assets[0] ?? null;
    const selectedAssetKey = selectedAsset ? String(selectedAsset.id) : '';
    const hasAssetTabs = showAssetTabs && assets.length > 1;
    const [imageZoom, setImageZoom] = React.useState(1);
    const [draftRegion, setDraftRegion] = React.useState<AnnotatedImageViewerRegionDraft | null>(null);
    const [draggingRegionId, setDraggingRegionId] = React.useState<string | number | null>(null);
    const [loadedImageSizes, setLoadedImageSizes] = React.useState<Record<string, { width: number; height: number }>>({});
    const [isPanning, setIsPanning] = React.useState(false);
    const stageRef = React.useRef<HTMLDivElement | null>(null);
    const imageRef = React.useRef<HTMLImageElement | null>(null);
    const regionButtonRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());
    const panDragRef = React.useRef<PanDragState | null>(null);
    const createDragRef = React.useRef<CreateDragState | null>(null);
    const regionDragRef = React.useRef<RegionDragState | null>(null);
    const regionResizeRef = React.useRef<RegionResizeState | null>(null);
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
        setDraftRegion(null);
        createDragRef.current = null;
    }, [selectedAssetKey]);

    const setRegionButtonRef = React.useCallback(
        (regionId: string | number, node: HTMLDivElement | null) => {
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

            onImageLoad?.(selectedAssetKey, { width: naturalWidth, height: naturalHeight });

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
        [onImageLoad, selectedAssetKey]
    );

    const stopRegionDrag = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
        const drag = regionDragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        regionDragRef.current = null;
        setDraggingRegionId(null);
    }, []);

    const stopRegionResize = React.useCallback((event: React.PointerEvent<HTMLElement>) => {
        const drag = regionResizeRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        regionResizeRef.current = null;
        setDraggingRegionId(null);
    }, []);

    const handleRegionPointerDown = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>, region: AnnotatedImageViewerRegion) => {
            event.preventDefault();
            event.stopPropagation();

            if (event.pointerType === 'mouse' && event.button !== 0) return;

            onSelectRegion?.(region.id);

            if (!onUpdateRegion || createRegionDisabled) return;

            event.currentTarget.setPointerCapture(event.pointerId);
            regionDragRef.current = {
                pointerId: event.pointerId,
                regionId: region.id,
                startClientX: event.clientX,
                startClientY: event.clientY,
                origin: {
                    x: region.x,
                    y: region.y,
                    width: region.width,
                    height: region.height,
                },
                moved: false,
            };
            setDraggingRegionId(region.id);
        },
        [createRegionDisabled, onSelectRegion, onUpdateRegion]
    );

    const handleRegionPointerMove = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const drag = regionDragRef.current;
            if (!drag || drag.pointerId !== event.pointerId || !onUpdateRegion) return;

            const image = imageRef.current;
            if (!image) return;

            const rect = image.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;

            const deltaX = event.clientX - drag.startClientX;
            const deltaY = event.clientY - drag.startClientY;
            const hasMoved = Math.abs(deltaX) > PAN_DRAG_THRESHOLD || Math.abs(deltaY) > PAN_DRAG_THRESHOLD;

            if (!hasMoved && !drag.moved) return;

            drag.moved = true;
            event.preventDefault();
            event.stopPropagation();

            const nextX = Math.max(0, Math.min(1 - drag.origin.width, drag.origin.x + deltaX / rect.width));
            const nextY = Math.max(0, Math.min(1 - drag.origin.height, drag.origin.y + deltaY / rect.height));

            onUpdateRegion(drag.regionId, {
                ...drag.origin,
                x: nextX,
                y: nextY,
            });
        },
        [onUpdateRegion]
    );

    const handleRegionResizePointerDown = React.useCallback(
        (event: React.PointerEvent<HTMLButtonElement>, region: AnnotatedImageViewerRegion) => {
            event.preventDefault();
            event.stopPropagation();

            if (event.pointerType === 'mouse' && event.button !== 0) return;

            onSelectRegion?.(region.id);

            if (!onUpdateRegion || createRegionDisabled) return;

            event.currentTarget.setPointerCapture(event.pointerId);
            regionResizeRef.current = {
                pointerId: event.pointerId,
                regionId: region.id,
                startClientX: event.clientX,
                startClientY: event.clientY,
                origin: {
                    x: region.x,
                    y: region.y,
                    width: region.width,
                    height: region.height,
                },
                moved: false,
            };
            setDraggingRegionId(region.id);
        },
        [createRegionDisabled, onSelectRegion, onUpdateRegion]
    );

    const handleRegionResizePointerMove = React.useCallback(
        (event: React.PointerEvent<HTMLButtonElement>) => {
            const drag = regionResizeRef.current;
            if (!drag || drag.pointerId !== event.pointerId || !onUpdateRegion) return;

            const image = imageRef.current;
            if (!image) return;

            const rect = image.getBoundingClientRect();
            if (rect.width <= 0 || rect.height <= 0) return;

            const deltaX = event.clientX - drag.startClientX;
            const deltaY = event.clientY - drag.startClientY;
            const hasMoved = Math.abs(deltaX) > PAN_DRAG_THRESHOLD || Math.abs(deltaY) > PAN_DRAG_THRESHOLD;

            if (!hasMoved && !drag.moved) return;

            drag.moved = true;
            event.preventDefault();
            event.stopPropagation();

            const maxWidth = 1 - drag.origin.x;
            const maxHeight = 1 - drag.origin.y;
            const nextWidth = Math.max(REGION_MIN_SIZE, Math.min(maxWidth, drag.origin.width + deltaX / rect.width));
            const nextHeight = Math.max(REGION_MIN_SIZE, Math.min(maxHeight, drag.origin.height + deltaY / rect.height));

            onUpdateRegion(drag.regionId, {
                ...drag.origin,
                width: nextWidth,
                height: nextHeight,
            });
        },
        [onUpdateRegion]
    );

    const handleRegionKeyDown = React.useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>, regionId: string | number) => {
            if (event.key !== 'Enter' && event.key !== ' ') return;

            event.preventDefault();
            onSelectRegion?.(regionId);
        },
        [onSelectRegion]
    );

    const getNormalizedImagePoint = React.useCallback((clientX: number, clientY: number) => {
        const image = imageRef.current;
        if (!image) return null;

        const rect = image.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return null;

        return {
            x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
            y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
        };
    }, []);

    const handleCreatePointerDown = React.useCallback(
        (event: React.PointerEvent<SVGSVGElement>) => {
            if (!selectedAsset?.src || !onCreateRegion || createRegionDisabled) return;
            if (event.pointerType === 'mouse' && event.button !== 0) return;

            const point = getNormalizedImagePoint(event.clientX, event.clientY);
            if (!point) return;

            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);
            createDragRef.current = {
                pointerId: event.pointerId,
                start: point,
            };
            setDraftRegion({ ...point, width: 0, height: 0 });
        },
        [createRegionDisabled, getNormalizedImagePoint, onCreateRegion, selectedAsset?.src]
    );

    const handleCreatePointerMove = React.useCallback(
        (event: React.PointerEvent<SVGSVGElement>) => {
            const drag = createDragRef.current;
            if (!drag || drag.pointerId !== event.pointerId) return;

            const point = getNormalizedImagePoint(event.clientX, event.clientY);
            if (!point) return;

            event.preventDefault();
            event.stopPropagation();
            setDraftRegion({
                x: Math.min(drag.start.x, point.x),
                y: Math.min(drag.start.y, point.y),
                width: Math.abs(point.x - drag.start.x),
                height: Math.abs(point.y - drag.start.y),
            });
        },
        [getNormalizedImagePoint]
    );

    const stopCreateRegion = React.useCallback(
        (event: React.PointerEvent<SVGSVGElement>) => {
            const drag = createDragRef.current;
            if (!drag || drag.pointerId !== event.pointerId) return;

            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
            }

            event.preventDefault();
            event.stopPropagation();
            createDragRef.current = null;

            if (draftRegion && draftRegion.width >= 0.01 && draftRegion.height >= 0.01) {
                onCreateRegion?.(draftRegion);
            }

            setDraftRegion(null);
        },
        [draftRegion, onCreateRegion]
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
                                ref={imageRef}
                                src={selectedAsset.src}
                                alt={selectedAsset.alt ?? '참고 이미지'}
                                onLoad={handleImageLoad}
                                draggable={false}
                            />
                            {onCreateRegion ? (
                                <svg
                                    className={styles.DrawingOverlay}
                                    viewBox="0 0 1 1"
                                    preserveAspectRatio="none"
                                    aria-hidden="true"
                                    onPointerDown={handleCreatePointerDown}
                                    onPointerMove={handleCreatePointerMove}
                                    onPointerUp={stopCreateRegion}
                                    onPointerCancel={stopCreateRegion}
                                    onPointerLeave={stopCreateRegion}
                                >
                                    {draftRegion ? (
                                        <rect
                                            className={styles.DraftRegion}
                                            x={draftRegion.x}
                                            y={draftRegion.y}
                                            width={draftRegion.width}
                                            height={draftRegion.height}
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    ) : null}
                                </svg>
                            ) : null}
                            {regions.map((region, index) => {
                                const active = String(region.id) === String(selectedRegionId);

                                return (
                                    <div
                                        ref={(node) => setRegionButtonRef(region.id, node)}
                                        key={String(region.id)}
                                        role="button"
                                        tabIndex={0}
                                        className={styles.RegionBox}
                                        style={getRegionStyle(region)}
                                        data-active={active ? 'true' : 'false'}
                                        data-draggable={onUpdateRegion && !createRegionDisabled ? 'true' : 'false'}
                                        data-dragging={
                                            String(draggingRegionId) === String(region.id) ? 'true' : 'false'
                                        }
                                        onPointerDown={(event) => handleRegionPointerDown(event, region)}
                                        onPointerMove={handleRegionPointerMove}
                                        onPointerUp={stopRegionDrag}
                                        onPointerCancel={stopRegionDrag}
                                        onKeyDown={(event) => handleRegionKeyDown(event, region.id)}
                                        aria-label={`${index + 1}번 영역 선택`}
                                    >
                                        <span className={styles.RegionIndex}>{index + 1}</span>
                                        {onDeleteRegion && !createRegionDisabled ? (
                                            <button
                                                type="button"
                                                className={styles.RegionDeleteButton}
                                                aria-label={`${index + 1}번 영역 삭제`}
                                                onPointerDown={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                }}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                    onDeleteRegion(region.id);
                                                }}
                                            >
                                                <FiTrash2 size={14} />
                                                삭제
                                            </button>
                                        ) : null}
                                        {active && onUpdateRegion && !createRegionDisabled ? (
                                            <button
                                                type="button"
                                                className={styles.RegionResizeHandle}
                                                aria-label={`${index + 1}번 영역 크기 조절`}
                                                onPointerDown={(event) => handleRegionResizePointerDown(event, region)}
                                                onPointerMove={handleRegionResizePointerMove}
                                                onPointerUp={stopRegionResize}
                                                onPointerCancel={stopRegionResize}
                                            />
                                        ) : null}
                                    </div>
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
