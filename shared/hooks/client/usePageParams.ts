import { useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

type ParamConfig<T = unknown> = {
    key: string;
    defaultValue?: T;
    parser?: (value: string | null) => T;
};

type ParamConfigs = Record<string, ParamConfig>;

type ParsedParams<T extends ParamConfigs> = {
    [K in keyof T]: T[K] extends ParamConfig<infer U> ? U : never;
};

type UsePageParamsOptions = {
    /**
     * 특정 파라미터가 변경될 때 모든 파라미터를 기본값으로 초기화
     * 예: 'homepageUuid' - homepageUuid가 변경되면 page, size 등이 기본값으로 리셋
     */
    resetOnChange?: string;

    /**
     * ✅ 새로고침(reload) 시: URL에 박혀있는 기존 params를 무시하고
     * configs의 defaultValue로 "강제 초기화"할지 여부
     *
     * - 기본값: true
     * - false로 넘기면 새로고침이어도 초기화하지 않음
     */
    resetOnReload?: boolean;
};

type UpdateParamsOptions = {
    replace?: boolean;
};

type UsePageParamsResult<T extends ParamConfigs> = {
    params: ParsedParams<T>;
    searchParams: URLSearchParams;
    updateParams: (values: Partial<Record<keyof T, unknown>>, options?: UpdateParamsOptions) => void;
};

const getNavigationType = (): 'navigate' | 'reload' | 'back_forward' | 'prerender' | 'unknown' => {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
    if (!navEntry) return 'unknown';
    return (navEntry.type ?? 'unknown') as 'navigate' | 'reload' | 'back_forward' | 'prerender' | 'unknown';
};

/**
 * URL 파라미터를 타입 안전하게 파싱하고 관리하는 훅
 */
export const usePageParams = <T extends ParamConfigs>(
    configs: T,
    options?: UsePageParamsOptions
): UsePageParamsResult<T> => {
    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ configs 객체가 매 렌더마다 새로 생성되는 것을 방지
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const configsStable = useMemo(() => configs, [JSON.stringify(configs)]);

    /**
     * ✅ 새로고침(reload) 시: 기존 URL 파라미터를 무시하고 defaultValue로 강제 초기화
     * - "이전 url을 참고하지 않는다" 요구사항을 정확히 충족
     * - resetOnReload 기본값은 true
     */
    const didReloadResetRef = useRef(false);
    useEffect(() => {
        const shouldResetOnReload = options?.resetOnReload ?? true;
        if (!shouldResetOnReload) return;
        if (didReloadResetRef.current) return;

        const navType = getNavigationType();
        if (navType !== 'reload') return;

        didReloadResetRef.current = true;

        const next = new URLSearchParams();
        let changed = false;

        for (const [_name, config] of Object.entries(configsStable)) {
            const defaultVal = config.defaultValue;

            if (defaultVal !== undefined && defaultVal !== null) {
                next.set(config.key, String(defaultVal));
                changed = true;
            }
        }

        if (changed) {
            setSearchParams(next, { replace: true });
        } else {
            setSearchParams(new URLSearchParams(), { replace: true });
        }
    }, [options?.resetOnReload, configsStable, setSearchParams]);

    // ✅ 초기 기본값 세팅 (URL에 값이 없을 때만)
    useEffect(() => {
        let changed = false;
        const next = new URLSearchParams(searchParams);

        for (const [_name, config] of Object.entries(configsStable)) {
            if (next.get(config.key) !== null) continue;

            const defaultVal = config.defaultValue;
            if (defaultVal !== undefined && defaultVal !== null) {
                next.set(config.key, String(defaultVal));
                changed = true;
            }
        }

        if (changed) {
            setSearchParams(next, { replace: true });
        }
    }, [searchParams, configsStable, setSearchParams]);

    // ✅ resetOnChange 기능: 특정 파라미터 변경 시 모든 파라미터 초기화
    const prevResetValue = useRef<string | null>(null);
    useEffect(() => {
        if (!options?.resetOnChange) return;

        const resetConfig = configs[options.resetOnChange];
        if (!resetConfig) return;

        const currentValue = searchParams.get(resetConfig.key);
        const prev = prevResetValue.current;

        if (prev === null) {
            prevResetValue.current = currentValue;
            return;
        }

        if (prev !== currentValue) {
            prevResetValue.current = currentValue;

            const next = new URLSearchParams(searchParams);

            for (const [_name, config] of Object.entries(configs)) {
                const defaultVal = config.defaultValue;
                if (defaultVal !== undefined && defaultVal !== null) {
                    next.set(config.key, String(defaultVal));
                } else {
                    next.delete(config.key);
                }
            }

            setSearchParams(next);
        }
    }, [searchParams, configs, options?.resetOnChange, setSearchParams]);

    // 파싱된 파라미터들
    const params = useMemo(() => {
        const result = {} as ParsedParams<T>;

        for (const [name, config] of Object.entries(configsStable)) {
            const rawValue = searchParams.get(config.key);
            const parsed = config.parser ? config.parser(rawValue) : rawValue;
            (result as unknown as Record<string, unknown>)[name] = parsed ?? config.defaultValue;
        }

        return result;
    }, [searchParams, configsStable]);

    // 파라미터 업데이트 함수
    const updateParams = (values: Partial<Record<keyof T, unknown>>, options?: UpdateParamsOptions) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            for (const [name, value] of Object.entries(values)) {
                const config = configs[name];
                if (!config) continue;

                if (value === null || value === undefined) {
                    next.delete(config.key);
                } else {
                    next.set(config.key, String(value));
                }
            }

            return next;
        }, options?.replace ? { replace: true } : undefined);
    };

    return {
        params,
        searchParams,
        updateParams,
    };
};
