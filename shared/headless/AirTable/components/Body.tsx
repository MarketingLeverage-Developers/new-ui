import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CellRenderMeta } from '../AirTable';
import { useAirTableContext } from '../AirTable';
import styles from './Body.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
import { getThemeColor } from '../../../utils/css/getThemeColor';

type HeightState = number | 'auto';

type ExpandableDetailRowProps = {
    expanded: boolean;
    gridTemplateColumns: string;
    rowClassName?: string;
    cellClassName?: string;
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
        render: (it: T, idx: number, meta: CellRenderMeta<T>) => React.ReactElement;
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
    setSelection: React.Dispatch<
        React.SetStateAction<{
            start: { ri: number; ci: number } | null;
            end: { ri: number; ci: number } | null;
            isSelecting: boolean;
        }>
    >;
    getShiftStyle: (colKey: string) => React.CSSProperties;
    getPinnedStyle: (colKey: string, bg?: string, options?: { isHeader?: boolean }) => React.CSSProperties;
    toggleRowExpanded: (rowKey: string) => void;
    isRowExpanded: (rowKey: string) => boolean;
    indentTargetKey?: string;
    canExpand: boolean;
    expanded: boolean;
};

type VirtualWindowState = {
    startIndex: number;
    endIndex: number;
    paddingTop: number;
    paddingBottom: number;
};

const TRANSITION_MS = 260;
const APPEAR_DELAY_MS = 40;
const INDENT_PX = 24;

const ExpandableDetailRow = ({
    expanded,
    gridTemplateColumns,
    rowClassName,
    cellClassName,
    children,
}: ExpandableDetailRowProps) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const rafRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);

    const [shouldRender, setShouldRender] = useState<boolean>(expanded);
    const [height, setHeight] = useState<HeightState>(expanded ? 'auto' : 0);
    const [visualOpen, setVisualOpen] = useState<boolean>(false);

    const clearTimers = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;

        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = null;
    };

    useLayoutEffect(() => {
        clearTimers();

        if (expanded) {
            setShouldRender(true);
            setHeight(0);
            setVisualOpen(false);

            rafRef.current = requestAnimationFrame(() => {
                rafRef.current = requestAnimationFrame(() => {
                    const el = contentRef.current;
                    const nextH = el ? el.scrollHeight : 0;

                    setHeight(nextH);

                    timerRef.current = window.setTimeout(() => {
                        setVisualOpen(true);
                    }, APPEAR_DELAY_MS);

                    timerRef.current = window.setTimeout(() => {
                        setHeight('auto');
                    }, TRANSITION_MS + 80);
                });
            });

            return;
        }

        setVisualOpen(false);

        const el = contentRef.current;
        const currentH = el ? el.scrollHeight : 0;

        setHeight(currentH);

        rafRef.current = requestAnimationFrame(() => {
            setHeight(0);

            timerRef.current = window.setTimeout(() => {
                setShouldRender(false);
            }, TRANSITION_MS + 80);
        });

        return;
    }, [expanded]);

    useLayoutEffect(() => clearTimers, []);

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
                    style={{
                        overflow: 'hidden',
                        height: height === 'auto' ? 'auto' : `${height}px`,
                        transition: `height ${TRANSITION_MS}ms ease`,
                        willChange: 'height',
                    }}
                    onTransitionEnd={(e) => {
                        if (e.propertyName !== 'height') return;

                        if (timerRef.current) window.clearTimeout(timerRef.current);
                        timerRef.current = null;

                        if (expanded) setHeight('auto');
                        else setShouldRender(false);
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
    isRowExpanded,
    indentTargetKey,
    canExpand,
    expanded,
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
        isRowExpanded,
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
                    gridTemplateColumns={gridTemplateColumns}
                    rowClassName={detailRowClassName}
                    cellClassName={detailCellClassName}
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
    prev.row.cells === next.row.cells &&
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
    prev.isRowExpanded === next.isRowExpanded &&
    prev.indentTargetKey === next.indentTargetKey &&
    prev.canExpand === next.canExpand &&
    prev.expanded === next.expanded;

const BodyRow = memo(BodyRowInner, areBodyRowPropsEqual) as typeof BodyRowInner;

export const Body = <T,>({
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
        isCellSelected,
        toggleRowExpanded,
        isRowExpanded,
    } = useAirTableContext<T>();

    const { drag, rows, pinnedColumnKeys } = state;
    const { getRowStyle, detailRenderer, getRowCanExpand, getExpandedRows, enableAnimation = false } = props;
    const animationRowLimit = props.animationRowLimit ?? 200;
    const getAnimationMode = () => {
        if (typeof window === 'undefined') return 'row';
        const value = (window as any).__AIRTABLE_ANIM_MODE__;
        return value === 'full' || value === 'row' ? value : 'row';
    };
    const enableVirtualization = props.enableVirtualization ?? false;
    const virtualRowHeight = props.virtualRowHeight ?? 44;
    const virtualOverscan = props.virtualOverscan ?? 6;
    const canVirtualize = enableVirtualization && !detailRenderer && !getExpandedRows;
    const animationMode = getAnimationMode();
    const shouldAnimate =
        enableAnimation && !canVirtualize && (animationRowLimit <= 0 || rows.length <= animationRowLimit);
    const useFullCellAnimation = shouldAnimate && animationMode === 'full';

    const bodyRef = useRef<HTMLDivElement | null>(null);
    const virtualScrollRef = useRef<HTMLElement | null>(null);
    const [virtualWindow, setVirtualWindow] = useState<VirtualWindowState>(() => {
        const initialEndIndex = rows.length > 0 ? Math.min(rows.length - 1, virtualOverscan) : -1;

        return {
            startIndex: 0,
            endIndex: initialEndIndex,
            paddingTop: 0,
            paddingBottom: rows.length > 0 ? Math.max(0, (rows.length - initialEndIndex - 1) * virtualRowHeight) : 0,
        };
    });

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

    const updateVirtualWindow = useCallback(() => {
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
        const nextStartIndex = Math.max(0, Math.floor(bodyScrollTop / virtualRowHeight) - virtualOverscan);
        const nextEndIndex = Math.min(
            rows.length - 1,
            Math.ceil((bodyScrollTop + viewportHeight) / virtualRowHeight) + virtualOverscan
        );
        const nextWindow: VirtualWindowState = {
            startIndex: nextStartIndex,
            endIndex: nextEndIndex,
            paddingTop: nextStartIndex * virtualRowHeight,
            paddingBottom: Math.max(0, (rows.length - nextEndIndex - 1) * virtualRowHeight),
        };

        setVirtualWindow((prev) => {
            if (
                prev.startIndex === nextWindow.startIndex &&
                prev.endIndex === nextWindow.endIndex &&
                prev.paddingTop === nextWindow.paddingTop &&
                prev.paddingBottom === nextWindow.paddingBottom
            ) {
                return prev;
            }

            return nextWindow;
        });
    }, [resolveVirtualScrollEl, rows.length, virtualOverscan, virtualRowHeight]);

    useEffect(() => {
        if (!canVirtualize) return;
        updateVirtualWindow();
    }, [canVirtualize, rows.length, virtualRowHeight, updateVirtualWindow]);

    useEffect(() => {
        if (!canVirtualize) return;
        const scrollEl = resolveVirtualScrollEl();
        if (!scrollEl) return;

        let raf = 0;
        const handle = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(() => {
                raf = 0;
                updateVirtualWindow();
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
    }, [canVirtualize, resolveVirtualScrollEl, updateVirtualWindow]);

    const typedRows = rows as BodyRowData<T>[];
    let rowsToRender = typedRows;
    let rowIndexOffset = 0;
    let paddingTop = 0;
    let paddingBottom = 0;

    if (canVirtualize && rows.length > 0) {
        rowsToRender = typedRows.slice(virtualWindow.startIndex, virtualWindow.endIndex + 1);
        rowIndexOffset = virtualWindow.startIndex;
        paddingTop = virtualWindow.paddingTop;
        paddingBottom = virtualWindow.paddingBottom;
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
    const activeCell = selection.start;
    const isSingleCellSelection = range !== null && range.top === range.bottom && range.left === range.right;
    const rangeTop = range?.top ?? null;
    const rangeBottom = range?.bottom ?? null;
    const rangeLeft = range?.left ?? null;
    const rangeRight = range?.right ?? null;
    const activeRi = activeCell?.ri ?? null;
    const activeCi = activeCell?.ci ?? null;

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
                    {shouldAnimate ? (
                        <AnimatePresence initial={false}>
                            {rowsToRender.map((row, ri) => {
                                const actualRi = rowIndexOffset + ri;
                                const rowStyleRaw = getRowStyle?.(row.item, actualRi) ?? {};
                                const rowKey = row.key;
                                const rowInSelection = range !== null && actualRi >= range.top && actualRi <= range.bottom;
                                const rowSelected =
                                    rowInSelection &&
                                    range !== null &&
                                    range.left <= 0 &&
                                    range.right >= baseOrder.length - 1;

                                const canExpand =
                                    !!detailRenderer && (getRowCanExpand ? getRowCanExpand(row.item, actualRi) : true);

                                const expanded = canExpand && isRowExpanded(rowKey);
                                const rowBg = rowStyleRaw.backgroundColor;
                                const { backgroundColor: _bg, ...rowStyle } = rowStyleRaw;
                                const meta: CellRenderMeta<T> = {
                                    rowKey,
                                    ri: actualRi,
                                    level: row.level,
                                    toggleRowExpanded,
                                    isRowExpanded,
                                };
                                const isChild = row.level > 0;
                                const cellMap = new Map(row.cells.map((c) => [c.key, c]));

                                return (
                                    <React.Fragment key={rowKey}>
                                        <motion.div
                                            layout={useFullCellAnimation ? true : 'position'}
                                            layoutId={useFullCellAnimation ? `air-row-${rowKey}` : undefined}
                                            initial={{ opacity: 0, y: -4 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -4 }}
                                            transition={{
                                                duration: 0.26,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            className={[
                                                rowClassName ?? '',
                                                rowSelected ? (rowSelectedClassName ?? '') : '',
                                            ].join(' ')}
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

                                                const selected = isCellSelected(actualRi, ci);
                                                const cellBg = selected ? undefined : rowBg ? rowBg : undefined;
                                                const active =
                                                    isSingleCellSelection &&
                                                    activeCell?.ri === actualRi &&
                                                    activeCell?.ci === ci;
                                                const isTopEdge = selected && range !== null && actualRi === range.top;
                                                const isBottomEdge =
                                                    selected && range !== null && actualRi === range.bottom;
                                                const isLeftEdge = selected && range !== null && ci === range.left;
                                                const isRightEdge = selected && range !== null && ci === range.right;
                                                const isIndentTarget = colKey === indentTargetKey;
                                                const indentPadding = isChild ? row.level * INDENT_PX : 0;
                                                const cellKey = `c-${rowKey}-${colKey}`;
                                                const cellProps = {
                                                    id: `__cell_${row.key}_${colKey}`,
                                                    className: [
                                                        cellClassName ?? '',
                                                        selected ? (selectedCellClassName ?? '') : '',
                                                        active ? (activeCellClassName ?? '') : '',
                                                    ].join(' '),
                                                    'data-cell-selected': selected ? 'true' : 'false',
                                                    'data-cell-active': active ? 'true' : 'false',
                                                    'data-cell-edge-top': isTopEdge ? 'true' : 'false',
                                                    'data-cell-edge-bottom': isBottomEdge ? 'true' : 'false',
                                                    'data-cell-edge-left': isLeftEdge ? 'true' : 'false',
                                                    'data-cell-edge-right': isRightEdge ? 'true' : 'false',
                                                    onMouseDown: (e: React.MouseEvent) => {
                                                        if (drag.draggingKey) return;
                                                        if (e.button !== 0) return;
                                                        e.preventDefault();

                                                        const target = e.target as HTMLElement;
                                                        if (target.closest('[data-row-toggle="true"]')) return;

                                                        beginSelect(actualRi, ci);
                                                    },
                                                    onMouseEnter: () => {
                                                        if (drag.draggingKey) return;
                                                        updateSelect(actualRi, ci);
                                                    },
                                                    onContextMenu: (e: React.MouseEvent) => {
                                                        if (drag.draggingKey) return;

                                                        e.preventDefault();
                                                        e.stopPropagation();

                                                        const alreadySelected = isCellSelected(actualRi, ci);

                                                        if (!alreadySelected) {
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
                                                    },
                                                    style: {
                                                        backgroundColor: cellBg,
                                                        color: rowStyleRaw.color,
                                                        ...getShiftStyle(colKey),
                                                        ...getPinnedStyle(colKey, cellBg ?? getThemeColor('White1')),
                                                        ...(isIndentTarget ? { paddingLeft: indentPadding } : {}),
                                                    },
                                                };

                                                return useFullCellAnimation ? (
                                                    <motion.div
                                                        key={cellKey}
                                                        layout
                                                        layoutId={`air-cell-${rowKey}-${colKey}`}
                                                        transition={{
                                                            duration: 0.26,
                                                            ease: [0.22, 1, 0.36, 1],
                                                        }}
                                                        {...cellProps}
                                                    >
                                                        {cell.render(row.item, actualRi, meta)}
                                                    </motion.div>
                                                ) : (
                                                    <div key={cellKey} {...cellProps}>
                                                        {cell.render(row.item, actualRi, meta)}
                                                    </div>
                                                );
                                            })}
                                        </motion.div>

                                        {canExpand && (
                                            <ExpandableDetailRow
                                                expanded={expanded}
                                                gridTemplateColumns={gridTemplateColumns}
                                                rowClassName={detailRowClassName}
                                                cellClassName={detailCellClassName}
                                            >
                                                {detailRenderer?.({ row: row.item, ri: actualRi })}
                                            </ExpandableDetailRow>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </AnimatePresence>
                    ) : (
                        rowsToRender.map((row, ri) => {
                            const actualRi = rowIndexOffset + ri;
                            const canExpand =
                                !!detailRenderer && (getRowCanExpand ? getRowCanExpand(row.item, actualRi) : true);
                            const expanded = canExpand && isRowExpanded(row.key);

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
                                    isRowExpanded={isRowExpanded}
                                    indentTargetKey={indentTargetKey}
                                    canExpand={canExpand}
                                    expanded={expanded}
                                />
                            );
                        })
                    )}
                    {paddingBottom > 0 && <div style={{ height: paddingBottom }} />}
                </div>
            </div>
        </div>
    );
};
