import React from 'react';
import Flex from '@/shared/primitives/Flex/Flex';
import { useInfiniteScroll } from '@/shared/headless/useInfiniteScroll/useInfiniteScroll';

export type InfiniteScrollTriggerProps = {
    total: number;
    totalPages?: number;
    page: number;
    size: number;
    onChange: (page: number) => void;
    isLoading?: boolean;
    disabled?: boolean;
    hasMore?: boolean;
    lastPageCount?: number;
    endMessage?: string;
    loadingMessage?: string;
};

export const InfiniteScrollTrigger = ({
    total,
    totalPages,
    page,
    size,
    onChange,
    isLoading = false,
    disabled = false,
    hasMore,
    lastPageCount,
    endMessage = '모든 데이터를 불러왔습니다',
    loadingMessage = '로딩 중...',
}: InfiniteScrollTriggerProps) => {
    const { triggerRef, hasMore: resolvedHasMore, showEndMessage } = useInfiniteScroll({
        total,
        totalPages,
        page,
        size,
        onChange,
        isLoading,
        disabled,
        hasMore,
        lastPageCount,
    });

    if (!resolvedHasMore && showEndMessage) {
        return (
            <Flex justify="center" padding={{ y: 20 }}>
                <span style={{ color: '#999', fontSize: 14 }}>{endMessage}</span>
            </Flex>
        );
    }

    if (!resolvedHasMore && !showEndMessage) return null;

    return (
        <div
            ref={triggerRef}
            style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', minHeight: '50px' }}
        >
            {isLoading && <span style={{ color: '#666', fontSize: 14 }}>{loadingMessage}</span>}
        </div>
    );
};
