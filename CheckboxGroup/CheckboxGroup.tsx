import React, { useCallback, useMemo, useState } from 'react';
import { CheckboxGroupCtx } from './CheckboxGroupContext';
import Category from './Category/Category';
import Item from './Item/Item';
import Content from './Content/Content';

export type CheckboxGroupProps = {
    /** 외부에서 관리하는 체크된 ID 배열 */
    value: string[];
    /** 변경 시 호출 (다음 체크된 ID 배열) */
    onChange: (ids: string[]) => void;
    children: React.ReactNode;
    className?: string;
};

const CheckboxGroup: React.FC<CheckboxGroupProps> & {
    Category: typeof Category;
    Item: typeof Item;
    Content: typeof Content;
} = ({ value, onChange, children, className }) => {
    // 선택 상태 (controlled)
    const checked = useMemo(() => new Set(value), [value]);

    const setChecked: React.Dispatch<React.SetStateAction<Set<string>>> = useCallback(
        (updater) => {
            const prev = new Set(value);
            const next =
                typeof updater === 'function' ? (updater as (prev: Set<string>) => Set<string>)(prev) : updater;
            onChange(Array.from(next));
        },
        [value, onChange]
    );
    const [categories, setCategories] = useState<Map<string, Set<string>>>(new Map());
    const registerItem = useCallback((category: string, id: string) => {
        setCategories((prev) => {
            const map = new Map(prev);
            const set = new Set(map.get(category) ?? []);
            set.add(id);
            map.set(category, set);
            return map;
        });
    }, []);

    const unregisterItem = useCallback((category: string, id: string) => {
        setCategories((prev) => {
            const map = new Map(prev);
            if (!map.has(category)) return map;
            const set = new Set(map.get(category)!);
            set.delete(id);
            if (set.size === 0) map.delete(category);
            else map.set(category, set);
            return map;
        });
    }, []);

    return (
        <CheckboxGroupCtx.Provider value={{ checked, setChecked, categories, registerItem, unregisterItem }}>
            <div className={className} style={{ display: 'grid', gap: 8 }}>
                {children}
            </div>
        </CheckboxGroupCtx.Provider>
    );
};

CheckboxGroup.Category = Category;
CheckboxGroup.Content = Content;
CheckboxGroup.Item = Item;

export default CheckboxGroup;
