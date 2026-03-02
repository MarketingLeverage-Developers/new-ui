// useSmartSuspenseQuery.ts
// 기능: Suspense 쿼리 훅. 초기 렌더에서 반드시 서스펜드가 걸리도록 기본 동작을 안전하게 조정.

import { useEffect, useMemo, useRef } from 'react';
import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions, type QueryKey } from '@tanstack/react-query';
import type { Result } from '../../types';

// Result 타입 가드
const isResult = <T = unknown>(val: unknown): val is Result<T> => {
    if (val && typeof val === 'object') {
        const v = val as Record<string, unknown>;
        return 'ok' in v && 'message' in v;
    }
    return false;
};

type SmartSuspenseOptions<TQueryFnData, TError, TData, TKey extends QueryKey> = Omit<
    UseSuspenseQueryOptions<TQueryFnData, TError, TData, TKey>,
    'enabled'
> & {
    enabled?: boolean;
    /** 초기 렌더 전에 캐시 시딩 허용 (기본 false → Suspense 보장) */
    allowSeedOnFirstRender?: boolean;
    /** 초기 렌더 직후 invalidate 허용 (기본 false → 전역 오버레이 과노출 방지) */
    invalidateAfterFirstRender?: boolean;
};

const isSeedable = (data: unknown): boolean => {
    if (isResult(data)) return data.ok === true;
    return data !== undefined;
};

export const useStrictSuspenseQuery = <
    TQueryFnData,
    TError = unknown,
    TData = TQueryFnData,
    TKey extends QueryKey = QueryKey
>(
    options: SmartSuspenseOptions<TQueryFnData, TError, TData, TKey>,
    seedPrefixKey: readonly unknown[]
) => {
    const queryClient = useQueryClient();
    const {
        enabled = true,
        allowSeedOnFirstRender = false, // 기본: 시딩 금지
        invalidateAfterFirstRender = false, // 기본: 즉시 invalidate 금지
        ...rest
    } = options;

    const currKey = rest.queryKey as readonly unknown[] | undefined;
    const didFirstRenderRef = useRef(false);

    // disabled 경로: 네트워크/서스펜드/전역오버레이 모두 발생하지 않도록 더미 쿼리
    const disabledOptions: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TKey> = {
        ...(rest as any),
        queryKey: ['__DISABLED__', currKey] as unknown as TKey,
        // Suspense가 undefined를 에러로 보므로 null 반환해 "성공"으로 고정
        queryFn: async () => null as unknown as TQueryFnData,
        // ❗주의: initialData를 넣으면 "데이터가 있다"로 간주 → 여기서는 의도적으로 disabled일 때만 사용
        initialData: null as unknown as TData,
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        staleTime: Number.POSITIVE_INFINITY,
        gcTime: 0,
    };

    const hasCurrData = useMemo(() => {
        if (!enabled || !currKey) return false;
        const st = queryClient.getQueryState(currKey as any);
        return st?.data !== undefined;
    }, [queryClient, currKey, enabled]);

    // (기본 비활성) 초기 렌더 전 시딩
    if (
        enabled &&
        allowSeedOnFirstRender &&
        !hasCurrData &&
        seedPrefixKey.length > 0 &&
        currKey &&
        !didFirstRenderRef.current
    ) {
        const tuples = queryClient.getQueriesData({
            queryKey: seedPrefixKey as any,
            exact: false,
        }) as Array<[unknown[], unknown]>;

        let bestData: unknown | undefined;
        let bestUpdatedAt = -1;

        for (const [key] of tuples) {
            const st = queryClient.getQueryState(key as any);
            if (st?.data !== undefined && typeof st.dataUpdatedAt === 'number') {
                if (isSeedable(st.data) && st.dataUpdatedAt > bestUpdatedAt) {
                    bestUpdatedAt = st.dataUpdatedAt;
                    bestData = st.data;
                }
            }
        }

        if (bestData !== undefined) {
            queryClient.setQueryData(currKey as any, bestData);
        }
    }

    // ✅ enabled=true면 실제 옵션으로 호출 → 데이터가 없으면 Suspense 발생
    // ✅ enabled=false면 disabledOptions로 호출 → 서스펜드/네트워크/오버레이 없음
    const queryResult = useSuspenseQuery<TQueryFnData, TError, TData, TKey>(
        (enabled ? rest : disabledOptions) as UseSuspenseQueryOptions<TQueryFnData, TError, TData, TKey>
    );

    // Result 패턴 에러 throw (fetch 끝난 시점)
    if (enabled) {
        const d = queryResult.data as unknown;
        if (isResult(d) && d.ok === false) {
            if (queryResult.fetchStatus !== 'fetching') {
                throw new Error(d.message ?? 'Unknown error');
            }
        }
    }

    // (기본 비활성) 초기 렌더 직후 invalidate
    useEffect(() => {
        didFirstRenderRef.current = true;
        if (!enabled || !currKey) return;
        if (invalidateAfterFirstRender) {
            queryClient.invalidateQueries({ queryKey: currKey as any, exact: true });
        }
    }, [queryClient, currKey, enabled, invalidateAfterFirstRender]);

    if (!enabled) {
        return {
            ...queryResult,
            data: undefined as unknown as TData,
            isFetching: false,
            fetchStatus: 'idle' as const,
        };
    }

    return queryResult;
};
