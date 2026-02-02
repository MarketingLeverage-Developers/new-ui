import { useEffect, useMemo, useRef } from 'react';

type Props = {
    total: number;
    page: number;
    size: number;
    onChange: (page: number) => void;
    isLoading?: boolean;
};

const ROOT_MARGIN = '200px';

export const ListInfiniteScroll = ({ total, page, size, onChange, isLoading }: Props) => {
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
    }, [page]);

    useEffect(() => {
        if (!isLoading && requestedFromPageRef.current === page) {
            lastRequestedPageRef.current = null;
            requestedFromPageRef.current = null;
        }
    }, [isLoading, page]);

    useEffect(() => {
        const el = triggerRef.current;
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
    }, [canLoad, nextPage, onChange, page]);

    if (!hasMore) return null;

    return <div ref={triggerRef} aria-hidden="true" style={{ height: 1 }} />;
};
