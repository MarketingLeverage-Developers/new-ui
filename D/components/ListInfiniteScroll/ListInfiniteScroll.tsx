import { useEffect, useMemo, useRef } from 'react';

type Props = {
    total: number;
    totalPages?: number;
    page: number;
    size: number;
    onChange: (page: number) => void;
    isLoading?: boolean;
    scrollEl?: HTMLElement | null;
    resetKey?: string;
};

const ROOT_MARGIN = '200px';
const SCROLL_THRESHOLD_PX = 200;

export const ListInfiniteScroll = ({ total, totalPages: totalPagesProp, page, size, onChange, isLoading, scrollEl, resetKey }: Props) => {
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const lastRequestedPageRef = useRef<number | null>(null);
    const requestedFromPageRef = useRef<number | null>(null);
    const wasIntersectingRef = useRef(false);

    const totalPages = useMemo(
        () => Math.max(0, totalPagesProp ?? (size > 0 ? Math.ceil(total / size) : 0)),
        [total, totalPagesProp, size]
    );
    const hasMore = totalPages > 0 && page < totalPages;
    const nextPage = page + 1;
    const canLoad = hasMore && !isLoading;

    useEffect(() => {
        // 새 페이지/조회 조건에서도 하단에 머무를 수 있으므로 진입 상태와 요청 잠금을 함께 초기화한다.
        lastRequestedPageRef.current = null;
        requestedFromPageRef.current = null;
        wasIntersectingRef.current = false;
    }, [page, resetKey, scrollEl]);

    useEffect(() => {
        if (!isLoading && requestedFromPageRef.current === page) {
            lastRequestedPageRef.current = null;
            requestedFromPageRef.current = null;
        }
    }, [isLoading, page]);

    useEffect(() => {
        const el = triggerRef.current;
        if (scrollEl) return;
        if (!el) return;
        if (!canLoad) return;
        if (typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;

                if (!entry.isIntersecting) {
                    wasIntersectingRef.current = false;
                    return;
                }

                if (wasIntersectingRef.current) return;
                wasIntersectingRef.current = true;

                if (lastRequestedPageRef.current === nextPage) return;
                lastRequestedPageRef.current = nextPage;
                requestedFromPageRef.current = page;
                onChange(nextPage);
            },
            { root: null, rootMargin: ROOT_MARGIN, threshold: 0 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [canLoad, nextPage, onChange, page, resetKey, scrollEl]);

    useEffect(() => {
        if (!scrollEl) return;
        if (!canLoad) return;

        const onScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollEl;
            const distanceToBottom = scrollHeight - (scrollTop + clientHeight);
            const nearBottom = distanceToBottom <= SCROLL_THRESHOLD_PX;

            if (!nearBottom) {
                wasIntersectingRef.current = false;
                return;
            }

            if (wasIntersectingRef.current) return;
            wasIntersectingRef.current = true;

            if (lastRequestedPageRef.current === nextPage) return;
            lastRequestedPageRef.current = nextPage;
            requestedFromPageRef.current = page;
            onChange(nextPage);
        };

        scrollEl.addEventListener('scroll', onScroll, { passive: true });
        // 필터 결과가 짧거나 페이지 추가 후 이미 하단이면 새 스크롤 이벤트 없이도 이어서 조회한다.
        onScroll();
        return () => scrollEl.removeEventListener('scroll', onScroll);
    }, [canLoad, nextPage, onChange, page, resetKey, scrollEl]);

    if (!hasMore) return null;
    if (scrollEl) return null;

    return <div ref={triggerRef} aria-hidden="true" style={{ height: 1 }} />;
};
