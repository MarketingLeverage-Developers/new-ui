import { useEffect, useMemo, useState } from 'react';
import styles from './RequestTabs.module.scss';
import { FiPlus } from 'react-icons/fi';
import Flex from '../Flex/Flex';

type Tab = { id: string; label: string };

type Props = {
    initialLabel: string;
    value?: string;
    onChange?: (next: string, tabs: Tab[]) => void;
    maxTabs?: number;
    initialCount?: number;
    editable?: boolean;
};

const parseLabel = (label: string) => {
    const m = label.match(/^(.*?)(\d+)$/);
    if (m) return { prefix: m[1] || '탭', index: Number(m[2]) };
    return { prefix: label || '탭', index: 1 };
};

const RequestTabs = ({
    initialLabel,
    value: controlled,
    onChange,
    maxTabs = 5,
    initialCount = 1,
    editable = false,
}: Props) => {
    const { prefix, index } = useMemo(() => parseLabel(initialLabel), [initialLabel]);
    // const initialTabs = useMemo<Tab[]>(() => [{ id: initialLabel, label: initialLabel }], [initialLabel]);
    const initialTabs = useMemo<Tab[]>(() => {
        const arr: Tab[] = [];
        for (let i = 1; i <= (initialCount ?? 1); i++) {
            const label = `${prefix}${i}`;
            arr.push({ id: label, label });
        }
        return arr;
    }, [prefix, initialCount]);
    const [tabs, setTabs] = useState<Tab[]>(initialTabs);
    const [internalValue, setInternalValue] = useState(initialTabs[0].id);
    const isControlled = controlled !== undefined;
    const value = isControlled ? (controlled as string) : internalValue;
    const [nextIndex, setNextIndex] = useState(index + 1);

    useEffect(() => {
        setTabs(initialTabs);
        setInternalValue(initialTabs[0].id);
        setNextIndex((initialCount ?? 1) + 1);
    }, [initialTabs, initialCount]);

    const setValue = (next: string) => {
        if (!isControlled) setInternalValue(next);
        onChange?.(next, tabs);
    };

    const addTab = () => {
        if (maxTabs && tabs.length >= maxTabs) return;
        const id = `${prefix}${nextIndex}`;
        setTabs((prev) => [...prev, { id, label: id }]);
        setNextIndex((n) => n + 1);
        setValue(id);
    };

    const removeTab = (id: string) => {
        setTabs((prev) => {
            const idx = prev.findIndex((t) => t.id === id);
            const next = prev.filter((t) => t.id !== id);
            if (id === value) {
                const neighbor = next[idx - 1]?.id ?? next[idx]?.id ?? '';
                if (neighbor) setValue(neighbor);
            }
            return next;
        });
    };

    return (
        <div className={styles.Wrapper}>
            {/* 탭 리스트 */}
            <div className={styles.TabList} role="tablist" aria-label="Requests">
                {tabs.map((t, i) => {
                    const selected = t.id === value;
                    return (
                        <div key={t.id} className={styles.TabItem}>
                            <button
                                role="tab"
                                data-value={t.id}
                                aria-selected={selected}
                                tabIndex={selected ? 0 : -1}
                                className={`${styles.TabButton} ${selected ? styles.Active : ''}`}
                                onClick={() => setValue(t.id)}
                            >
                                <span className={styles.Label}>{t.label}</span>
                            </button>
                            {/* 닫기 버튼 */}
                            {/* {tabs.length > 1 && (
                                <button
                                    className={styles.Close}
                                    aria-label={`${t.label} 닫기`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTab(t.id);
                                    }}
                                >
                                    <MdClose />
                                </button>
                            )} */}
                        </div>
                    );
                })}
            </div>
            {editable && (
                <Flex align="center" justify="center" className={styles.Add} onClick={addTab}>
                    <FiPlus color="#7B7B7B" />
                </Flex>
            )}
        </div>
    );
};

export default RequestTabs;
