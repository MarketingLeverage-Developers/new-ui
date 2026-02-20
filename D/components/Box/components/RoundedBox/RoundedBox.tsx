import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './RoundedBox.module.scss';

import type { CSSVariables } from '../../../../../shared/types/css/CSSVariables';
import { toCssPadding } from '../../../../../shared/utils/css/toCssPadding';
import { toCssUnit } from '../../../../../shared/utils';
import type { BoxCommonProps } from '../../Box';

export type RoundedBoxExtraProps = {
    scrollable?: boolean;
    radius?: number;
    shadow?: boolean;
    background?: string;
};

type RoundedBoxProps = BoxCommonProps & RoundedBoxExtraProps;

const RoundedBox: React.FC<RoundedBoxProps> = ({
    children,
    className,
    style,
    width,
    maxWidth,
    height,
    padding,
    margin,
    flex,
    minWidth,
    minHeight,
    scrollable = true,
    radius = 20,
    shadow = true,
    background,
    direction,
    align,
    justify,
    gap,
    wrap,
    ...rest
}) => {
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const railRef = useRef<HTMLDivElement | null>(null);
    const [contentHeight, setContentHeight] = useState(0);
    const syncingRef = useRef<'view' | 'rail' | null>(null);

    const rootClassName = classNames(styles.Container, className);
    const cardClassName = classNames(styles.RoundedBox, {
        [styles.NoShadow]: !shadow,
    });

    useEffect(() => {
        if (!scrollable) return;

        const viewport = viewportRef.current;
        if (!viewport) return;

        const observedChildren = new Set<Element>();

        const update = () => {
            const nextHeight = viewport.scrollHeight;
            setContentHeight((prev) => (prev === nextHeight ? prev : nextHeight));

            if (!railRef.current) return;

            const ratio = viewport.scrollTop / Math.max(1, viewport.scrollHeight - viewport.clientHeight);
            const target = ratio * Math.max(0, railRef.current.scrollHeight - railRef.current.clientHeight);
            syncingRef.current = 'view';
            railRef.current.scrollTop = target;
            syncingRef.current = null;
        };

        update();

        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(viewport);

        const syncChildObservers = () => {
            Array.from(viewport.children).forEach((child) => {
                if (observedChildren.has(child)) return;
                observedChildren.add(child);
                resizeObserver.observe(child);
            });

            for (const child of Array.from(observedChildren)) {
                if (viewport.contains(child)) continue;
                observedChildren.delete(child);
                resizeObserver.unobserve(child);
            }
        };

        syncChildObservers();

        const mutationObserver = new MutationObserver(() => {
            syncChildObservers();
            update();
        });
        mutationObserver.observe(viewport, { childList: true });

        const onScroll = () => {
            if (syncingRef.current === 'rail') return;
            update();
        };

        viewport.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            viewport.removeEventListener('scroll', onScroll);
            mutationObserver.disconnect();
            resizeObserver.disconnect();
        };
    }, [scrollable]);

    useEffect(() => {
        if (!scrollable) return;

        const viewport = viewportRef.current;
        const rail = railRef.current;
        if (!viewport || !rail) return;

        const onRailScroll = () => {
            if (syncingRef.current === 'view') return;

            const ratio = rail.scrollTop / Math.max(1, rail.scrollHeight - rail.clientHeight);
            const target = ratio * Math.max(0, viewport.scrollHeight - viewport.clientHeight);
            syncingRef.current = 'rail';
            viewport.scrollTop = target;
            syncingRef.current = null;
        };

        rail.addEventListener('scroll', onRailScroll, { passive: true });
        return () => rail.removeEventListener('scroll', onRailScroll);
    }, [contentHeight, scrollable]);

    const mergedStyle = useMemo(() => {
        const cssVariables: CSSVariables = {
            '--width': toCssUnit(width),
            '--max-width': toCssUnit(maxWidth),
            '--height': toCssUnit(height),
            '--padding': toCssPadding(padding),
            '--margin': toCssPadding(margin),
            '--flex': flex,
            '--min-width': toCssUnit(minWidth),
            '--min-height': toCssUnit(minHeight),
            '--radius': toCssUnit(radius),
            '--bg': background,
            '--flex-direction': direction,
            '--align-items': align,
            '--justify-content': justify,
            '--wrap': wrap,
            '--gap': toCssUnit(gap),
        };
        return {
            ...cssVariables,
            ...style,
        };
    }, [
        width,
        maxWidth,
        height,
        padding,
        margin,
        flex,
        minWidth,
        minHeight,
        radius,
        background,
        direction,
        align,
        justify,
        wrap,
        gap,
        style,
    ]);

    return (
        <div {...rest} className={rootClassName} style={mergedStyle}>
            <div className={cardClassName}>
                <div ref={viewportRef} className={scrollable ? styles.Viewport : styles.NoScroll}>
                    {children}
                </div>
            </div>
            {scrollable ? (
                <div ref={railRef} className={styles.ExternalScrollbar} aria-hidden>
                    <div style={{ height: contentHeight }} />
                </div>
            ) : null}
        </div>
    );
};

export default RoundedBox;
