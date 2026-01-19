import React, { useEffect, useRef } from 'react';
import Flex from '@/shared/primitives/Flex/Flex';

type InfiniteScrollTriggerProps = {
    total: number;
    page: number;
    size: number;
    onChange: (page: number) => void;
    isLoading?: boolean;
};

export const InfiniteScrollTrigger = ({
    total,
    page,
    size,
    onChange,
    isLoading = false,
}: InfiniteScrollTriggerProps) => {
    const triggerRef = useRef<HTMLDivElement>(null);
    const lastCallTime = useRef<number>(0);
    const hasMore = page * size < total;

    useEffect(() => {
        if (!hasMore || isLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const now = Date.now();
                if (entries[0].isIntersecting && now - lastCallTime.current > 500) {
                    lastCallTime.current = now;
                    onChange(page + 1);
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (triggerRef.current) {
            observer.observe(triggerRef.current);
        }

        return () => observer.disconnect();
    }, [hasMore, page, onChange, isLoading]);

    if (!hasMore) {
        return (
            <Flex justify="center" padding={{ y: 20 }}>
                <span style={{ color: '#999', fontSize: 14 }}>모든 데이터를 불러왔습니다</span>
            </Flex>
        );
    }

    return (
        <div
            ref={triggerRef}
            style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', minHeight: '50px' }}
        >
            {isLoading && <span style={{ color: '#666', fontSize: 14 }}>로딩 중...</span>}
        </div>
    );
};
