import { useEffect, useMemo, useRef } from 'react';

type Props = {
    total: number;
    page: number;
    size: number;
    onChange: (page: number) => void;
    isLoading?: boolean;
    scrollEl?: HTMLElement | null;
};

const ROOT_MARGIN = '200px';
const SCROLL_THRESHOLD_PX = 200;

export const ListInfiniteScroll = ({ total, page, size, onChange, isLoading, scrollEl }: Props) => {
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const lastRequestedPageRef = useRef<number | null>(null);
    const requestedFromPageRef = useRef<number | null>(null);
    const wasIntersectingRef = useRef(false);

    const totalPages = useMemo(() => (size > 0 ? Math.ceil(total / size) : 0), [total, size]);
    const hasMore = totalPages > 0 && page < totalPages;
    const nextPage = page + 1;
    const canLoad = hasMore && !isLoading;

    useEffect(() => {
        if (lastRequestedPageRef.current !== null && lastRequestedPageRef.current <= page) {
            lastRequestedPageRef.current = null;
            requestedFromPageRef.current = null;
        }
        // ✅ 내부 스크롤 기반 infinite scroll은 페이지가 늘어나도 "nearBottom"이 계속 true일 수 있어서
        // 다음 로드를 위해 상태를 초기화한다.
        if (scrollEl) wasIntersectingRef.current = false;
    }, [page, scrollEl]);

    useEffect(() => {
        if (!isLoading && requestedFromPageRef.current === page) {
            lastRequestedPageRef.current = null;
            requestedFromPageRef.current = null;
        }
    }, [isLoading, page]);

    useEffect(() => {
        const el = triggerRef.current;
        // ✅ 내부 스크롤 컨테이너가 있으면 scroll 이벤트 기반으로 처리
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
    }, [canLoad, nextPage, onChange, page, scrollEl]);

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

        // mount 시 바로 한 번 체크 (컨테이너가 이미 bottom에 있을 수 있음)
        onScroll();
        scrollEl.addEventListener('scroll', onScroll, { passive: true });
        return () => scrollEl.removeEventListener('scroll', onScroll);
    }, [canLoad, nextPage, onChange, page, scrollEl]);

    if (!hasMore) return null;

    if (scrollEl) return null;
    return <div ref={triggerRef} aria-hidden="true" style={{ height: 1 }} />;
};
