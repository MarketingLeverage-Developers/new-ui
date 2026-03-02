// src/shared/utils/query/useResultQuery.ts
import { useEffect } from 'react';
import { atom, useRecoilCallback } from 'recoil';
import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import type { Result } from '../../types';
import { unwrapResult } from '../../utils/utils';
import { toastBus } from '../../utils/toast/ToastUtils';

export type ResultErrorMap = Record<string, string>;

export const resultErrorMapState = atom<ResultErrorMap>({
    key: 'resultErrorMapState',
    default: {},
});

const errorToastByKey = new Map<string, string>();

const normalizeKey = (key: QueryKey): string =>
    Array.isArray(key)
        ? key.map((v) => String(typeof v === 'object' ? JSON.stringify(v) : v)).join(' | ')
        : String(key);

export const useResultErrorReporter = () =>
    useRecoilCallback(
        ({ set }) =>
            (params: { key: QueryKey; error?: unknown }) => {
                const k = normalizeKey(params.key);
                if (params.error) {
                    const msg = params.error instanceof Error ? params.error.message : String(params.error);
                    set(resultErrorMapState, (prev) => ({ ...prev, [k]: msg }));
                } else {
                    set(resultErrorMapState, (prev) => {
                        const next = { ...prev };
                        delete next[k];
                        return next;
                    });
                }
            },
        []
    );

// Result 또는 일반 T 둘 다 허용
type MaybeResult<T> = Result<T> | T;
type ResultReturningFn<TData> = () => Promise<MaybeResult<TData>> | MaybeResult<TData>;

type UseResultQueryOptions<TData, TError = Error, TKey extends QueryKey = QueryKey> = Omit<
    UseQueryOptions<TData, TError, TData, TKey>,
    'queryFn'
> & {
    queryFn: ResultReturningFn<unknown>;
    /**
     * 기본값 false:
     *  - useQuery(Result<T>)와 동일하게 Result<T>를 그대로 반환
     * true:
     *  - queryFn이 Result<T>를 반환하면 unwrapResult로 T를 반환
     *  - queryFn이 T를 반환하면 그대로 T 반환
     */
    unwrap?: boolean;
};

const isResult = (v: unknown): v is Result<unknown> =>
    !!v && typeof v === 'object' && 'ok' in (v as Record<string, unknown>);

export const useResultQuery = <TData, TError = Error, TKey extends QueryKey = QueryKey>(
    options: UseResultQueryOptions<TData, TError, TKey>
) => {
    const { queryFn, queryKey, unwrap = true, ...rest } = options;
    const report = useResultErrorReporter();

    const q = useQuery<TData, TError, TData, TKey>({
        ...rest,
        queryKey,
        queryFn: async () => {
            const r = await queryFn(); // unknown
            if (unwrap) {
                if (isResult(r)) return unwrapResult(r) as TData; // Result<T> -> T
                return r as TData; // 이미 T인 경우
            }
            // unwrap=false: 기존 useQuery(Result<T>)와 동일하게 그대로 반환
            return r as TData;
        },
    });

    // v5: 상태 관찰로 에러 기록/성공 시 제거
    useEffect(() => {
        const key = normalizeKey(queryKey);

        if (q.status === 'error') {
            report({ key: queryKey, error: q.error });
            const msg = q.error instanceof Error ? q.error.message : String(q.error);

            if (msg && errorToastByKey.get(key) !== msg) {
                errorToastByKey.set(key, msg);
                toastBus.emit({ kind: 'error', text: msg });
            }
        } else if (q.status === 'success') {
            report({ key: queryKey });
            errorToastByKey.delete(key);
        }
    }, [q.status, q.error, queryKey, report]);

    return q;
};
