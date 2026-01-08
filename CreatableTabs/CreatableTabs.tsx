import { useEffect, useMemo, useState } from 'react';
import styles from './CreatableTabs.module.scss';

type Tab = { id: string; label: string };

type Props = {
    labels: string[]; // ex) ["AA", "BB"]

    /** ex) "CC" => "CC1", "CC2"... */
    repeatLabel?: string; // <- 추천 props 명

    /** 초기 반복 탭 개수 (repeatLabel가 있을 때만 의미) */
    initialRepeatCount?: number; // default 0

    /** 반복 탭 인덱스 시작값 */
    repeatStartIndex?: number; // default 1

    value?: string;
    onChange?: (next: string, tabs: Tab[]) => void;

    /** 최대 탭 수(고정+반복 포함). 0/undefined면 제한 없음 */
    maxTabs?: number;

    /** "서브 페이지 +" 탭 표시/동작 여부 */
    editable?: boolean;

    /** "서브 페이지 +" 라벨 */
    addLabel?: string; // default "서브 페이지 +"
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
    const initialTabs = useMemo<Tab[]>(() => {
        const fixed = labels.map((l) => ({ id: l, label: l }));

        const repeat: Tab[] = [];
        if (repeatLabel) {
            for (let i = 0; i < initialRepeatCount; i++) {
                const idx = repeatStartIndex + i;
                const label = `${repeatLabel}${idx}`;
                repeat.push({ id: label, label });
            }
        }

        return [...fixed, ...repeat];
    }, [labels, repeatLabel, initialRepeatCount, repeatStartIndex]);

    const [tabs, setTabs] = useState<Tab[]>(initialTabs);

    const isControlled = controlled !== undefined;
    const [internalValue, setInternalValue] = useState<string>(() => initialTabs[0]?.id ?? '');
    const value = isControlled ? (controlled as string) : internalValue;

    // 다음 반복 인덱스
    const [nextRepeatIndex, setNextRepeatIndex] = useState<number>(() => repeatStartIndex + (initialRepeatCount ?? 0));

    useEffect(() => {
        setTabs(initialTabs);
        setInternalValue(initialTabs[0]?.id ?? '');
        setNextRepeatIndex(repeatStartIndex + (initialRepeatCount ?? 0));
    }, [initialTabs, initialRepeatCount, repeatStartIndex]);

    const emitChange = (next: string, nextTabs: Tab[]) => {
        if (!isControlled) setInternalValue(next);
        onChange?.(next, nextTabs);
    };

    const addRepeatTab = () => {
        if (!repeatLabel) return;

        // maxTabs 체크 (고정+반복 포함)
        if (maxTabs && tabs.length >= maxTabs) return;

        const id = `${repeatLabel}${nextRepeatIndex}`;
        const nextTab: Tab = { id, label: id };

        setTabs((prev) => {
            const next = [...prev, nextTab];
            emitChange(id, next);
            return next;
        });

        setNextRepeatIndex((n) => n + 1);
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
                                onClick={() => emitChange(t.id, tabs)}
                                type="button"
                            >
                                <span className={styles.Label}>{t.label}</span>
                            </button>
                        </div>
                    );
                })}

                {/* 이미지의 "서브 페이지 +" 탭 */}
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
