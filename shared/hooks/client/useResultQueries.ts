// src/shared/utils/query/useResultQueries.ts
// 기능: useQueries에서 각 queryFn이 Result<T> 또는 T를 반환하더라도
//       Err면 throw, Ok면 data 또는 T를 그대로 반환

import { useQueries, type UseQueryResult, type QueryFunction } from '@tanstack/react-query';
import type { Result } from '../../types';

type MaybePromise<T> = T | Promise<T>;
type ResultReturningFn<T> = () => MaybePromise<Result<T> | T>;

export type ResultQueryInput<TData> = {
    queryKey: readonly unknown[];
    queryFn: ResultReturningFn<TData>;
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
    refetchOnMount?: boolean;
};

// Result 타입 가드
const isResult = <T>(v: unknown): v is Result<T> =>
    !!v &&
    typeof v === 'object' &&
    'ok' in (v as Record<string, unknown>) &&
    'message' in (v as Record<string, unknown>);

// Result 언래핑
const unwrapResult = <T>(r: Result<T>): T => {
    if (!r.ok || r.data == null) {
        console.log('언랩 디버깅', r);
        throw new Error(r.message ?? '요청을 처리하지 못했습니다.');
    }
    return r.data;
};

// 제네릭 튜플 유지: [A, B, ...] 형태로 각 결과의 타입을 보존해줌
export const useResultQueries = <T extends any[]>(inputs: { [K in keyof T]: ResultQueryInput<T[K]> }) => {
    console.log('리절트 쿼리스');
    const results = useQueries({
        queries: inputs.map((q) => ({
            ...q,
            queryFn: (async () => {
                const r = await q.queryFn();
                console.log('queryFn');
                return isResult<T[number]>(r) ? unwrapResult(r) : (r as T[number]);
            }) as QueryFunction<any>,
        })) as any,
    });

    return results as { [K in keyof T]: UseQueryResult<T[K], Error> };
};
