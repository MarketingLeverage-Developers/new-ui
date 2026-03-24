import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

const RESIZE_HANDLE_SELECTOR = '[data-col-resize-handle="true"], [data-col-resize-handle]';
const HEADER_CLICK_SELECTOR = '.air-table-header-cell, [data-col-sort-btn="true"]';
const CLEAR_DELAY_MS = 80;

export const useSuppressPostResizeHeaderClick = () => {
    const resizingRef = useRef(false);
    const suppressNextHeaderClickRef = useRef(false);
    const clearTimerRef = useRef<number | null>(null);

    const clearSuppression = useCallback(() => {
        suppressNextHeaderClickRef.current = false;

        if (clearTimerRef.current !== null) {
            window.clearTimeout(clearTimerRef.current);
            clearTimerRef.current = null;
        }
    }, []);

    const scheduleClear = useCallback(() => {
        if (typeof window === 'undefined') return;

        if (clearTimerRef.current !== null) {
            window.clearTimeout(clearTimerRef.current);
        }

        clearTimerRef.current = window.setTimeout(() => {
            suppressNextHeaderClickRef.current = false;
            clearTimerRef.current = null;
        }, CLEAR_DELAY_MS);
    }, []);

    useEffect(
        () => () => {
            if (clearTimerRef.current !== null) {
                window.clearTimeout(clearTimerRef.current);
            }
        },
        []
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleMouseUp = () => {
            if (!resizingRef.current) return;

            resizingRef.current = false;
            suppressNextHeaderClickRef.current = true;
            scheduleClear();
        };

        window.addEventListener('mouseup', handleMouseUp, true);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp, true);
        };
    }, [scheduleClear]);

    const onMouseDownCapture = useCallback((event: ReactMouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement | null;
        if (!target?.closest(RESIZE_HANDLE_SELECTOR)) return;

        resizingRef.current = true;
        clearSuppression();
    }, [clearSuppression]);

    const onClickCapture = useCallback(
        (event: ReactMouseEvent<HTMLElement>) => {
            if (!suppressNextHeaderClickRef.current) return;

            const target = event.target as HTMLElement | null;
            if (!target?.closest(HEADER_CLICK_SELECTOR)) return;

            clearSuppression();
            event.preventDefault();
            event.stopPropagation();
        },
        [clearSuppression]
    );

    return {
        onMouseDownCapture,
        onClickCapture,
    };
};

export default useSuppressPostResizeHeaderClick;
