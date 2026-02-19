import { useMemo } from 'react';

type UseClientSearchParams<T> = {
    items: T[];
    query: string | null | undefined;
    getSearchText?: (item: T) => string;
    normalize?: (value: string) => string;
};

const defaultNormalize = (value: string) => value.trim().toLowerCase();

const buildSearchText = (value: unknown) => {
    const parts: string[] = [];
    const visited = new WeakSet<object>();

    const visit = (current: unknown) => {
        if (current === null || current === undefined) return;
        const currentType = typeof current;

        if (currentType === 'string' || currentType === 'number' || currentType === 'boolean' || currentType === 'bigint') {
            parts.push(String(current));
            return;
        }

        if (current instanceof Date) {
            parts.push(current.toISOString());
            return;
        }

        if (Array.isArray(current)) {
            current.forEach(visit);
            return;
        }

        if (currentType === 'object') {
            const objectValue = current as Record<string, unknown>;
            if (visited.has(objectValue)) return;
            visited.add(objectValue);
            Object.values(objectValue).forEach(visit);
        }
    };

    visit(value);
    return parts.join(' ');
};

const defaultGetSearchText = (item: unknown) => buildSearchText(item);

export const useClientSearch = <T,>({
    items,
    query,
    getSearchText,
    normalize,
}: UseClientSearchParams<T>): T[] => {
    const normalizeText = useMemo(() => normalize ?? defaultNormalize, [normalize]);
    const getText = useMemo(
        () => (getSearchText ?? defaultGetSearchText) as (item: T) => string,
        [getSearchText]
    );

    const normalizedQuery = useMemo(() => normalizeText(String(query ?? '')), [normalizeText, query]);
    const hasQuery = normalizedQuery.length > 0;

    // ✅ query가 비어있으면(대부분의 상태) index를 만들지 않아도 된다.
    // - index 생성은 items 전체를 순회 + object deep stringify에 가깝게 동작해서 비용이 크다.
    // - query가 생길 때만 index를 만들고, query 변경은 index 필터링만 수행한다.
    const searchIndex = useMemo(() => {
        if (!hasQuery) return null;
        return items.map((item) => ({ item, text: normalizeText(getText(item)) }));
    }, [items, getText, normalizeText, hasQuery]);

    return useMemo(() => {
        if (!normalizedQuery) return items;
        const idx = searchIndex ?? [];
        return idx.filter(({ text }) => text.includes(normalizedQuery)).map(({ item }) => item);
    }, [items, normalizedQuery, searchIndex]);
};
