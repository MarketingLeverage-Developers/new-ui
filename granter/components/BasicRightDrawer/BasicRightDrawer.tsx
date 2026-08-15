import React, { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Modal from '../../../shared/headless/Modal/Modal';
import Portal from '../../../shared/headless/Portal/Portal';
import styles from './BasicRightDrawer.module.scss';

export type BasicRightDrawerProps = {
    open: boolean;
    onChange: () => void;
    content: React.ReactNode;
    keepMounted?: boolean;
    width?: string | number;
    maxHeight?: string | number;
    enterAction?: () => void;
    lockBodyScroll?: boolean;
    closeOnEsc?: boolean;
    contentClassName?: string;
    backdropClassName?: string;
    resizable?: boolean;
    resizeDefaultWidth?: number;
    resizeMinWidth?: number;
    resizeMaxWidth?: number;
    resizeViewportOffset?: number;
};

const BasicRightDrawer = ({
    open,
    onChange,
    content,
    keepMounted = false,
    width = 560,
    maxHeight = '100%',
    enterAction,
    lockBodyScroll = true,
    closeOnEsc = true,
    contentClassName,
    backdropClassName,
    resizable = false,
    resizeDefaultWidth,
    resizeMinWidth,
    resizeMaxWidth,
    resizeViewportOffset = 0,
}: BasicRightDrawerProps) => {
    const [resizedWidth, setResizedWidth] = useState<number | null>(null);
    const [resizing, setResizing] = useState(false);
    const dragCleanupRef = useRef<(() => void) | null>(null);
    const defaultResizableWidth = resizeDefaultWidth ?? (typeof width === 'number' ? width : 560);
    const minimumResizableWidth = resizeMinWidth ?? defaultResizableWidth;

    const getMaximumResizableWidth = useCallback(
        () =>
            Math.min(
                resizeMaxWidth ?? Number.POSITIVE_INFINITY,
                Math.max(320, window.innerWidth - Math.max(0, resizeViewportOffset))
            ),
        [resizeMaxWidth, resizeViewportOffset]
    );
    const clampWidth = useCallback(
        (nextWidth: number) => Math.min(getMaximumResizableWidth(), Math.max(minimumResizableWidth, nextWidth)),
        [getMaximumResizableWidth, minimumResizableWidth]
    );

    useEffect(() => {
        if (!open) setResizedWidth(null);
    }, [open]);

    useEffect(() => {
        setResizedWidth(null);
    }, [defaultResizableWidth]);

    useEffect(
        () => () => {
            dragCleanupRef.current?.();
        },
        []
    );

    const effectiveResizableWidth = clampWidth(resizedWidth ?? defaultResizableWidth);

    const startResize = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!resizable || event.button !== 0) return;
        event.preventDefault();

        dragCleanupRef.current?.();

        const startX = event.clientX;
        const drawer = event.currentTarget.parentElement;
        const startWidth = drawer?.getBoundingClientRect().width ?? effectiveResizableWidth;
        const previousCursor = document.body.style.cursor;
        const previousUserSelect = document.body.style.userSelect;

        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        setResizing(true);

        const handlePointerMove = (moveEvent: PointerEvent) => {
            setResizedWidth(clampWidth(startWidth + startX - moveEvent.clientX));
        };
        const cleanup = () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', cleanup);
            window.removeEventListener('pointercancel', cleanup);
            document.body.style.cursor = previousCursor;
            document.body.style.userSelect = previousUserSelect;
            setResizing(false);
            dragCleanupRef.current = null;
        };

        dragCleanupRef.current = cleanup;
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', cleanup);
        window.addEventListener('pointercancel', cleanup);
    };

    const resizeByKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!resizable || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
        event.preventDefault();
        const delta = event.key === 'ArrowLeft' ? 24 : -24;
        setResizedWidth((currentWidth) => clampWidth((currentWidth ?? defaultResizableWidth) + delta));
    };

    if (!open && !keepMounted) {
        return null;
    }

    const resizeStyle = resizable
        ? ({ '--right-drawer-resizable-width': `${effectiveResizableWidth}px` } as React.CSSProperties)
        : undefined;

    return (
        <Modal
            value={open}
            onChange={(nextOpen) => {
                if (!nextOpen) onChange();
            }}
            enterAction={enterAction}
            lockBodyScroll={lockBodyScroll}
            closeOnEsc={closeOnEsc}
        >
            <Portal>
                <Modal.Backdrop className={classNames(styles.TransparentBackdrop, backdropClassName)} />
                <Modal.Content
                    width={width}
                    height="100vh"
                    maxHeight={maxHeight}
                    className={classNames(styles.RightDrawerContent, contentClassName, {
                        [styles.ResizableRightDrawer]: resizable,
                    })}
                    style={resizeStyle}
                    data-open={open ? 'true' : 'false'}
                    data-resizing={resizing ? 'true' : undefined}
                >
                    {resizable ? (
                        <div
                            className={styles.ResizeHandle}
                            role="separator"
                            aria-label="상세 영역 너비 조절"
                            aria-orientation="vertical"
                            aria-valuemin={Math.min(minimumResizableWidth, getMaximumResizableWidth())}
                            aria-valuemax={getMaximumResizableWidth()}
                            aria-valuenow={Math.round(effectiveResizableWidth)}
                            tabIndex={0}
                            onPointerDown={startResize}
                            onKeyDown={resizeByKeyboard}
                        />
                    ) : null}
                    {content}
                </Modal.Content>
            </Portal>
        </Modal>
    );
};

export default BasicRightDrawer;
