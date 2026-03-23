import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MIN_COL_WIDTH, useAirTableContext } from '../AirTable';
import type { CellRenderMeta, FilterState, SortConfig, SortDirection, SortValue } from '../AirTable';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { VscFilter, VscFilterFilled } from 'react-icons/vsc';
import { getThemeColor } from '../../../utils/css/getThemeColor';
import { motion } from 'framer-motion';

type HeaderProps = {
    className?: string;
    headerCellClassName?: string;
    resizeHandleClassName?: string;
};

const stopOnly = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
};

const isHeaderActionTarget = (target: EventTarget | null) => {
    const el = target as HTMLElement | null;
    if (!el) return false;
    return !!el.closest('[data-col-menu-btn],[data-col-sort-btn],[data-col-resize-handle]');
};

const SortIcon = ({
    direction,
    activeColor,
}: {
    direction: SortDirection | null;
    activeColor: string;
}) => {
    if (direction === 'asc') {
        return <FaArrowUp size={12} color={activeColor} aria-hidden="true" />;
    }

    if (direction === 'desc') {
        return <FaArrowDown size={12} color={activeColor} aria-hidden="true" />;
    }

    return null;
};

const hasActiveFilter = (value?: FilterState[string]) =>
    (value?.included?.length ?? 0) > 0 || (value?.excluded?.length ?? 0) > 0;

const getIncludedFilterSet = (options: { key: string }[], value?: FilterState[string]) => {
    const included = new Set((value?.included ?? []).map(String));
    if (included.size > 0) return included;

    const excluded = new Set((value?.excluded ?? []).map(String));
    if (excluded.size === 0) return new Set<string>();

    return new Set(options.map((option) => option.key).filter((key) => !excluded.has(key)));
};

const DefaultColumnFilter = <T,>({
    colKey,
    data,
    columnByKey,
    sortConfigByKey,
    filterState,
    setFilterState,
}: {
    colKey: string;
    data: T[];
    columnByKey: Map<
        string,
        { render: (item: T, index: number, meta: CellRenderMeta<T>) => React.ReactElement }
    >;
    sortConfigByKey: Map<string, SortConfig<T>>;
    filterState: FilterState;
    setFilterState: (next: FilterState) => void;
}) => {
    const [keyword, setKeyword] = useState('');
    const config = sortConfigByKey.get(colKey);

    useEffect(() => {
        setKeyword('');
    }, [colKey]);

    const options = useMemo(() => {
        if (!config?.sortValue) return [];
        const map = new Map<string, { key: string; label: string; count: number }>();
        const column = columnByKey.get(colKey);
        const fallbackMeta: CellRenderMeta<T> = {
            rowKey: '',
            ri: 0,
            level: 0,
            toggleRowExpanded: () => undefined,
            isRowExpanded: () => false,
        };

        data.forEach((row, index) => {
            const raw = config.sortValue ? config.sortValue(row) : undefined;
            const key = getFilterKey(raw);
            let label = '';
            if (column?.render) {
                const meta = { ...fallbackMeta, rowKey: `filter-${colKey}-${index}`, ri: index };
                const rendered = column.render(row, index, meta);
                label = extractTextFromNode(rendered).trim();
            }
            if (!label) {
                label = formatFilterLabel(raw);
            }
            const prev = map.get(key);
            if (prev) {
                prev.count += 1;
            } else {
                map.set(key, { key, label, count: 1 });
            }
        });

        const list = Array.from(map.values());
        list.sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }));
        return list;
    }, [config, data, colKey, columnByKey]);

    const filteredOptions = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return options;
        return options.filter((opt) => opt.label.toLowerCase().includes(q));
    }, [options, keyword]);

    const currentFilter = filterState[colKey];
    const includedSet = useMemo(() => getIncludedFilterSet(options, currentFilter), [options, currentFilter]);
    const selectedCount = includedSet.size;
    const isFilterApplied = hasActiveFilter(currentFilter);

    const toggleInclude = (key: string) => {
        const nextIncluded = new Set(includedSet);
        if (nextIncluded.has(key)) nextIncluded.delete(key);
        else nextIncluded.add(key);

        const nextState = { ...filterState };
        if (nextIncluded.size === 0) {
            delete nextState[colKey];
        } else {
            nextState[colKey] = { included: Array.from(nextIncluded) };
        }
        setFilterState(nextState);
    };

    const clearFilter = () => {
        if (!filterState[colKey]) return;
        const nextState = { ...filterState };
        delete nextState[colKey];
        setFilterState(nextState);
    };

    const selectAll = () => {
        if (options.length === 0) return;
        const nextState = { ...filterState, [colKey]: { included: options.map((opt) => opt.key) } };
        setFilterState(nextState);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="값 검색"
                style={{
                    width: '100%',
                    height: 34,
                    padding: '0 10px',
                    borderRadius: 8,
                    border: '1px solid rgba(0,0,0,0.12)',
                    outline: 'none',
                    fontSize: 13,
                }}
            />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    maxHeight: 240,
                    overflowY: 'auto',
                }}
            >
                {filteredOptions.length === 0 ? (
                    <div style={{ padding: '8px 4px', color: getThemeColor('Gray2'), fontSize: 12 }}>
                        결과 없음
                    </div>
                ) : (
                    filteredOptions.map((opt) => {
                        const checked = includedSet.has(opt.key);
                        return (
                            <label
                                key={opt.key || '__empty__'}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    background: checked ? 'rgba(59,130,246,0.08)' : 'transparent',
                                    borderRadius: 6,
                                    padding: '6px 8px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 12,
                                    fontSize: 12,
                                    color: getThemeColor('Black1'),
                                }}
                                title={opt.label}
                            >
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        minWidth: 0,
                                        flex: 1,
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleInclude(opt.key)}
                                        style={{
                                            width: 14,
                                            height: 14,
                                            cursor: 'pointer',
                                        }}
                                    />
                                    <span
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            color: checked ? getThemeColor('Black1') : getThemeColor('Gray2'),
                                        }}
                                    >
                                        {opt.label}
                                    </span>
                                </span>
                                <span style={{ color: getThemeColor('Gray3'), fontSize: 11 }}>{opt.count}</span>
                            </label>
                        );
                    })
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: getThemeColor('Gray2') }}>
                    {isFilterApplied ? `선택 ${selectedCount} / 전체 ${options.length}` : '미선택 시 전체 표시'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                        type="button"
                        onClick={selectAll}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            color: getThemeColor('Gray2'),
                            fontSize: 12,
                            cursor: 'pointer',
                        }}
                    >
                        전체 선택
                    </button>
                    <button
                        type="button"
                        onClick={clearFilter}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            color: getThemeColor('Primary1'),
                            fontSize: 12,
                            cursor: 'pointer',
                        }}
                    >
                        초기화
                    </button>
                </div>
            </div>
        </div>
    );
};

const ColumnFilterPopup = ({
    isOpen,
    x,
    y,
    onClose,
    children,
}: {
    isOpen: boolean;
    x: number;
    y: number;
    onClose: () => void;
    children: React.ReactNode;
}) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleDown = (ev: MouseEvent) => {
            const el = ref.current;
            if (!el) return;
            if (el.contains(ev.target as Node)) return;
            onClose();
        };

        const handleEsc = (ev: KeyboardEvent) => {
            if (ev.key === 'Escape') onClose();
        };

        window.addEventListener('mousedown', handleDown);
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('mousedown', handleDown);
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            ref={ref}
            style={{
                position: 'fixed',
                top: y,
                left: x,
                minWidth: 240,
                background: getThemeColor('White1'),
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 10,
                boxShadow: '0 12px 24px rgba(0,0,0,0.14)',
                zIndex: 2147483647,
                padding: 10,
                cursor: 'default',
            }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {children}
        </div>,
        document.body
    );
};

const formatFilterLabel = (value: SortValue): string => {
    if (value === null || value === undefined || value === '') return '없음';
    if (value instanceof Date) return value.toLocaleString();
    return String(value);
};

const getFilterKey = (value: SortValue): string => {
    if (value === null || value === undefined) return '';
    if (value instanceof Date) return String(value.getTime());
    return String(value);
};

const extractTextFromNode = (node: React.ReactNode): string => {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
    if (React.isValidElement(node)) {
        return extractTextFromNode(node.props?.children);
    }
    return '';
};

const itemStyle: React.CSSProperties = {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    padding: '10px 10px',
    textAlign: 'left',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
};

const HeaderContextMenu = ({
    isOpen,
    x,
    y,
    onClose,
    isPinned,
    showPinAction,
    onPin,
    onUnpin,
    onHide,
}: {
    isOpen: boolean;
    x: number;
    y: number;
    onClose: () => void;
    isPinned: boolean;
    showPinAction: boolean;
    onPin: () => void;
    onUnpin: () => void;
    onHide: () => void;
}) => {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleDown = (ev: MouseEvent) => {
            const el = ref.current;
            if (!el) return;
            if (el.contains(ev.target as Node)) return;
            onClose();
        };

        const handleEsc = (ev: KeyboardEvent) => {
            if (ev.key === 'Escape') onClose();
        };

        window.addEventListener('mousedown', handleDown);
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('mousedown', handleDown);
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            ref={ref}
            style={{
                position: 'fixed',
                top: y,
                left: x,
                minWidth: 160,
                background: getThemeColor('White1'),
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 10,
                boxShadow: '0 12px 24px rgba(0,0,0,0.14)',
                zIndex: 2147483647,
                padding: 6,
                cursor: 'default',
                userSelect: 'none',
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
        >
            {showPinAction && (
                <button
                    type="button"
                    style={itemStyle}
                    onClick={() => {
                        if (isPinned) onUnpin();
                        else onPin();
                        onClose();
                    }}
                >
                    {isPinned ? '고정 해제' : '컬럼 고정'}
                </button>
            )}
            <button
                type="button"
                style={itemStyle}
                onClick={() => {
                    onHide();
                    onClose();
                }}
            >
                컬럼 숨기기
            </button>
        </div>,
        document.body
    );
};

export const Header = <T,>({ className, headerCellClassName, resizeHandleClassName }: HeaderProps) => {
    const {
        props,
        state,
        baseOrder,
        gridTemplateColumns,
        widthByKey,
        baseXByKey,
        resizeRef,
        getXInGrid,
        getYInGrid,
        getShiftStyle,
        getPinnedStyle,
        setGhost,
        ghost,
        scrollRef,
        pinnedColumnKeys,
        setPinnedColumnKeys,
        sortState,
        setSortState,
        sortConfigByKey,
        filterState,
        setFilterState,
    } = useAirTableContext<T>();

    const { data, defaultColWidth = 160 } = props;
    const filterOptionsData = props.filterOptionsData ?? data;
    const { groupColumnRow, columnRow, startColumnDrag, visibleColumnKeys, setVisibleColumnKeys } = state;
    const columnByKey = useMemo(
        () => new Map(state.allLeafColumns.map((col) => [col.key, col])),
        [state.allLeafColumns]
    );

    const enableAnimation = props.enableAnimation ?? false;
    const resolveColumnUnderline = useCallback(
        (colKey: string): string | undefined => {
            const column = columnByKey.get(colKey);
            const underline = column?.headerUnderline;
            if (!underline) return undefined;

            let isActive = true;
            if (typeof underline.active === 'boolean') {
                isActive = underline.active;
            } else if ((underline.activeWhenAnyVisibleKeys ?? []).length > 0) {
                isActive = underline.activeWhenAnyVisibleKeys!.some((key) => visibleColumnKeys.includes(String(key)));
            }

            if (!isActive) return undefined;

            const width = Math.max(1, Number(underline.width ?? 2));
            const color = underline.color ?? getThemeColor('Primary1');
            return `inset 0 -${width}px 0 ${color}`;
        },
        [columnByKey, visibleColumnKeys]
    );

    const resolvePinnedHeaderColor = useCallback(
        (
            value: string | ((colKey: string) => string | undefined) | undefined,
            colKey: string
        ): string | undefined => (typeof value === 'function' ? value(colKey) : value),
        []
    );

    const isDragging = !!state.drag.draggingKey;
    const MOVE_THRESHOLD_PX = 6;
    const isDraggingMoved =
        isDragging &&
        !!ghost &&
        (Math.abs(ghost.offsetX ?? 0) >= MOVE_THRESHOLD_PX || Math.abs(ghost.offsetY ?? 0) >= MOVE_THRESHOLD_PX);

    const [filterPopup, setFilterPopup] = useState<{
        open: boolean;
        colKey: string | null;
        x: number;
        y: number;
    }>({ open: false, colKey: null, x: 0, y: 0 });

    const [contextMenu, setContextMenu] = useState<{
        open: boolean;
        colKey: string | null;
        x: number;
        y: number;
    }>({ open: false, colKey: null, x: 0, y: 0 });

    const headerLabelRefMap = useRef<Record<string, HTMLDivElement | null>>({});
    const [minWidthByKey, setMinWidthByKey] = useState<Record<string, number>>({});

    useEffect(() => {
        const next: Record<string, number> = {};

        baseOrder.forEach((key) => {
            const el = headerLabelRefMap.current[key];
            if (!el) return;

            const labelWidth = el.scrollWidth;
            const extraPadding = 44;
            const nextMin = Math.ceil(labelWidth + extraPadding);

            next[key] = Math.max(MIN_COL_WIDTH, nextMin);
        });

        setMinWidthByKey(next);
    }, [baseOrder]);

    const openFilter = useCallback((colKey: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();

        setFilterPopup({
            open: true,
            colKey,
            x: rect.left - 200,
            y: rect.bottom + 8,
        });
    }, []);

    const closeFilter = useCallback(() => {
        setFilterPopup((prev) => ({ ...prev, open: false }));
    }, []);

    const handleContextMenu = useCallback(
        (colKey: string) => (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            setContextMenu({
                open: true,
                colKey,
                x: e.clientX,
                y: e.clientY,
            });
        },
        []
    );

    const closeContextMenu = useCallback(() => {
        setContextMenu((prev) => ({ ...prev, open: false }));
    }, []);

    const handlePin = useCallback(() => {
        const colKey = contextMenu.colKey;
        if (!colKey) return;
        const column = columnByKey.get(colKey);
        if (column?.disablePinning) return;
        if (pinnedColumnKeys.includes(colKey)) return;
        setPinnedColumnKeys([...pinnedColumnKeys, colKey]);
    }, [contextMenu.colKey, columnByKey, pinnedColumnKeys, setPinnedColumnKeys]);

    const handleUnpin = useCallback(() => {
        const colKey = contextMenu.colKey;
        if (!colKey) return;
        setPinnedColumnKeys(pinnedColumnKeys.filter((k) => k !== colKey));
    }, [contextMenu.colKey, pinnedColumnKeys, setPinnedColumnKeys]);

    const handleHide = useCallback(() => {
        const colKey = contextMenu.colKey;
        if (!colKey) return;

        const next = visibleColumnKeys.filter((k) => k !== colKey);
        setVisibleColumnKeys(next);

        if (pinnedColumnKeys.includes(colKey)) {
            setPinnedColumnKeys(pinnedColumnKeys.filter((k) => k !== colKey));
        }
    }, [contextMenu.colKey, visibleColumnKeys, setVisibleColumnKeys, pinnedColumnKeys, setPinnedColumnKeys]);

    const handleSortToggle = useCallback(
        (colKey: string) => {
            if (!sortConfigByKey.has(colKey)) return;

            const current = sortState?.key === colKey ? sortState.direction : null;
            const nextDirection = current === null ? 'asc' : current === 'asc' ? 'desc' : null;

            setSortState(nextDirection ? { key: colKey, direction: nextDirection } : null);
        },
        [sortState, setSortState, sortConfigByKey]
    );

    const sortActiveColor = getThemeColor('Primary1');

    const handleResizeMouseDown = useCallback(
        (colKey: string) => (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            const startX = getXInGrid(e.clientX);
            const startWidth = widthByKey[colKey] ?? defaultColWidth;

            resizeRef.current = { key: colKey, startX, startWidth };
        },
        [getXInGrid, widthByKey, defaultColWidth, resizeRef]
    );

    const handleResizeDoubleClick = useCallback(
        (colKey: string) => (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            const minW = minWidthByKey[colKey] ?? MIN_COL_WIDTH;
            state.resizeColumn(colKey, minW);
        },
        [minWidthByKey, state]
    );

    const handleHeaderMouseDown = (colKey: string) => (e: React.MouseEvent<HTMLDivElement>) => {
        if (resizeRef.current) return;
        if (e.button !== 0) return;

        e.preventDefault();
        e.stopPropagation();

        const x = getXInGrid(e.clientX);
        const y = getYInGrid(e.clientY);

        startColumnDrag(colKey, x);

        const w = widthByKey[colKey] ?? defaultColWidth;
        const scrollTop = scrollRef.current?.scrollTop ?? 0;

        setGhost({
            key: colKey,
            startX: x,
            startY: y,
            offsetX: 0,
            offsetY: 0,
            width: Math.max(MIN_COL_WIDTH, w),
            leftInGrid: baseXByKey[colKey] ?? 0,
            topInGrid: scrollTop,
        });
    };

    const handleHeaderClick = useCallback(
        (colKey: string) => (e: React.MouseEvent<HTMLDivElement>) => {
            if (resizeRef.current) return;
            if (state.drag.draggingKey) return;
            if (isHeaderActionTarget(e.target)) return;
            if (!sortConfigByKey.has(colKey)) return;
            handleSortToggle(colKey);
        },
        [handleSortToggle, resizeRef, sortConfigByKey, state.drag.draggingKey]
    );

    const activeFilterContent = useMemo(() => {
        if (!filterPopup.open || !filterPopup.colKey) return null;
        const col = columnRow.columns.find((c) => c.key === filterPopup.colKey);
        if (!col) return null;
        if (col.filter) return col.filter;
        if (!sortConfigByKey.get(col.key)?.sortValue) return null;
        return (
            <DefaultColumnFilter<T>
                colKey={col.key}
                data={filterOptionsData}
                columnByKey={columnByKey}
                sortConfigByKey={sortConfigByKey}
                filterState={filterState}
                setFilterState={setFilterState}
            />
        );
    }, [
        filterPopup.open,
        filterPopup.colKey,
        columnRow.columns,
        sortConfigByKey,
        filterOptionsData,
        columnByKey,
        filterState,
        setFilterState,
    ]);

    const isContextPinned = useMemo(() => {
        if (!contextMenu.colKey) return false;
        return pinnedColumnKeys.includes(contextMenu.colKey);
    }, [contextMenu.colKey, pinnedColumnKeys]);

    const canContextPin = useMemo(() => {
        if (!contextMenu.colKey) return false;
        return !columnByKey.get(contextMenu.colKey)?.disablePinning;
    }, [contextMenu.colKey, columnByKey]);

    const OuterWrapper = enableAnimation ? motion.div : 'div';
    const HeaderCellWrapper = enableAnimation ? motion.div : 'div';
    const hasGroupHeader = groupColumnRow.columns.length > 0;
    const groupHeaderHeight = hasGroupHeader ? 40 : 0;
    const mirroredGroupHeaderKeySet = useMemo(
        () => new Set(groupColumnRow.columns.map((column) => column.key)),
        [groupColumnRow.columns]
    );

    return (
        <>
            <div
                className={className}
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 120,
                    overflow: 'visible',
                    width: 'fit-content',
                    minWidth: '100%',
                }}
            >
                {hasGroupHeader ? (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns,
                            minWidth: 'fit-content',
                            width: 'fit-content',
                        }}
                    >
                        {groupColumnRow.columns.map((col, index) => (
                            <div
                                key={`g-${col.key}-${index}`}
                                data-col-key={col.key}
                                className={[headerCellClassName, 'air-table-group-header-cell'].filter(Boolean).join(' ')}
                                style={{
                                    gridColumn: `span ${col.colSpan}`,
                                    minHeight: groupHeaderHeight,
                                    height: groupHeaderHeight,
                                    justifyContent: 'center',
                                    alignItems: 'stretch',
                                    padding: 0,
                                    borderBottom: '1px solid rgba(148, 163, 184, 0.22)',
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                        height: '100%',
                                        minWidth: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {col.render(col.key, data)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : null}
                <OuterWrapper
                    {...(enableAnimation
                        ? {
                              layout: !isDragging,
                              transition: { duration: 0.26, ease: [0.22, 1, 0.36, 1] },
                          }
                        : {})}
                    style={{
                        display: 'grid',
                        gridTemplateColumns,
                        minWidth: 'fit-content',
                        width: 'fit-content',
                    }}
                >
                    {baseOrder.map((colKey) => {
                        const col = columnRow.columns.find((c) => c.key === colKey);
                        if (!col) return null;

                        const shouldHideLeafHeaderLabel = hasGroupHeader && mirroredGroupHeaderKeySet.has(colKey);
                        const isPinned = pinnedColumnKeys.includes(colKey);
                        const underlineShadow = resolveColumnUnderline(colKey);
                        const pinnedHeaderBg = resolvePinnedHeaderColor(props.pinnedHeaderBgColor, colKey);
                        const pinnedHeaderTextColor = resolvePinnedHeaderColor(props.pinnedHeaderTextColor, colKey);
                        const sortConfig = sortConfigByKey.get(colKey);
                        const isSortable = !!sortConfig;
                        const sortDirection = sortState?.key === colKey ? sortState.direction : null;
                        const hasFilterButton = !!col.filter || !!sortConfig?.sortValue;
                        const isFilterActive = hasActiveFilter(filterState[colKey]);
                        const actionPaddingRight = 12 + (hasFilterButton ? 28 : 0) + (isSortable ? 24 : 0);
                        const sortButtonRight = hasFilterButton ? 42 : 14;
                        const pinnedStyle: React.CSSProperties = isPinned
                            ? {
                                  ...getPinnedStyle(colKey, pinnedHeaderBg ?? getThemeColor('Primary1'), {
                                      isHeader: true,
                                  }),
                                  ...(pinnedHeaderTextColor ? { color: pinnedHeaderTextColor } : {}),
                              }
                            : {};
                        const combinedBoxShadow = [pinnedStyle.boxShadow, underlineShadow]
                            .filter((shadow): shadow is string => typeof shadow === 'string' && shadow.length > 0)
                            .join(', ');

                        return (
                            <HeaderCellWrapper
                                {...(enableAnimation
                                    ? {
                                          layout: !isDragging ? 'position' : false,
                                          layoutId: `air-col-header-${colKey}`,
                                      }
                                    : {})}
                                key={`h-${colKey}`}
                                data-col-key={colKey}
                                className={[headerCellClassName, 'air-table-header-cell'].filter(Boolean).join(' ')}
                                style={{
                                    position: 'relative',
                                    cursor: isDraggingMoved ? 'grabbing' : 'pointer',
                                    userSelect: 'none',
                                    ...(isDragging ? getShiftStyle(colKey) : {}),
                                    ...pinnedStyle,
                                    ...(combinedBoxShadow ? { boxShadow: combinedBoxShadow } : {}),
                                }}
                                onMouseDown={handleHeaderMouseDown(colKey)}
                                onClick={handleHeaderClick(colKey)}
                                onContextMenu={handleContextMenu(colKey)}
                            >
                                <div
                                    data-col-header-content="true"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        paddingRight: actionPaddingRight,
                                        minWidth: 0,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div
                                        ref={(el) => {
                                            headerLabelRefMap.current[colKey] = el;
                                        }}
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {shouldHideLeafHeaderLabel ? null : col.render(colKey, data)}
                                    </div>
                                </div>

                                {isSortable && (
                                    <button
                                        type="button"
                                        data-col-sort-btn="true"
                                        onMouseDownCapture={stopOnly}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSortToggle(colKey);
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            right: sortButtonRight,
                                            width: 16,
                                            height: 16,
                                            borderRadius: 0,
                                            border: 'none',
                                            background: 'transparent',
                                            color: getThemeColor('Black1'),
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 40,
                                        }}
                                        title={
                                            sortDirection === 'asc'
                                                ? '오름차순'
                                                : sortDirection === 'desc'
                                                ? '내림차순'
                                                : '정렬'
                                        }
                                    >
                                        <SortIcon
                                            direction={sortDirection}
                                            activeColor={sortActiveColor}
                                        />
                                    </button>
                                )}

                                {hasFilterButton && (
                                    <button
                                        type="button"
                                        data-col-menu-btn="true"
                                        onMouseDownCapture={stopOnly}
                                        onClick={(e) => openFilter(colKey, e)}
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            right: 14,
                                            width: 18,
                                            height: 18,
                                            borderRadius: 0,
                                            border: 'none',
                                            background: 'transparent',
                                            color: getThemeColor('Black1'),
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 40,
                                        }}
                                        title="Filter"
                                    >
                                        {isFilterActive ? (
                                            <VscFilterFilled size={14} color={getThemeColor('Primary1')} />
                                        ) : (
                                            <VscFilter size={14} color={getThemeColor('Gray2')} />
                                        )}
                                    </button>
                                )}

                                <div
                                    className={resizeHandleClassName}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        width: 10,
                                        height: '100%',
                                        cursor: 'ew-resize',
                                        zIndex: 60,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    onMouseDown={handleResizeMouseDown(colKey)}
                                    onDoubleClick={handleResizeDoubleClick(colKey)}
                                    data-col-resize-handle="true"
                                >
                                    <div
                                        style={{
                                            width: 1,
                                            height: '50%',
                                            borderRadius: 2,
                                            background: 'rgba(0,0,0,0.18)',
                                        }}
                                    />
                                </div>
                            </HeaderCellWrapper>
                        );
                    })}
                </OuterWrapper>
            </div>

            <ColumnFilterPopup isOpen={filterPopup.open} x={filterPopup.x} y={filterPopup.y} onClose={closeFilter}>
                {activeFilterContent}
            </ColumnFilterPopup>

            <HeaderContextMenu
                isOpen={contextMenu.open}
                x={contextMenu.x}
                y={contextMenu.y}
                onClose={closeContextMenu}
                isPinned={isContextPinned}
                showPinAction={canContextPin}
                onPin={handlePin}
                onUnpin={handleUnpin}
                onHide={handleHide}
            />
        </>
    );
};
