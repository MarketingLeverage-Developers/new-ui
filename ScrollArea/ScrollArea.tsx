import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import styles from './ScrollArea.module.scss';
import { toCssUnit } from '@/shared/utils';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';

type Snap = 'none' | 'proximity' | 'mandatory';
type Fade = 'none' | 'start' | 'end' | 'both' | 'auto';

export type ScrollAreaProps = {
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    gap?: number; // 아이템 간격(px)
    fade?: Fade; // 'none' | 'start' | 'end' | 'both'
    fadeSize?: number; // 페이드 길이(px), 기본 20
    snap?: Snap; // 스냅 동작
    hideScrollbar?: boolean; // 기본 true
    wheelYToX?: boolean; // 세로 휠을 가로 스크롤로 변환(기본 true)
};

const ScrollArea: React.FC<ScrollAreaProps> = ({
    children,
    className,
    contentClassName,
    gap = 8,
    fade = 'auto',
    fadeSize = 20,
    snap = 'proximity',
    hideScrollbar = true,
    wheelYToX = true,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const EPS = 1;

        const update = () => {
            const { scrollLeft, scrollWidth, clientWidth } = el;
            const scrollable = scrollWidth > clientWidth + EPS;
            const atStart = scrollLeft <= EPS;
            const atEnd = scrollLeft + clientWidth >= scrollWidth - EPS;

            el.dataset.scrollable = scrollable ? 'true' : 'false';
            el.dataset.atStart = atStart ? 'true' : 'false';
            el.dataset.atEnd = atEnd ? 'true' : 'false';
        };

        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        el.addEventListener('scroll', update, { passive: true });
        return () => {
            ro.disconnect();
            el.removeEventListener('scroll', update);
        };
    }, []);

    // 세로 휠을 가로로 전환
    const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
        if (!wheelYToX) return;
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            ref.current?.scrollBy({ left: e.deltaY, behavior: 'smooth' });
        }
    };

    const cssVariables: CSSVariables = {
        ['--gap']: toCssUnit(gap),
        ['--fade-size']: toCssUnit(fadeSize),
    };

    return (
        <div className={cn(styles.Wrap, className)}>
            <div
                ref={ref}
                className={cn(styles.Scroller, hideScrollbar && styles.hideScrollbar, contentClassName)}
                data-fade={fade}
                data-snap={snap}
                onWheel={onWheel}
                style={{ ...cssVariables }}
            >
                {React.Children.map(children, (child, i) => (
                    <div key={`item-${i}`} className={styles.Item}>
                        {child}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScrollArea;
