import React, { useCallback, useMemo, useState } from 'react';
import { CheckboxGroupCtx } from './CheckboxGroupContext';
import Category from './Category/Category';
import Item from './Item/Item';
import Content from './Content/Content';

export type CheckboxGroupProps = {
    /** controlled selected ids */
    value?: string[];
    /** uncontrolled default selected ids */
    defaultValue?: string[];
    onChange?: (ids: string[]) => void;
    children: React.ReactNode;
    className?: string;
};

const CheckboxGroup: React.FC<CheckboxGroupProps> & {
    Category: typeof Category;
    Item: typeof Item;
    Content: typeof Content;
} = ({ value, defaultValue = [], onChange, children, className }) => {
    // registry of items
    const [allIds, setAllIds] = useState<Set<string>>(new Set());
    const [disabledIds, setDisabledIds] = useState<Set<string>>(new Set());

    const registerId = useCallback((id: string, disabled?: boolean) => {
        setAllIds((prev) => new Set(prev).add(id));
        if (disabled) setDisabledIds((prev) => new Set(prev).add(id));
    }, []);

    const unregisterId = useCallback((id: string) => {
        setAllIds((prev) => {
            const n = new Set(prev);
            n.delete(id);
            return n;
        });
        setDisabledIds((prev) => {
            const n = new Set(prev);
            n.delete(id);
            return n;
        });
    }, []);

    // checked (controlled/uncontrolled)
    const isControlled = Array.isArray(value);
    const [internal, setInternal] = useState<Set<string>>(new Set(defaultValue));
    const checked = useMemo(() => (isControlled ? new Set(value) : internal), [isControlled, value, internal]);

    const setChecked: React.Dispatch<React.SetStateAction<Set<string>>> = useCallback(
        (updater) => {
            if (isControlled) {
                const next =
                    typeof updater === 'function' ? (updater as (prev: Set<string>) => Set<string>)(checked) : updater;
                onChange?.(Array.from(next as Set<string>));
            } else {
                setInternal((prev) => {
                    const next =
                        typeof updater === 'function' ? (updater as (prev: Set<string>) => Set<string>)(prev) : updater;
                    onChange?.(Array.from(next));
                    return next;
                });
            }
        },
        [isControlled, checked, onChange]
    );

    return (
        <CheckboxGroupCtx.Provider value={{ checked, setChecked, allIds, disabledIds, registerId, unregisterId }}>
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
