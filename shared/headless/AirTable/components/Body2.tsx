import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CellRenderMeta, SelectionState } from '../AirTable';
import { useAirTableContext } from '../AirTable';
import { getThemeColor } from '../../../utils/css/getThemeColor';
import styles from './Body.module.scss';

type ExpandableDetailRowProps = {
    expanded: boolean;
    rowKey: string;
    gridTemplateColumns: string;
    rowClassName?: string;
    cellClassName?: string;
    onHeightChange: (rowKey: string, height: number) => void;
    children: React.ReactNode;
};

type BodyProps = {
    className?: string;
    style?: React.CSSProperties;
    rowClassName?: string;
    rowSelectedClassName?: string;
    cellClassName?: string;
    selectedCellClassName?: string;
    activeCellClassName?: string;
    detailRowClassName?: string;
    detailCellClassName?: string;
};

type BodyRowData<T> = {
    key: string;
    item: T;
    level: number;
    cells: Array<{
        key: string;
        render: (it: T, idx: number, meta: CellRenderMeta<T>) => React.ReactNode;
    }>;
};

type BodyRowProps<T> = {
    row: BodyRowData<T>;
    actualRi: number;
    baseOrder: string[];
    gridTemplateColumns: string;
    rowClassName?: string;
    rowSelectedClassName?: string;
    cellClassName?: string;
    selectedCellClassName?: string;
    activeCellClassName?: string;
    detailRowClassName?: string;
    detailCellClassName?: string;
    detailRenderer?: (params: { row: T; ri: number }) => React.ReactNode;
    getRowStyle?: (row: T, ri: number) => React.CSSProperties;
    rangeTop: number | null;
    rangeBottom: number | null;
    rangeLeft: number | null;
    rangeRight: number | null;
    activeRi: number | null;
    activeCi: number | null;
    isSingleCellSelection: boolean;
    draggingKey: string | null;
    beginSelect: (ri: number, ci: number) => void;
    updateSelect: (ri: number, ci: number) => void;
    setSelection: React.Dispatch<React.SetStateAction<SelectionState>>;
    getShiftStyle: (colKey: string) => React.CSSProperties;
    getPinnedStyle: (colKey: string, bg?: string, options?: { isHeader?: boolean }) => React.CSSProperties;
    toggleRowExpanded: (rowKey: string) => void;
    indentTargetKey?: string;
    canExpand: boolean;
    expanded: boolean;
    onDetailHeightChange: (rowKey: string, height: number) => void;
};

type RowMeasurement = {
    start: number;
    end: number;
};

type HeightState = number | 'auto';

const INDENT_PX = 24;
const MAX_EXPANDED_DETAIL_ROWS = 3;
const TRANSITION_MS = 220;
const APPEAR_DELAY_MS = 32;

const findStartIndex = (measurements: RowMeasurement[], target: number) => {
    if (measurements.length === 0) return 0;

    let left = 0;
    let right = measurements.length - 1;
    let answer = measurements.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (measurements[mid].end >= target) {
            answer = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return answer;
};

const findEndIndex = (measurements: RowMeasurement[], target: number) => {
    if (measurements.length === 0) return 0;

    let left = 0;
    let right = measurements.length - 1;
    let answer = 0;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (measurements[mid].start <= target) {
            answer = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return answer;
};

const ExpandableDetailRow = ({
    expanded,
    rowKey,
    gridTemplateColumns,
    rowClassName,
    cellClassName,
    onHeightChange,
    children,
}: ExpandableDetailRowProps) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const animatedRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const [shouldRender, setShouldRender] = useState<boolean>(expanded);
    const [height, setHeight] = useState<HeightState>(expanded ? 'auto' : 0);
    const [visualOpen, setVisualOpen] = useState<boolean>(expanded);

    const clearTimers = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;

        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = null;
    }, []);

    const measure = useCallback(() => {
        const animatedEl = animatedRef.current;
        if (!animatedEl) {
            onHeightChange(rowKey, 0);
            return;
        }

        onHeightChange(rowKey, Math.ceil(animatedEl.getBoundingClientRect().height));
    }, [onHeightChange, rowKey]);

    useLayoutEffect(() => {
        clearTimers();

        if (expanded) {
            setShouldRender(true);
            setHeight(0);
            setVisualOpen(false);

            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = requestAnimationFrame(() => {
                    const contentEl = contentRef.current;
                    const nextHeight = contentEl ? contentEl.scrollHeight : 0;

                    setHeight(nextHeight);
                    measure();

                    timerRef.current = window.setTimeout(() => {
                        setVisualOpen(true);
                    }, APPEAR_DELAY_MS);
                });
            });
            return;
        }

        const contentEl = contentRef.current;
        const currentHeight = contentEl ? contentEl.getBoundingClientRect().height : 0;

        setVisualOpen(false);
        setHeight(currentHeight);
        measure();

        rafRef.current = requestAnimationFrame(() => {
            setHeight(0);
        });
    }, [clearTimers, expanded, measure]);

    useLayoutEffect(() => {
        const ResizeObserverCtor = typeof window !== 'undefined' ? window.ResizeObserver : undefined;
        let observer: ResizeObserver | null = null;

        if (ResizeObserverCtor) {
            observer = new ResizeObserverCtor(() => {
                measure();
            });
            if (animatedRef.current) observer.observe(animatedRef.current);
            if (contentRef.current) observer.observe(contentRef.current);
        }

        return () => {
            clearTimers();
            observer?.disconnect();
            onHeightChange(rowKey, 0);
        };
    }, [clearTimers, measure, onHeightChange, rowKey]);

    if (!shouldRender) return null;

    return (
        <div
            className={rowClassName}
            style={{
                display: 'grid',
                gridTemplateColumns,
                minWidth: '100%',
            }}
        >
            <div
                className={cellClassName}
                style={{
                    gridColumn: '1 / -1',
                    width: '100%',
                }}
            >
                <div
                    ref={animatedRef}
                    style={{
                        overflow: 'hidden',
                        height: height === 'auto' ? 'auto' : `${height}px`,
                        transition: `height ${TRANSITION_MS}ms ease`,
                        willChange: 'height',
                    }}
                    onTransitionEnd={(e) => {
                        if (e.propertyName !== 'height') return;

                        if (expanded) {
                            setHeight('auto');
                            onHeightChange(rowKey, Math.ceil(contentRef.current?.getBoundingClientRect().height ?? 0));
                            return;
                        }

                        setShouldRender(false);
                        onHeightChange(rowKey, 0);
                    }}
                >
                    <div className={[styles.detailRoot, visualOpen ? styles.detailOpen : ''].join(' ')}>
                        <div ref={contentRef} className={styles.detailInner}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BodyRowInner = <T,>({
    row,
    actualRi,
    baseOrder,
    gridTemplateColumns,
    rowClassName,
    rowSelectedClassName,
    cellClassName,
    selectedCellClassName,
    activeCellClassName,
    detailRowClassName,
    detailCellClassName,
    detailRenderer,
    getRowStyle,
    rangeTop,
    rangeBottom,
    rangeLeft,
    rangeRight,
    activeRi,
    activeCi,
    isSingleCellSelection,
    draggingKey,
    beginSelect,
    updateSelect,
    setSelection,
    getShiftStyle,
    getPinnedStyle,
    toggleRowExpanded,
    indentTargetKey,
    canExpand,
    expanded,
    onDetailHeightChange,
}: BodyRowProps<T>) => {
    const rowKey = row.key;
    const rowStyleRaw = getRowStyle?.(row.item, actualRi) ?? {};
    const rowBg = rowStyleRaw.backgroundColor;
    const { backgroundColor: _bg, ...rowStyle } = rowStyleRaw;

    const rowInSelection = rangeTop !== null && rangeBottom !== null && actualRi >= rangeTop && actualRi <= rangeBottom;
    const rowSelected =
        rowInSelection &&
        rangeLeft !== null &&
        rangeRight !== null &&
        rangeLeft <= 0 &&
        rangeRight >= baseOrder.length - 1;

    const meta: CellRenderMeta<T> = {
        rowKey,
        ri: actualRi,
        level: row.level,
        toggleRowExpanded,
        isRowExpanded: (candidateRowKey: string) => candidateRowKey === rowKey && expanded,
    };

    const cellMap = useMemo(() => new Map(row.cells.map((cell) => [cell.key, cell])), [row.cells]);
    const isChild = row.level > 0;

    return (
        <>
            <div
                className={[rowClassName ?? '', rowSelected ? (rowSelectedClassName ?? '') : ''].join(' ')}
                data-row-selected={rowSelected ? 'true' : 'false'}
                data-row-in-selection={rowInSelection ? 'true' : 'false'}
                style={{
                    display: 'grid',
                    gridTemplateColumns,
                    ...rowStyle,
                }}
            >
                {baseOrder.map((colKey, ci) => {
                    const cell = cellMap.get(colKey);
                    if (!cell) return null;

                    const selected =
                        rangeTop !== null &&
                        rangeBottom !== null &&
                        rangeLeft !== null &&
                        rangeRight !== null &&
                        actualRi >= rangeTop &&
                        actualRi <= rangeBottom &&
                        ci >= rangeLeft &&
                        ci <= rangeRight;
                    const cellBg = selected ? undefined : rowBg ? rowBg : undefined;
                    const active = isSingleCellSelection && activeRi === actualRi && activeCi === ci;
                    const isTopEdge = selected && rangeTop !== null && actualRi === rangeTop;
                    const isBottomEdge = selected && rangeBottom !== null && actualRi === rangeBottom;
                    const isLeftEdge = selected && rangeLeft !== null && ci === rangeLeft;
                    const isRightEdge = selected && rangeRight !== null && ci === rangeRight;
                    const isIndentTarget = colKey === indentTargetKey;
                    const indentPadding = isChild ? row.level * INDENT_PX : 0;

                    return (
                        <div
                            key={`c-${rowKey}-${colKey}`}
                            id={`__cell_${row.key}_${colKey}`}
                            className={[
                                cellClassName ?? '',
                                selected ? (selectedCellClassName ?? '') : '',
                                active ? (activeCellClassName ?? '') : '',
                            ].join(' ')}
                            data-cell-selected={selected ? 'true' : 'false'}
                            data-cell-active={active ? 'true' : 'false'}
                            data-cell-edge-top={isTopEdge ? 'true' : 'false'}
                            data-cell-edge-bottom={isBottomEdge ? 'true' : 'false'}
                            data-cell-edge-left={isLeftEdge ? 'true' : 'false'}
                            data-cell-edge-right={isRightEdge ? 'true' : 'false'}
                            onMouseDown={(e) => {
                                if (draggingKey) return;
                                if (e.button !== 0) return;
                                e.preventDefault();

                                const target = e.target as HTMLElement;
                                if (target.closest('[data-row-toggle="true"]')) return;

                                beginSelect(actualRi, ci);
                            }}
                            onMouseEnter={() => {
                                if (draggingKey) return;
                                updateSelect(actualRi, ci);
                            }}
                            onContextMenu={(e) => {
                                if (draggingKey) return;

                                e.preventDefault();
                                e.stopPropagation();

                                if (!selected) {
                                    setSelection({
                                        start: { ri: actualRi, ci },
                                        end: { ri: actualRi, ci },
                                        isSelecting: false,
                                    });
                                }

                                window.dispatchEvent(
                                    new CustomEvent('AIR_TABLE_OPEN_CONTEXT_MENU', {
                                        detail: {
                                            x: e.clientX,
                                            y: e.clientY,
                                            ri: actualRi,
                                            ci,
                                            rowKey: row.key,
                                            colKey,
                                        },
                                    })
                                );
                            }}
                            style={{
                                backgroundColor: cellBg,
                                color: rowStyleRaw.color,
                                ...getShiftStyle(colKey),
                                ...getPinnedStyle(colKey, cellBg ?? getThemeColor('White1')),
                                ...(isIndentTarget ? { paddingLeft: indentPadding } : {}),
                            }}
                        >
                            {cell.render(row.item, actualRi, meta)}
                        </div>
                    );
                })}
            </div>

            {canExpand && (
                <ExpandableDetailRow
                    expanded={expanded}
                    rowKey={rowKey}
                    gridTemplateColumns={gridTemplateColumns}
                    rowClassName={detailRowClassName}
                    cellClassName={detailCellClassName}
                    onHeightChange={onDetailHeightChange}
                >
                    {detailRenderer?.({ row: row.item, ri: actualRi })}
                </ExpandableDetailRow>
            )}
        </>
    );
};

const areBodyRowPropsEqual = (prev: BodyRowProps<unknown>, next: BodyRowProps<unknown>) =>
    prev.row.key === next.row.key &&
    prev.row.item === next.row.item &&
    prev.row.level === next.row.level &&
    prev.row.cells.length === next.row.cells.length &&
    prev.actualRi === next.actualRi &&
    prev.baseOrder === next.baseOrder &&
    prev.gridTemplateColumns === next.gridTemplateColumns &&
    prev.rowClassName === next.rowClassName &&
    prev.rowSelectedClassName === next.rowSelectedClassName &&
    prev.cellClassName === next.cellClassName &&
    prev.selectedCellClassName === next.selectedCellClassName &&
    prev.activeCellClassName === next.activeCellClassName &&
    prev.detailRowClassName === next.detailRowClassName &&
    prev.detailCellClassName === next.detailCellClassName &&
    prev.detailRenderer === next.detailRenderer &&
    prev.getRowStyle === next.getRowStyle &&
    prev.rangeTop === next.rangeTop &&
    prev.rangeBottom === next.rangeBottom &&
    prev.rangeLeft === next.rangeLeft &&
    prev.rangeRight === next.rangeRight &&
    prev.activeRi === next.activeRi &&
    prev.activeCi === next.activeCi &&
    prev.isSingleCellSelection === next.isSingleCellSelection &&
    prev.draggingKey === next.draggingKey &&
    prev.beginSelect === next.beginSelect &&
    prev.updateSelect === next.updateSelect &&
    prev.setSelection === next.setSelection &&
    prev.getShiftStyle === next.getShiftStyle &&
    prev.getPinnedStyle === next.getPinnedStyle &&
    prev.toggleRowExpanded === next.toggleRowExpanded &&
    prev.indentTargetKey === next.indentTargetKey &&
    prev.canExpand === next.canExpand &&
    prev.expanded === next.expanded &&
    prev.onDetailHeightChange === next.onDetailHeightChange;

const BodyRow = memo(BodyRowInner, areBodyRowPropsEqual) as typeof BodyRowInner;

export const Body2 = <T,>({
    className,
    style,
    rowClassName,
    rowSelectedClassName,
    cellClassName,
    selectedCellClassName,
    activeCellClassName,
    detailRowClassName,
    detailCellClassName,
}: BodyProps) => {
    const {
        props,
        tableAreaRef,
        scrollRef,
        state,
        baseOrder,
        gridTemplateColumns,
        selection,
        getRange,
        getShiftStyle,
        getPinnedStyle,
        setSelection,
        toggleRowExpanded: baseToggleRowExpanded,
        expandedRowKeys,
    } = useAirTableContext<T>();

    const { drag, rows, pinnedColumnKeys } = state;
    const { getRowStyle, detailRenderer, getRowCanExpand, getExpandedRows } = props;
    const shouldLimitExpandedDetailRows = Boolean(detailRenderer) && !getExpandedRows;
    const enableVirtualization = props.enableVirtualization ?? false;
    const virtualRowHeight = props.virtualRowHeight ?? 44;
    const virtualOverscan = props.virtualOverscan ?? 6;
    const canVirtualize = enableVirtualization && !getExpandedRows;

    const bodyRef = useRef<HTMLDivElement | null>(null);
    const virtualScrollRef = useRef<HTMLElement | null>(null);
    const [virtualState, setVirtualState] = useState<{ top: number; height: number }>({
        top: 0,
        height: 0,
    });
    const [detailHeightByRowKey, setDetailHeightByRowKey] = useState<Record<string, number>>({});

    const resolveVirtualScrollEl = useCallback(() => {
        if (typeof window === 'undefined') return scrollRef.current;
        const internal = scrollRef.current;
        if (internal) {
            const style = window.getComputedStyle(internal);
            const overflowY = style.overflowY;
            const canScrollY =
                (overflowY === 'auto' || overflowY === 'scroll') && internal.scrollHeight > internal.clientHeight + 1;
            if (canScrollY) return internal;
        }

        const root = bodyRef.current?.parentElement;
        let parent = root?.parentElement ?? null;
        while (parent) {
            const style = window.getComputedStyle(parent);
            const overflowY = style.overflowY;
            const canScrollY =
                (overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight + 1;
            if (canScrollY) return parent;
            parent = parent.parentElement;
        }

        return internal;
    }, [scrollRef]);

    const updateVirtualState = useCallback(() => {
        const scrollEl = virtualScrollRef.current ?? resolveVirtualScrollEl();
        const bodyEl = bodyRef.current;
        if (!scrollEl || !bodyEl) return;

        if (scrollEl !== virtualScrollRef.current) {
            virtualScrollRef.current = scrollEl;
        }

        const scrollTop = scrollEl.scrollTop;
        const scrollRect = scrollEl.getBoundingClientRect();
        const bodyRect = bodyEl.getBoundingClientRect();
        const bodyTopInScroll = bodyRect.top - scrollRect.top + scrollTop;
        const bodyBottomInScroll = bodyTopInScroll + bodyEl.offsetHeight;
        const viewportTop = scrollTop;
        const viewportBottom = scrollTop + scrollEl.clientHeight;
        const visibleTop = Math.max(bodyTopInScroll, viewportTop);
        const visibleBottom = Math.min(bodyBottomInScroll, viewportBottom);
        const bodyScrollTop = Math.max(0, visibleTop - bodyTopInScroll);
        const viewportHeight = Math.max(0, visibleBottom - visibleTop);

        setVirtualState({ top: bodyScrollTop, height: viewportHeight });
    }, [resolveVirtualScrollEl]);

    const handleDetailHeightChange = useCallback((rowKey: string, nextHeight: number) => {
        const normalizedHeight = Math.max(0, Math.ceil(nextHeight));

        setDetailHeightByRowKey((prev) => {
            const prevHeight = prev[rowKey] ?? 0;
            if (prevHeight === normalizedHeight) return prev;

            if (normalizedHeight <= 0) {
                if (!(rowKey in prev)) return prev;
                const next = { ...prev };
                delete next[rowKey];
                return next;
            }

            return {
                ...prev,
                [rowKey]: normalizedHeight,
            };
        });
    }, []);

    useEffect(() => {
        if (!shouldLimitExpandedDetailRows) return;
        if (expandedRowKeys.size <= MAX_EXPANDED_DETAIL_ROWS) return;

        const overflowCount = expandedRowKeys.size - MAX_EXPANDED_DETAIL_ROWS;
        Array.from(expandedRowKeys)
            .slice(0, overflowCount)
            .forEach((rowKey) => {
                baseToggleRowExpanded(rowKey);
            });
    }, [baseToggleRowExpanded, expandedRowKeys, shouldLimitExpandedDetailRows]);

    // AirTable2는 detail row를 여러 개 열 수 있지만, virtualization 안정성을 위해 최대 3개까지만 유지한다.
    const toggleRowExpanded = useCallback(
        (rowKey: string) => {
            if (!shouldLimitExpandedDetailRows) {
                baseToggleRowExpanded(rowKey);
                return;
            }

            const key = String(rowKey);
            if (expandedRowKeys.has(key)) {
                baseToggleRowExpanded(key);
                return;
            }

            const expandedKeys = Array.from(expandedRowKeys);
            const overflowCount = Math.max(0, expandedKeys.length - (MAX_EXPANDED_DETAIL_ROWS - 1));

            expandedKeys.slice(0, overflowCount).forEach((openedKey) => {
                baseToggleRowExpanded(openedKey);
            });

            baseToggleRowExpanded(key);
        },
        [baseToggleRowExpanded, expandedRowKeys, shouldLimitExpandedDetailRows]
    );

    const rowMeasurements = useMemo(() => {
        if (!canVirtualize) {
            return {
                measurements: [] as RowMeasurement[],
                totalHeight: 0,
            };
        }

        let cursor = 0;

        const measurements = rows.map((row) => {
            const extraHeight = expandedRowKeys.has(row.key) ? (detailHeightByRowKey[row.key] ?? 0) : 0;
            const start = cursor;
            cursor += virtualRowHeight + extraHeight;
            return {
                start,
                end: cursor,
            };
        });

        return {
            measurements,
            totalHeight: cursor,
        };
    }, [canVirtualize, rows, expandedRowKeys, detailHeightByRowKey, virtualRowHeight]);

    useEffect(() => {
        if (!canVirtualize) return;
        updateVirtualState();
    }, [canVirtualize, rows.length, rowMeasurements.totalHeight, updateVirtualState]);

    useEffect(() => {
        if (!canVirtualize) return;
        const scrollEl = resolveVirtualScrollEl();
        if (!scrollEl) return;

        let raf = 0;
        const handle = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(() => {
                raf = 0;
                updateVirtualState();
            });
        };

        handle();
        scrollEl.addEventListener('scroll', handle);
        window.addEventListener('resize', handle);

        return () => {
            scrollEl.removeEventListener('scroll', handle);
            window.removeEventListener('resize', handle);
            if (raf) window.cancelAnimationFrame(raf);
        };
    }, [canVirtualize, resolveVirtualScrollEl, updateVirtualState]);

    let rowsToRender = rows as BodyRowData<T>[];
    let rowIndexOffset = 0;
    let paddingTop = 0;
    let paddingBottom = 0;

    if (canVirtualize && rows.length > 0) {
        const overscanPx = virtualOverscan * virtualRowHeight;
        const startIndex = findStartIndex(rowMeasurements.measurements, Math.max(0, virtualState.top - overscanPx));
        const endIndex = findEndIndex(
            rowMeasurements.measurements,
            virtualState.top + virtualState.height + overscanPx
        );

        rowsToRender = rows.slice(startIndex, endIndex + 1) as BodyRowData<T>[];
        rowIndexOffset = startIndex;
        paddingTop = rowMeasurements.measurements[startIndex]?.start ?? 0;
        paddingBottom = Math.max(0, rowMeasurements.totalHeight - (rowMeasurements.measurements[endIndex]?.end ?? 0));
    }

    const beginSelect = useCallback(
        (ri: number, ci: number) => {
            setSelection({ start: { ri, ci }, end: { ri, ci }, isSelecting: true });
        },
        [setSelection]
    );

    const updateSelect = useCallback(
        (ri: number, ci: number) => {
            setSelection((prev) => {
                if (!prev.isSelecting) return prev;
                return { ...prev, end: { ri, ci } };
            });
        },
        [setSelection]
    );

    const indentTargetKey = pinnedColumnKeys[0] ?? baseOrder[0];

    const range = getRange();
    const rangeTop = range?.top ?? null;
    const rangeBottom = range?.bottom ?? null;
    const rangeLeft = range?.left ?? null;
    const rangeRight = range?.right ?? null;
    const activeRi = selection.start?.ri ?? null;
    const activeCi = selection.start?.ci ?? null;
    const isSingleCellSelection =
        rangeTop !== null &&
        rangeBottom !== null &&
        rangeLeft !== null &&
        rangeRight !== null &&
        rangeTop === rangeBottom &&
        rangeLeft === rangeRight;

    return (
        <div
            className={className}
            ref={bodyRef}
            style={{
                ...style,
                userSelect: 'none',
                minHeight: 0,
                minWidth: 0,
                overflow: 'visible',
                maxHeight: 'none',
            }}
        >
            <div ref={tableAreaRef} style={{ position: 'relative', minWidth: 'fit-content', width: 'fit-content' }}>
                <div>
                    {paddingTop > 0 && <div style={{ height: paddingTop }} />}
                    {rowsToRender.map((row, ri) => {
                        const actualRi = rowIndexOffset + ri;
                        const canExpand =
                            !!detailRenderer && (getRowCanExpand ? getRowCanExpand(row.item, actualRi) : true);
                        const expanded = canExpand && expandedRowKeys.has(row.key);

                        return (
                            <BodyRow
                                key={row.key}
                                row={row}
                                actualRi={actualRi}
                                baseOrder={baseOrder}
                                gridTemplateColumns={gridTemplateColumns}
                                rowClassName={rowClassName}
                                rowSelectedClassName={rowSelectedClassName}
                                cellClassName={cellClassName}
                                selectedCellClassName={selectedCellClassName}
                                activeCellClassName={activeCellClassName}
                                detailRowClassName={detailRowClassName}
                                detailCellClassName={detailCellClassName}
                                detailRenderer={detailRenderer}
                                getRowStyle={getRowStyle}
                                rangeTop={rangeTop}
                                rangeBottom={rangeBottom}
                                rangeLeft={rangeLeft}
                                rangeRight={rangeRight}
                                activeRi={activeRi}
                                activeCi={activeCi}
                                isSingleCellSelection={isSingleCellSelection}
                                draggingKey={drag.draggingKey}
                                beginSelect={beginSelect}
                                updateSelect={updateSelect}
                                setSelection={setSelection}
                                getShiftStyle={getShiftStyle}
                                getPinnedStyle={getPinnedStyle}
                                toggleRowExpanded={toggleRowExpanded}
                                indentTargetKey={indentTargetKey}
                                canExpand={canExpand}
                                expanded={expanded}
                                onDetailHeightChange={handleDetailHeightChange}
                            />
                        );
                    })}
                    {paddingBottom > 0 && <div style={{ height: paddingBottom }} />}
                </div>
            </div>
        </div>
    );
};
