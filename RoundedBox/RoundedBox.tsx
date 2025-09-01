import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import styles from './RoundedBox.module.scss';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import { toCssUnit } from '@/shared/utils';
import classNames from 'classnames';

type RoundedBoxProps = {
    width?: string | number;
    height?: string | number;
    padding?: PaddingSize | number;
    children?: React.ReactNode;
    scrollable?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const RoundedBox = ({
    width = 'auto',
    height = 'auto',
    padding,
    children,
    scrollable = true,
    className,
    style,
    ...props
}: RoundedBoxProps) => {
    const cssVariables: CSSVariables = useMemo(
        () => ({
            '--width': toCssUnit(width),
            '--height': toCssUnit(height),
            '--padding': toCssPadding(padding),
        }),
        [width, height, padding]
    );

    const viewportRef = useRef<HTMLDivElement | null>(null);
    const railRef = useRef<HTMLDivElement | null>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const syncingRef = useRef<'view' | 'rail' | null>(null);
    const roRef = useRef<ResizeObserver | null>(null);

    useEffect(() => {
        if (!scrollable) return;
        const vp = viewportRef.current;
        if (!vp) return;

        const update = () => {
            setContentHeight(vp.scrollHeight);
            if (railRef.current) {
                const ratio = vp.scrollTop / Math.max(1, vp.scrollHeight - vp.clientHeight);
                const target = ratio * Math.max(0, railRef.current.scrollHeight - railRef.current.clientHeight);
                syncingRef.current = 'view';
                railRef.current.scrollTop = target;
                syncingRef.current = null;
            }
        };

        update();

        const ro = new ResizeObserver(update);
        roRef.current = ro;
        ro.observe(vp);
        Array.from(vp.children).forEach((c) => ro.observe(c as Element));

        const onScroll = () => {
            if (syncingRef.current === 'rail') return;
            update();
        };
        vp.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            vp.removeEventListener('scroll', onScroll);
            ro.disconnect();
            roRef.current = null;
        };
    }, [scrollable, children]);

    useEffect(() => {
        if (!scrollable) return;
        const vp = viewportRef.current;
        const rail = railRef.current;
        if (!vp || !rail) return;

        const onRailScroll = () => {
            if (syncingRef.current === 'view') return;
            const ratio = rail.scrollTop / Math.max(1, rail.scrollHeight - rail.clientHeight);
            const target = ratio * Math.max(0, vp.scrollHeight - vp.clientHeight);
            syncingRef.current = 'rail';
            vp.scrollTop = target;
            syncingRef.current = null;
        };

        rail.addEventListener('scroll', onRailScroll, { passive: true });
        return () => rail.removeEventListener('scroll', onRailScroll);
    }, [scrollable, contentHeight]);

    return (
        <div {...props} className={classNames(styles.Container, className)} style={{ ...cssVariables, ...style }}>
            <div className={styles.RoundedBox}>
                <div ref={viewportRef} className={scrollable ? styles.Viewport : styles.NoScroll}>
                    {children}
                </div>
            </div>

            {scrollable && (
                <div ref={railRef} className={styles.ExternalScrollbar} aria-hidden>
                    <div style={{ height: contentHeight }} />
                </div>
            )}
        </div>
    );
};

export default RoundedBox;
