import { useCallback, useEffect, useState } from 'react';

type Params = {
    /**
     * 결과 높이의 최소값(px).
     * 화면이 작거나 상단 콘텐츠가 많아도 테이블이 너무 작아지지 않게 clamp 한다.
     */
    minHeight?: number;
    /**
     * 필터/액션 툴바 등 "테이블 높이 계산에서 빠지기 쉬운" 영역을 보정할 px.
     * 예: BasicTable 상단 툴바 높이를 50px 정도 더해주고 싶을 때 사용.
     */
    compensationPx?: number;
};

const findOverflowYParent = (el: HTMLElement | null) => {
    let parent = el?.parentElement ?? null;
    while (parent) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') return parent;
        parent = parent.parentElement;
    }
    return null;
};

/**
 * ✅ Desktop.Main(스크롤 컨테이너) 높이에 맞춰 ListTable 높이를 자동으로 계산한다.
 * - 내부적으로 "overflow-y: auto|scroll" 인 가장 가까운 부모를 찾아 clientHeight를 사용한다.
 * - 사용처에서는 스크롤 컨테이너 내부의 '안전한 앵커 엘리먼트'에 ref를 붙이면 된다.
 */
export const useListTableHeightFitMain = <T extends HTMLElement = HTMLDivElement>({
    minHeight = 360,
    compensationPx = 0,
}: Params = {}) => {
    const [anchorEl, setAnchorEl] = useState<T | null>(null);
    const [height, setHeight] = useState<number>(minHeight);

    const ref = useCallback((el: T | null) => {
        setAnchorEl(el);
    }, []);

    useEffect(() => {
        if (!anchorEl) return;
        if (typeof ResizeObserver === 'undefined') return;

        const scrollParent = findOverflowYParent(anchorEl);
        if (!scrollParent) return;

        const measure = () => {
            setHeight(Math.max(minHeight, Math.floor(scrollParent.clientHeight + compensationPx)));
        };

        measure();

        const ro = new ResizeObserver(measure);
        ro.observe(scrollParent);
        window.addEventListener('resize', measure);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [anchorEl, compensationPx, minHeight]);

    return { ref, height };
};

