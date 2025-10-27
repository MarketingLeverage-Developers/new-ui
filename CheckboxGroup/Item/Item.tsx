import React, { useEffect, useMemo } from 'react';
import Toggle from '@/shared/headless/Toggle/Toggle';
import { FaCheck } from 'react-icons/fa';
import { useCheckboxGroup } from '../CheckboxGroupContext';
import styles from '../CheckboxGroup.module.scss';

export type ItemProps = {
    value: string;
    children: React.ReactNode;
};

const Item: React.FC<ItemProps> = ({ value, children }) => {
    const { checked, setChecked, registerItem, unregisterItem, currentCategory } = useCheckboxGroup();

    useEffect(() => {
        if (!currentCategory) {
            // 그룹 안에는 있지만 카테고리 바깥에 아이템이 놓였을 때 개발자 친화적 경고
            if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    '[CheckboxGroup] Item must be placed inside <CheckboxGroup.Category /> to support all-check.'
                );
            }
            return;
        }
        registerItem(currentCategory, value);
        return () => unregisterItem(currentCategory, value);
    }, [currentCategory, value, registerItem, unregisterItem]);

    const isChecked = useMemo(() => checked.has(value), [checked, value]);

    const onChange = (next: boolean) => {
        setChecked((prev) => {
            const base = new Set(prev as Set<string>);
            if (next) base.add(value);
            else base.delete(value);
            return base;
        });
    };

    return (
        <div className={styles.ItemWrapper}>
            <Toggle value={isChecked} onChange={onChange}>
                <Toggle.Trigger className={styles.Item}>{isChecked && <FaCheck size={10} />}</Toggle.Trigger>
                <span>{children}</span>
            </Toggle>
        </div>
    );
};

export default Item;
