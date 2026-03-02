// src/shared/utils/query/usePageBoot.ts
// 기능: 여러 쿼리를 병렬로 실행하고, 페이지 부트 스트랩 상태를 일관되게 계산
import { useEffect, useMemo, useRef, useCallback } from 'react';
import type { UseQueryResult } from '@tanstack/react-query';
import { useResultQueries, type ResultQueryInput } from './useResultQueries';

const isInitialPending = (status: string): boolean => status === 'loading' || status === 'pending';

export type UsePageBootReturn<T extends any[]> = {
    results: { [K in keyof T]: UseQueryResult<T[K], Error> };
    initialLoading: boolean;
    initialError: Error | null;
    isRefetching: boolean;
    hasLoadedOnce: boolean;
    refetchAll: () => void;
};

export const usePageBoot = <T extends any[]>(inputs: {
    [K in keyof T]: ResultQueryInput<T[K]>;
}): UsePageBootReturn<T> => {
    const results = useResultQueries<T>(inputs);
    const enabledList = useMemo(
        () =>
            results.map((q, idx) => ({
                enabled: Boolean((inputs[idx] as ResultQueryInput<T[number]>).enabled ?? true),
                q,
            })),
        [results, inputs]
    );

    const hasLoadedOnceRef = useRef(false);
    useEffect(() => {
        const enabledEntries = enabledList.filter((e) => e.enabled);
        if (enabledEntries.length === 0) return;
        const allSucceeded = enabledEntries.every(({ q }) => q.status === 'success' && q.data != null);
        if (allSucceeded) hasLoadedOnceRef.current = true;
    }, [enabledList]);

    const initialLoading =
        enabledList.filter((e) => e.enabled).some(({ q }) => isInitialPending(q.status)) && !hasLoadedOnceRef.current;

    const initialError = !hasLoadedOnceRef.current
        ? (enabledList
              .filter((e) => e.enabled)
              .map(({ q }) => q.error)
              .find(Boolean) as Error | undefined) ?? null
        : null;

    console.log('에러에러', initialError);

    const isRefetching = hasLoadedOnceRef.current && enabledList.filter((e) => e.enabled).some(({ q }) => q.isFetching);

    const refetchAll = useCallback(() => {
        enabledList.filter((e) => e.enabled).forEach(({ q }) => q.refetch());
    }, [enabledList]);

    return {
        results: results as UsePageBootReturn<T>['results'],
        initialLoading,
        initialError,
        isRefetching,
        hasLoadedOnce: hasLoadedOnceRef.current,
        refetchAll,
    };
};
