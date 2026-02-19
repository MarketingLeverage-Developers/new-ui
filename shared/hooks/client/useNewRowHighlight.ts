import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Persisted = {
    v: 1;
    ts: number; // epoch ms
    idsAtTs: string[];
};

type UseNewRowHighlightParams<T> = {
    storageKey: string;
    items: T[];
    enabled?: boolean;
    /**
     * ✅ highlight 유지 시간(ms)
     * - 신규 감지 직후 데이터가 한 번 더 갱신/정렬되면(newIds가 즉시 비워지면) 배경색이 "깜빡" 사라질 수 있다.
     * - UI에서는 newIdSet(=highlight set)을 이 시간만큼 유지한다.
     */
    highlightDurationMs?: number;
    /**
     * ✅ row id extractor
     * - highlight + idsAtTs 저장을 위해 필요
     */
    getId: (item: T) => string | null | undefined;
    /**
     * ✅ row time extractor (epoch ms)
     * - "이전에 없던 행(신규)"을 max timestamp 기준으로 판단한다.
     */
    getTimeMs: (item: T) => number | null | undefined;
    /**
     * 동일 timestamp에 여러 행이 들어올 수 있어서, max timestamp의 ids를 일부 저장한다.
     */
    maxRememberIdsAtTs?: number;
};

const safeRead = (key: string): Persisted | null => {
    try {
        if (typeof window === 'undefined') return null;
        const raw = window.localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as Partial<Persisted> | null;
        if (!parsed || parsed.v !== 1) return null;
        if (typeof parsed.ts !== 'number') return null;
        const idsAtTs = Array.isArray(parsed.idsAtTs) ? parsed.idsAtTs.filter((v) => typeof v === 'string') : [];
        return { v: 1, ts: parsed.ts, idsAtTs };
    } catch {
        return null;
    }
};

const safeWrite = (key: string, value: Persisted) => {
    try {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore
    }
};

const uniq = (arr: string[]) => Array.from(new Set(arr));
const EMPTY_STR_ARR: string[] = [];

export const useNewRowHighlight = <T,>({
    storageKey,
    items,
    enabled = true,
    highlightDurationMs = 3000,
    getId,
    getTimeMs,
    maxRememberIdsAtTs = 80,
}: UseNewRowHighlightParams<T>) => {
    const [newIds, setNewIds] = useState<string[]>([]);
    const [highlightIds, setHighlightIds] = useState<string[]>([]);
    const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const cancelHighlightTimer = useCallback(() => {
        if (!highlightTimerRef.current) return;
        clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = null;
    }, []);

    const clearHighlight = useCallback(() => {
        cancelHighlightTimer();
        setHighlightIds([]);
    }, [cancelHighlightTimer]);

    const clear = useCallback(() => {
        setNewIds([]);
        clearHighlight();
    }, [clearHighlight]);

    // ✅ 최초 방문(키 없음)에서는 "전부 신규"로 칠해지지 않도록 baseline만 저장한다.
    const isFirstVisitRef = useRef<boolean>(false);
    const baselineRef = useRef<Persisted | null>(null);

    useEffect(() => {
        // storageKey / enabled가 바뀌면 이전 컨텍스트의 highlight/newIds는 정리한다.
        setNewIds([]);
        clearHighlight();

        if (!enabled) return;

        const persisted = safeRead(storageKey);
        baselineRef.current = persisted;
        isFirstVisitRef.current = !persisted;
    }, [storageKey, enabled, clearHighlight]);

    useEffect(() => () => cancelHighlightTimer(), [cancelHighlightTimer]);

    useEffect(() => {
        if (!enabled) return;
        if (!storageKey) return;

        const baseline = baselineRef.current;

        // items가 비어있으면 신규 판단/저장 모두 skip
        if (!items.length) {
            setNewIds([]);
            return;
        }

        // ✅ 이번 items에서 max timestamp + 해당 timestamp의 ids를 구한다.
        let currentMaxTs = 0;
        const idsAtMaxTs: string[] = [];
        for (const it of items) {
            const t = getTimeMs(it) ?? 0;
            if (!Number.isFinite(t) || t <= 0) continue;

            const id = getId(it) ?? null;
            if (t > currentMaxTs) {
                currentMaxTs = t;
                idsAtMaxTs.length = 0;
                if (id) idsAtMaxTs.push(id);
            } else if (t === currentMaxTs) {
                if (id) idsAtMaxTs.push(id);
            }
        }

        // timestamp가 0이면 저장/신규 판단 불가
        if (currentMaxTs <= 0) {
            setNewIds([]);
            return;
        }

        // ✅ 최초 방문이면 baseline만 저장하고 "신규 없음" 처리
        if (isFirstVisitRef.current || !baseline) {
            const next: Persisted = {
                v: 1,
                ts: currentMaxTs,
                idsAtTs: uniq(idsAtMaxTs).slice(0, maxRememberIdsAtTs),
            };
            safeWrite(storageKey, next);
            baselineRef.current = next;
            isFirstVisitRef.current = false;
            setNewIds([]);
            return;
        }

        const baselineTs = baseline.ts ?? 0;
        const baselineIds = new Set(baseline.idsAtTs ?? []);

        // ✅ 신규: baseline보다 시간 큰 것 + (동일 시간인데 baseline ids에 없던 것)
        const nextNewIds: string[] = [];
        for (const it of items) {
            const t = getTimeMs(it) ?? 0;
            if (!Number.isFinite(t) || t <= 0) continue;
            const id = getId(it) ?? null;
            if (!id) continue;

            if (t > baselineTs) {
                nextNewIds.push(id);
                continue;
            }

            if (t === baselineTs && !baselineIds.has(id)) {
                nextNewIds.push(id);
            }
        }

        const nextUniqNewIds = uniq(nextNewIds);
        setNewIds(nextUniqNewIds);

        // ✅ UI highlight는 refetch/정렬 등으로 items가 한 번 더 바뀌더라도 잠깐 유지한다.
        if (highlightDurationMs > 0 && nextUniqNewIds.length > 0) {
            setHighlightIds((prev) => uniq([...prev, ...nextUniqNewIds]));
            cancelHighlightTimer();
            highlightTimerRef.current = setTimeout(() => {
                highlightTimerRef.current = null;
                setHighlightIds([]);
            }, highlightDurationMs);
        }

        // ✅ baseline 갱신은 "단조 증가"만 허용 (날짜 범위 변경 등으로 ts가 낮아지는 경우 baseline을 덮지 않음)
        if (currentMaxTs > baselineTs) {
            const next: Persisted = {
                v: 1,
                ts: currentMaxTs,
                idsAtTs: uniq(idsAtMaxTs).slice(0, maxRememberIdsAtTs),
            };
            safeWrite(storageKey, next);
            baselineRef.current = next;
        } else if (currentMaxTs === baselineTs) {
            // 동일 timestamp에 새 id가 들어왔을 수 있어서 union 저장
            const merged = uniq([...(baseline.idsAtTs ?? []), ...idsAtMaxTs]).slice(0, maxRememberIdsAtTs);
            if (merged.length !== (baseline.idsAtTs ?? []).length) {
                const next: Persisted = { v: 1, ts: baselineTs, idsAtTs: merged };
                safeWrite(storageKey, next);
                baselineRef.current = next;
            }
        }
    }, [
        enabled,
        storageKey,
        items,
        getId,
        getTimeMs,
        maxRememberIdsAtTs,
        highlightDurationMs,
        cancelHighlightTimer,
    ]);

    const effectiveNewIds = enabled ? newIds : EMPTY_STR_ARR;
    const effectiveHighlightIds = enabled ? highlightIds : EMPTY_STR_ARR;

    const newIdSet = useMemo(() => new Set(effectiveHighlightIds), [effectiveHighlightIds]);

    const state = useMemo(
        () => ({
            newIds: effectiveNewIds,
            newIdSet,
        }),
        [effectiveNewIds, newIdSet]
    );

    const actions = useMemo(
        () => ({
            clear,
        }),
        [clear]
    );

    return { state, actions };
};
