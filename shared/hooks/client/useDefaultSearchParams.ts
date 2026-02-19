import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

type DefaultValue = string | (() => string);

type UseDefaultSearchParamsResult = {
    searchParams: URLSearchParams;
    updateQueryParams: (values: Record<string, string | null>) => void;
};

export const useDefaultSearchParams = (defaults: Record<string, DefaultValue>): UseDefaultSearchParamsResult => {
    const [searchParams, setSearchParams] = useSearchParams();

    // ✅ 초기 기본값 세팅
    const prevHomepageUuid = useRef<string | null>(null);
    useEffect(() => {
        let changed = false;
        const next = new URLSearchParams(searchParams);

        Object.entries(defaults).forEach(([key, value]) => {
            if (next.get(key) !== null) return; // 이미 값이 있으면 skip
            const resolved = typeof value === 'function' ? value() : value;
            next.set(key, resolved);
            changed = true;
        });

        if (changed) {
            setSearchParams(next);
        }
    }, [searchParams, defaults, setSearchParams]);

    useEffect(() => {
        const homepageUuid = searchParams.get('homepageUuid');
        const prev = prevHomepageUuid.current;

        // 첫 렌더에서는 초기화하지 않음
        if (prev === null) {
            prevHomepageUuid.current = homepageUuid;
            return;
        }
        // homepageUuid가 변경된 경우에만
        if (prev !== homepageUuid) {
            prevHomepageUuid.current = homepageUuid;

            const next = new URLSearchParams(searchParams);

            // defaults 전체 재적용 (필터 초기화)
            Object.entries(defaults).forEach(([key, value]) => {
                const resolved = typeof value === 'function' ? value() : value;
                next.set(key, resolved);
            });

            setSearchParams(next);
        }
    }, [searchParams, defaults, setSearchParams]);

    const updateQueryParams = (values: Record<string, string | null>): void => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            Object.entries(values).forEach(([key, value]) => {
                if (value === null) next.delete(key);
                else next.set(key, value);
            });

            return next;
        });
    };

    return {
        searchParams,
        updateQueryParams,
    };
};
