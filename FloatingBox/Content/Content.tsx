'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFloatingBox } from '../FloatingBox';
import styles from './Content.module.scss';

export type FBPosition = 'top' | 'bottom' | 'left' | 'right';

type ContentProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    position?: FBPosition;
    offset?: number;
    portal?: boolean;
};

const Content: React.FC<ContentProps> = ({ children, position = 'bottom', offset = 8, portal = true, ...props }) => {
    const { floatingBoxValue, closeFloatingBox, triggerRef } = useFloatingBox();
    const contentRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    // 위치 계산
    useLayoutEffect(() => {
        const trigger = triggerRef.current;
        const content = contentRef.current;
        if (!floatingBoxValue || !trigger || !content) return;

        const rect = trigger.getBoundingClientRect();
        const { offsetWidth, offsetHeight } = content;
        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = rect.top - offsetHeight - offset;
                left = rect.left;
                break;
            case 'bottom':
                top = rect.bottom + offset;
                left = rect.left;
                break;
            case 'left':
                top = rect.top;
                left = rect.left - offsetWidth - offset;
                break;
            case 'right':
                top = rect.top;
                left = rect.right + offset;
                break;
        }

        setCoords({ top, left });
    }, [floatingBoxValue, triggerRef, position, offset]);

    // 외부 클릭 닫기
    useEffect(() => {
        if (!floatingBoxValue) return;
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                contentRef.current &&
                !contentRef.current.contains(target) &&
                triggerRef.current &&
                !triggerRef.current.contains(target)
            ) {
                closeFloatingBox();
            }
        };
        window.addEventListener('mousedown', handleClickOutside);
        return () => window.removeEventListener('mousedown', handleClickOutside);
    }, [floatingBoxValue, closeFloatingBox]);

    if (!floatingBoxValue) return null;

    const box = (
        <div
            {...props}
            ref={contentRef}
            className={styles.Content}
            style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                zIndex: 1000,
                ...props.style,
            }}
        >
            {children}
        </div>
    );

    return portal ? createPortal(box, document.body) : box;
};

export default Content;
