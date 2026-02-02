import React from 'react';
import Flex from '@/shared/primitives/Flex/Flex';
import { useInfiniteScroll } from '@/shared/headless/useInfiniteScroll/useInfiniteScroll';

export type InfiniteScrollTriggerProps = {
    total: number;
    page: number;
    size: number;
    onChange: (page: number) => void;
    isLoading?: boolean;
    disabled?: boolean;
    endMessage?: string;
    loadingMessage?: string;
};

export const InfiniteScrollTrigger = ({
    total,
    page,
    size,
    onChange,
    isLoading = false,
    disabled = false,
    endMessage = '모든 데이터를 불러왔습니다',
    loadingMessage = '로딩 중...',
}: InfiniteScrollTriggerProps) => {
    const { triggerRef, hasMore } = useInfiniteScroll({
        total,
        page,
        size,
        onChange,
        isLoading,
        disabled,
    });

    if (!hasMore) {
        return (
            <Flex justify="center" padding={{ y: 20 }}>
                <span style={{ color: '#999', fontSize: 14 }}>{endMessage}</span>
            </Flex>
        );
    }

    return (
        <div
            ref={triggerRef}
            style={{ display: 'flex', justifyContent: 'center', padding: '20px 0', minHeight: '50px' }}
        >
            {isLoading && <span style={{ color: '#666', fontSize: 14 }}>{loadingMessage}</span>}
        </div>
    );
};
