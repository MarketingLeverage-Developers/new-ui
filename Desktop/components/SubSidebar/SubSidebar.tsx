import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './SubSidebar.module.scss';

type SubSidebarProps = {
    children: React.ReactNode;
};

const STORAGE_KEY = 'ml:desktop:subSidebarWidthPx';
const DEFAULT_WIDTH_PX = 220;
const MIN_WIDTH_PX = 160;
const MAX_WIDTH_PX = 480;

const clampWidth = (value: number) => Math.min(MAX_WIDTH_PX, Math.max(MIN_WIDTH_PX, value));

export const SubSidebar = ({ children }: SubSidebarProps) => {
    const sidebarRef = useRef<HTMLElement | null>(null);
    const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);
    const latestWidthRef = useRef<number>(DEFAULT_WIDTH_PX);

    const [widthPx, setWidthPx] = useState<number>(DEFAULT_WIDTH_PX);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        try {
            if (typeof window === 'undefined') return;
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = Number(raw);
            if (!Number.isFinite(parsed)) return;
            const next = clampWidth(parsed);
            latestWidthRef.current = next;
            setWidthPx(next);
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        if (!isResizing) return;
        if (typeof document === 'undefined') return;

        const { body } = document;
        const prevCursor = body.style.cursor;
        const prevUserSelect = body.style.userSelect;

        body.style.cursor = 'col-resize';
        body.style.userSelect = 'none';

        return () => {
            body.style.cursor = prevCursor;
            body.style.userSelect = prevUserSelect;
        };
    }, [isResizing]);

    const persistWidth = useCallback((nextWidth: number) => {
        try {
            if (typeof window === 'undefined') return;
            window.localStorage.setItem(STORAGE_KEY, String(nextWidth));
        } catch {
            // ignore
        }
    }, []);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        const drag = dragRef.current;
        if (!drag) return;
        const delta = e.clientX - drag.startX;
        const next = clampWidth(drag.startWidth + delta);

        latestWidthRef.current = next;
        setWidthPx(next);
    }, []);

    const stopDragging = useCallback(() => {
        dragRef.current = null;
        setIsResizing(false);
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', stopDragging);
        window.removeEventListener('pointercancel', stopDragging);
        persistWidth(latestWidthRef.current);
    }, [handlePointerMove, persistWidth]);

    useEffect(
        () => () => {
            if (typeof window === 'undefined') return;
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', stopDragging);
            window.removeEventListener('pointercancel', stopDragging);
        },
        [handlePointerMove, stopDragging]
    );

    const startDragging = useCallback(
        (e: React.PointerEvent<HTMLDivElement>) => {
            if (e.button !== 0) return;
            e.preventDefault();
            e.stopPropagation();

            const currentWidth = sidebarRef.current?.getBoundingClientRect().width ?? widthPx;
            dragRef.current = { startX: e.clientX, startWidth: currentWidth };
            setIsResizing(true);

            window.addEventListener('pointermove', handlePointerMove);
            window.addEventListener('pointerup', stopDragging);
            window.addEventListener('pointercancel', stopDragging);
        },
        [handlePointerMove, stopDragging, widthPx]
    );

    const resetWidth = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        latestWidthRef.current = DEFAULT_WIDTH_PX;
        setWidthPx(DEFAULT_WIDTH_PX);

        try {
            if (typeof window === 'undefined') return;
            window.localStorage.removeItem(STORAGE_KEY);
        } catch {
            // ignore
        }
    }, []);

    const style = useMemo<React.CSSProperties>(() => ({ width: `${widthPx}px` }), [widthPx]);

    return (
        <aside
            ref={sidebarRef}
            className={styles.SubSidebar}
            style={style}
            data-resizing={isResizing ? 'true' : 'false'}
        >
            {children}
            <div
                role="separator"
                aria-orientation="vertical"
                className={styles.ResizeHandle}
                onPointerDown={startDragging}
                onDoubleClick={resetWidth}
            />
        </aside>
    );
};
