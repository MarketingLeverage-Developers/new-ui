import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './CreatableTabs.module.scss';

type Tab = { id: string; label: string };

type Props = {
    labels: string[]; // ex) ["0","1"] or ["AA","BB"]

    /** ex) "요청" => "요청2", "요청3"... */
    repeatLabel?: string;

    /** 초기 반복 탭 개수 (repeatLabel가 있을 때만 의미) */
    initialRepeatCount?: number; // default 0

    /** 반복 탭 인덱스 시작값 */
    repeatStartIndex?: number; // default 1

    value?: string;
    onChange?: (next: string, tabs: Tab[], index: number) => void;

    /** 최대 탭 수(고정+반복 포함). 0/undefined면 제한 없음 */
    maxTabs?: number;

    /** "추가" 탭 표시/동작 여부 */
    editable?: boolean;

    /** "추가" 라벨 */
    addLabel?: string; // default "서브 페이지"
};

// ---------- helpers ----------
const uniq = (arr: string[]) => Array.from(new Set(arr));

const toFixedTabs = (labels: string[]): Tab[] => labels.map((l) => ({ id: l, label: l }));

/** repeatLabel 기반 탭인지 판별 */
const isRepeatTabId = (id: string, repeatLabel?: string) => Boolean(repeatLabel && id.startsWith(repeatLabel));

/** repeatLabel + 숫자 형태에서 숫자 뽑기 (요청2 -> 2) */
const parseRepeatIndex = (id: string, repeatLabel?: string): number | null => {
    if (!repeatLabel) return null;
    if (!id.startsWith(repeatLabel)) return null;
    const rest = id.slice(repeatLabel.length);
    const n = Number(rest);
    return Number.isFinite(n) ? n : null;
};

/** 다음 repeat index 계산(현재 tabs/labels에 있는 최대 인덱스 + 1, 최소 repeatStartIndex 보장) */
const computeNextRepeatIndex = (allTabIds: string[], repeatLabel: string, repeatStartIndex: number) => {
    const indices = allTabIds.map((id) => parseRepeatIndex(id, repeatLabel)).filter((n): n is number => n != null);

    const maxIdx = indices.length ? Math.max(...indices) : repeatStartIndex - 1;
    return Math.max(maxIdx + 1, repeatStartIndex);
};

const CreatableTabs = ({
    labels,
    repeatLabel,
    initialRepeatCount = 0,
    repeatStartIndex = 1,
    value: controlled,
    onChange,
    maxTabs,
    editable = false,
    addLabel = '서브 페이지',
}: Props) => {
    // fixed는 항상 labels 그대로
    const fixedTabs = useMemo(() => toFixedTabs(labels ?? []), [labels]);

    // repeatTabs는 내부에서만 유지 (labels 변화로 reset하지 않음)
    const [repeatTabs, setRepeatTabs] = useState<Tab[]>(() => {
        if (!repeatLabel) return [];
        const created: Tab[] = [];
        for (let i = 0; i < (initialRepeatCount ?? 0); i++) {
            const idx = repeatStartIndex + i;
            const id = `${repeatLabel}${idx}`;
            created.push({ id, label: id });
        }
        return created;
    });

    // 최초 마운트에서만 initialRepeatCount로 seed하기 위한 ref
    const didSeedRef = useRef(false);

    useEffect(() => {
        // ✅ initialRepeatCount로 만드는 repeat 탭은 "최초 1회만"
        // 서버 로딩/labels 변경으로 reset되면 안 됨
        if (didSeedRef.current) return;
        didSeedRef.current = true;

        if (!repeatLabel) return;

        setRepeatTabs((prev) => {
            if (prev.length > 0) return prev;

            const created: Tab[] = [];
            for (let i = 0; i < (initialRepeatCount ?? 0); i++) {
                const idx = repeatStartIndex + i;
                const id = `${repeatLabel}${idx}`;
                created.push({ id, label: id });
            }
            return created;
        });
    }, [repeatLabel, initialRepeatCount, repeatStartIndex]);

    // 최종 tabs: fixed + repeat (중복 제거)
    const tabs = useMemo(() => {
        const all = [...fixedTabs, ...repeatTabs];

        // ✅ labels와 repeat이 같은 id를 만들었거나, 외부에서 labels에 repeat형이 들어온 경우 중복 제거
        const seen = new Set<string>();
        const deduped: Tab[] = [];
        for (const t of all) {
            if (seen.has(t.id)) continue;
            seen.add(t.id);
            deduped.push(t);
        }
        return deduped;
    }, [fixedTabs, repeatTabs]);

    const isControlled = controlled !== undefined;
    const [internalValue, setInternalValue] = useState<string>(() => tabs[0]?.id ?? '');
    const value = isControlled ? (controlled as string) : internalValue;

    // ✅ value 보정: 현재 value가 tabs에 없으면 첫 탭으로만 보정 (reset 금지)
    useEffect(() => {
        if (tabs.length === 0) return;

        const exists = tabs.some((t) => t.id === value);
        if (exists) return;

        const fallback = tabs[0].id;
        if (!isControlled) setInternalValue(fallback);
        onChange?.(fallback, tabs, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tabs.map((t) => t.id).join('|')]);

    // 다음 repeat 인덱스(중복 방지)
    const nextRepeatIndex = useMemo(() => {
        if (!repeatLabel) return repeatStartIndex;
        const allIds = tabs.map((t) => t.id);
        return computeNextRepeatIndex(allIds, repeatLabel, repeatStartIndex);
    }, [tabs, repeatLabel, repeatStartIndex]);

    const emitChange = (next: string) => {
        const index = tabs.findIndex((t) => t.id === next);
        if (index < 0) return;

        if (!isControlled) setInternalValue(next);
        onChange?.(next, tabs, index);
    };

    const addRepeatTab = () => {
        if (!repeatLabel) return;

        // maxTabs 체크 (고정+반복 포함)
        if (maxTabs && tabs.length >= maxTabs) return;

        const id = `${repeatLabel}${nextRepeatIndex}`;

        // ✅ 혹시라도 외부 labels에 이미 존재하면(혹은 내부 repeat에 존재하면) 다음 인덱스로 밀어야 하지만,
        // computeNextRepeatIndex가 tabs 기준이라 여기선 중복 거의 없음. 그래도 안전장치:
        if (tabs.some((t) => t.id === id)) return;

        const nextTab: Tab = { id, label: id };

        setRepeatTabs((prev) => {
            // fixed(labels)랑 중복되면 추가하지 않음
            if (labels.includes(id)) return prev;
            if (prev.some((t) => t.id === id)) return prev;
            return [...prev, nextTab];
        });

        // 추가 직후 선택 이동
        // (state 업데이트는 비동기라, onChange에 넘길 nextTabs를 직접 구성)
        const nextTabs = uniq([...tabs.map((t) => t.id), id]).map((tid) => ({ id: tid, label: tid }));
        if (!isControlled) setInternalValue(id);
        onChange?.(
            id,
            nextTabs as any,
            nextTabs.findIndex((t) => t.id === id)
        );
    };

    return (
        <div className={styles.Wrapper}>
            <div className={styles.TabList} role="tablist" aria-label="Tabs">
                {tabs.map((t) => {
                    const selected = t.id === value;

                    return (
                        <div key={t.id} className={styles.TabItem}>
                            <button
                                role="tab"
                                aria-selected={selected}
                                tabIndex={selected ? 0 : -1}
                                className={`${styles.TabButton} ${selected ? styles.Active : ''}`}
                                onClick={() => emitChange(t.id)}
                                type="button"
                            >
                                <span className={styles.Label}>{t.label}</span>
                            </button>
                        </div>
                    );
                })}

                {editable && repeatLabel && (
                    <div className={styles.TabItem}>
                        <button
                            type="button"
                            className={`${styles.AddTabButton} ${styles.AddTab}`}
                            onClick={addRepeatTab}
                        >
                            <span className={styles.Label}>{addLabel} +</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreatableTabs;
