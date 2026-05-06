// src/shared/headless/AirTable/components/Container.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAirTableContext } from '../AirTable';

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    height?: number | string;
    onScrollElReady?: (el: HTMLDivElement | null) => void;
};

type TopScrollbarState = {
    visible: boolean;
    scrollWidth: number;
    clientWidth: number;
    scrollLeft: number;
};

const TOP_SCROLLBAR_TRACK_HEIGHT = 8;
const TOP_SCROLLBAR_THUMB_MIN_WIDTH = 40;
const TOP_SCROLLBAR_GAP = 8;
const BOTTOM_SCROLLBAR_MASK_HEIGHT = 12;
const TOP_SCROLLBAR_TOP_PADDING = 4;
const TOP_SCROLLBAR_SLOT_HEIGHT = TOP_SCROLLBAR_TRACK_HEIGHT + TOP_SCROLLBAR_GAP + TOP_SCROLLBAR_TOP_PADDING;

const toCssSize = (v?: number | string) => {
    if (typeof v === 'number') return `${v}px`;
    return v;
};

const isAutoCssSize = (v?: number | string) => v === 'auto';

const findScrollableParent = (el: HTMLElement | null) => {
    let parent = el?.parentElement ?? null;

    while (parent) {
        const style = window.getComputedStyle(parent);
        const overflowY = style.overflowY;

        const canScrollY = overflowY === 'auto' || overflowY === 'scroll';
        if (canScrollY && parent.scrollHeight > parent.clientHeight + 1) return parent;

        parent = parent.parentElement;
    }

    return null;
};

export const Container = ({
    className,
    children,
    style,
    height = '100%',
    onScrollElReady,
    ...rest
}: ContainerProps) => {
    const { scrollRef } = useAirTableContext<any>();
    const isAutoHeight = isAutoCssSize(height);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const topScrollbarTrackRef = useRef<HTMLDivElement | null>(null);
    const topScrollbarDragRef = useRef<{ startClientX: number; startThumbLeft: number } | null>(null);
    const [topScrollbarState, setTopScrollbarState] = useState<TopScrollbarState>({
        visible: false,
        scrollWidth: 0,
        clientWidth: 0,
        scrollLeft: 0,
    });
    const [headerHeight, setHeaderHeight] = useState(0);
    const [topScrollbarTrackWidth, setTopScrollbarTrackWidth] = useState(0);
    const childNodes = useMemo(() => React.Children.toArray(children), [children]);
    const headerChild = childNodes[0] ?? null;
    const bodyChildren = useMemo(() => childNodes.slice(1), [childNodes]);

    const mergedStyle = useMemo<React.CSSProperties>(
        () => ({
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: toCssSize(height) ?? '100%',
            minHeight: 0,
            minWidth: 0,
            position: 'relative',
            ...style,
        }),
        [style, height]
    );

    const topScrollbarMetrics = useMemo(() => {
        const trackWidth = Math.max(0, topScrollbarTrackWidth || topScrollbarState.clientWidth);
        const maxScrollLeft = Math.max(0, topScrollbarState.scrollWidth - topScrollbarState.clientWidth);
        const rawThumbWidth =
            trackWidth > 0 && topScrollbarState.scrollWidth > 0
                ? (topScrollbarState.clientWidth / topScrollbarState.scrollWidth) * trackWidth
                : trackWidth;
        const thumbWidth = topScrollbarState.visible
            ? Math.min(trackWidth, Math.max(TOP_SCROLLBAR_THUMB_MIN_WIDTH, rawThumbWidth))
            : 0;
        const maxThumbLeft = Math.max(0, trackWidth - thumbWidth);
        const thumbLeft = maxScrollLeft <= 0 ? 0 : (topScrollbarState.scrollLeft / maxScrollLeft) * maxThumbLeft;

        return {
            trackWidth,
            thumbWidth,
            maxThumbLeft,
            maxScrollLeft,
            thumbLeft,
        };
    }, [topScrollbarState, topScrollbarTrackWidth]);

    const setScrollLeftFromThumb = useCallback(
        (nextThumbLeft: number) => {
            const el = scrollRef.current;
            if (!el) return;

            const { maxThumbLeft, maxScrollLeft } = topScrollbarMetrics;
            if (maxScrollLeft <= 0) {
                el.scrollLeft = 0;
                return;
            }

            const clampedThumbLeft = Math.max(0, Math.min(nextThumbLeft, maxThumbLeft));
            const ratio = maxThumbLeft <= 0 ? 0 : clampedThumbLeft / maxThumbLeft;
            el.scrollLeft = ratio * maxScrollLeft;
        },
        [scrollRef, topScrollbarMetrics]
    );

    useEffect(() => {
        const el = scrollRef.current;
        if (!onScrollElReady) return;
        onScrollElReady(el ?? null);
        return () => onScrollElReady(null);
    }, [onScrollElReady, scrollRef]);

    useEffect(() => {
        const headerEl = headerRef.current;
        if (!headerEl) {
            setHeaderHeight(0);
            return;
        }

        const updateHeaderHeight = () => setHeaderHeight(Math.ceil(headerEl.getBoundingClientRect().height));
        updateHeaderHeight();

        const resizeObserver =
            typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeaderHeight) : null;
        resizeObserver?.observe(headerEl);
        window.addEventListener('resize', updateHeaderHeight);

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', updateHeaderHeight);
        };
    }, [headerChild]);

    useEffect(() => {
        const trackEl = topScrollbarTrackRef.current;
        if (!trackEl) return;

        const updateTrackWidth = () => setTopScrollbarTrackWidth(Math.ceil(trackEl.clientWidth));
        updateTrackWidth();

        const resizeObserver =
            typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateTrackWidth) : null;
        resizeObserver?.observe(trackEl);
        window.addEventListener('resize', updateTrackWidth);

        return () => {
            resizeObserver?.disconnect();
            window.removeEventListener('resize', updateTrackWidth);
        };
    }, [topScrollbarState.visible]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const updateTopScrollbarState = () => {
            const scrollWidth = Math.ceil(el.scrollWidth);
            const clientWidth = Math.ceil(el.clientWidth);
            const scrollLeft = el.scrollLeft;
            const visible = scrollWidth > clientWidth + 1;

            setTopScrollbarState((prev) =>
                prev.visible === visible &&
                prev.scrollWidth === scrollWidth &&
                prev.clientWidth === clientWidth &&
                prev.scrollLeft === scrollLeft
                    ? prev
                    : { visible, scrollWidth, clientWidth, scrollLeft }
            );
        };

        updateTopScrollbarState();

        const observedTargets = [el, ...Array.from(el.children)].filter(
            (target): target is HTMLElement => target instanceof HTMLElement
        );

        const resizeObserver =
            typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateTopScrollbarState) : null;
        observedTargets.forEach((target) => resizeObserver?.observe(target));

        el.addEventListener('scroll', updateTopScrollbarState, { passive: true });
        window.addEventListener('resize', updateTopScrollbarState);

        return () => {
            resizeObserver?.disconnect();
            el.removeEventListener('scroll', updateTopScrollbarState);
            window.removeEventListener('resize', updateTopScrollbarState);
        };
    }, [scrollRef]);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const parentScrollEl = findScrollableParent(el);
        if (!parentScrollEl) return;

        const TRANSFER_RATE = 0.65;

        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

            const { scrollTop, scrollHeight, clientHeight } = el;

            const atTop = scrollTop <= 0;
            const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

            const goingUp = e.deltaY < 0;
            const goingDown = e.deltaY > 0;

            const hitTop = atTop && goingUp;
            const hitBottom = atBottom && goingDown;

            if (hitTop || hitBottom) {
                e.preventDefault();
                parentScrollEl.scrollTop += e.deltaY * TRANSFER_RATE;
            }
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [scrollRef]);

    useEffect(
        () => () => {
            topScrollbarDragRef.current = null;
        },
        []
    );

    const handleTopScrollbarThumbMouseDown = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();

            topScrollbarDragRef.current = {
                startClientX: event.clientX,
                startThumbLeft: topScrollbarMetrics.thumbLeft,
            };

            const handleMouseMove = (moveEvent: MouseEvent) => {
                const dragState = topScrollbarDragRef.current;
                if (!dragState) return;

                const deltaX = moveEvent.clientX - dragState.startClientX;
                setScrollLeftFromThumb(dragState.startThumbLeft + deltaX);
            };

            const handleMouseUp = () => {
                topScrollbarDragRef.current = null;
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        },
        [setScrollLeftFromThumb, topScrollbarMetrics.thumbLeft]
    );

    const handleTopScrollbarTrackMouseDown = useCallback(
        (event: React.MouseEvent<HTMLDivElement>) => {
            const target = event.target as HTMLElement | null;
            if (target?.dataset.airtableTopScrollbarThumb === 'true') return;

            const trackEl = topScrollbarTrackRef.current;
            if (!trackEl) return;

            event.preventDefault();

            const rect = trackEl.getBoundingClientRect();
            const nextThumbLeft = event.clientX - rect.left - topScrollbarMetrics.thumbWidth / 2;
            setScrollLeftFromThumb(nextThumbLeft);
        },
        [setScrollLeftFromThumb, topScrollbarMetrics.thumbWidth]
    );

    return (
        <div className={className} style={mergedStyle} {...rest}>
            <div
                style={{
                    flex: isAutoHeight ? '0 0 auto' : 1,
                    minHeight: 0,
                    minWidth: 0,
                    position: 'relative',
                }}
            >
                <div
                    ref={scrollRef}
                    className="airtable-scroll airtable-scroll--body"
                    style={{
                        height: isAutoHeight ? 'auto' : '100%',
                        minHeight: 0,
                        minWidth: 0,
                        overflow: 'auto',
                        position: 'relative',
                        boxSizing: 'border-box',
                        paddingBottom: topScrollbarState.visible ? `${BOTTOM_SCROLLBAR_MASK_HEIGHT}px` : undefined,
                    }}
                >
                    {headerChild ? (
                        <div
                            ref={headerRef}
                            style={{
                                position: 'sticky',
                                top: 0,
                                zIndex: 120,
                                background: 'var(--AirTableScrollCoverBg, #fff)',
                            }}
                        >
                            {headerChild}
                        </div>
                    ) : null}

                    {topScrollbarState.visible ? (
                        <div
                            aria-hidden="true"
                            style={{
                                flex: '0 0 auto',
                                height: `${TOP_SCROLLBAR_SLOT_HEIGHT}px`,
                            }}
                        />
                    ) : null}

                    {bodyChildren}
                </div>

                {topScrollbarState.visible ? (
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: `${headerHeight}px`,
                            zIndex: 119,
                            padding: `${TOP_SCROLLBAR_TOP_PADDING}px 0 ${TOP_SCROLLBAR_GAP}px`,
                            background: 'var(--AirTableScrollCoverBg, #fff)',
                        }}
                    >
                        <div
                            ref={topScrollbarTrackRef}
                            onMouseDown={handleTopScrollbarTrackMouseDown}
                            style={{
                                width: '100%',
                                position: 'relative',
                                height: `${TOP_SCROLLBAR_TRACK_HEIGHT}px`,
                                borderRadius: 999,
                                background: 'transparent',
                                cursor: 'pointer',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                data-airtable-top-scrollbar-thumb="true"
                                onMouseDown={handleTopScrollbarThumbMouseDown}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: `${topScrollbarMetrics.thumbLeft}px`,
                                    width: `${topScrollbarMetrics.thumbWidth}px`,
                                    height: '100%',
                                    borderRadius: 999,
                                    background: 'var(--Gray4)',
                                    cursor: 'grab',
                                }}
                            />
                        </div>
                    </div>
                ) : null}

                {topScrollbarState.visible ? (
                    <div
                        aria-hidden="true"
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: `${BOTTOM_SCROLLBAR_MASK_HEIGHT}px`,
                            background: 'var(--AirTableScrollCoverBg, #fff)',
                            pointerEvents: 'none',
                            zIndex: 40,
                        }}
                    />
                ) : null}
            </div>
        </div>
    );
};
