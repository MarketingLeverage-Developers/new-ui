// useSmartSuspenseQuery.ts
import { useEffect, useMemo } from 'react';
import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions, type QueryKey } from '@tanstack/react-query';
import type { Result } from '@/shared/types';

// Result 타입 가드
const isResult = <T = unknown,>(val: unknown): val is Result<T> => {
    if (val && typeof val === 'object') {
        const v = val as Record<string, unknown>;
        return 'ok' in v && 'message' in v;
    }
    return false;
};

// SmartSuspense용 옵션: v5의 UseSuspenseQueryOptions에는 enabled가 없어서 우리가 확장
type SmartSuspenseOptions<TQueryFnData, TError, TData, TKey extends QueryKey> = Omit<
    UseSuspenseQueryOptions<TQueryFnData, TError, TData, TKey>,
    'enabled'
> & {
    enabled?: boolean;
};

// 시딩 대상으로 채택 가능한가? (Result면 ok:true만, Result가 아니면 data≠undefined만 허용)
const isSeedable = (data: unknown): boolean => {
    if (isResult(data)) return data.ok === true;
    return data !== undefined;
};

export const useSmartSuspenseQuery = <
    TQueryFnData,
    TError = unknown,
    TData = TQueryFnData,
    TKey extends QueryKey = QueryKey
>(
    options: SmartSuspenseOptions<TQueryFnData, TError, TData, TKey>,
    seedPrefixKey: readonly unknown[]
) => {
    const queryClient = useQueryClient();
    const { enabled = true, ...rest } = options;
    const currKey = rest.queryKey as readonly unknown[] | undefined;

    // ---- disabled path: 네트워크 절대 안 나가게 더미 옵션 구성 ----
    const disabledOptions: UseSuspenseQueryOptions<TQueryFnData, TError, TData, TKey> = {
        ...(rest as any),
        queryKey: ['__DISABLED__', currKey] as unknown as TKey,
        // ❌ before: () => undefined
        // ✅ after: Suspense는 undefined를 에러로 처리하므로 null 반환
        queryFn: async () => null as unknown as TQueryFnData,
        // 선택: 초기 데이터도 null로 두면 더 안전
        initialData: null as unknown as TData,
        // 불필요한 재시도/리패치 막기
        retry: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        staleTime: Number.POSITIVE_INFINITY,
        gcTime: 0,
    };

    // 현재 키에 캐시 데이터가 있는지 (enabled일 때만 의미)
    const hasCurrData = useMemo(() => {
        if (!enabled || !currKey) return false;
        const st = queryClient.getQueryState(currKey as any);
        return st?.data !== undefined;
    }, [queryClient, currKey, enabled]);

    // 동일 prefix로부터 최신 "성공 데이터"만 시딩 (enabled=true에서만)
    if (enabled && !hasCurrData && seedPrefixKey.length > 0 && currKey) {
        const tuples = queryClient.getQueriesData({
            queryKey: seedPrefixKey as any,
            exact: false,
        }) as Array<[unknown[], unknown]>;

        let bestData: unknown | undefined;
        let bestUpdatedAt = -1;

        for (const [key] of tuples) {
            const st = queryClient.getQueryState(key as any);
            if (st?.data !== undefined && typeof st.dataUpdatedAt === 'number') {
                // ✅ Err(=ok:false)는 시딩하지 않음
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

    // ❗항상 호출: enabled=true → 실제 옵션 / false → 더미 옵션
    const queryResult = useSuspenseQuery<TQueryFnData, TError, TData, TKey>(
        (enabled ? rest : disabledOptions) as UseSuspenseQueryOptions<TQueryFnData, TError, TData, TKey>
    );

    // Result 패턴 에러 throw (enabled=true에서만 + fetch 중이 아닐 때만)
    if (enabled) {
        const d = queryResult.data as unknown;
        if (isResult(d) && d.ok === false) {
            // 🔸 refetch 중이면 일단 기다렸다가(Blur만 표시), 최종 결과가 Err일 때 throw
            if (queryResult.fetchStatus !== 'fetching') {
                throw new Error(d.message ?? 'Unknown error');
            }
        }
    }

    // 시딩 후 invalidate로 최신화 (enabled=true에서만)
    useEffect(() => {
        if (!enabled || !currKey) return;
        if (!hasCurrData) {
            queryClient.invalidateQueries({ queryKey: currKey as any, exact: true });
        }
    }, [queryClient, currKey, hasCurrData, enabled]);

    // 소비 편의: enabled=false면 몇 필드 스텁으로 덮어쓰기
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
