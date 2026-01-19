import React, { useEffect, useMemo } from 'react';
import Toggle from '@/shared/headless/Toggle/Toggle';
import { FaCheck } from 'react-icons/fa';
import { useCheckboxGroup } from '../CheckboxGroupContext';
import styles from '../CheckboxGroup.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';

export type ItemProps = {
    value: string;
    children: React.ReactNode;
    bgColor?: HexColor | ThemeColorVar;
    borderColor?: HexColor | ThemeColorVar;
};

const Item: React.FC<ItemProps> = ({ value, children, bgColor, borderColor }) => {
    const { checked, setChecked, registerItem, unregisterItem, currentCategory } = useCheckboxGroup();

    useEffect(() => {
        if (!currentCategory) {
            console.warn('[CheckboxGroup] Item must be placed inside <CheckboxGroup.Category /> to support all-check.');
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

    const cssVariables: CSSVariables = {
        '--background-color': bgColor,
        '--border-color': borderColor,
    } as const;

    return (
        <Toggle value={isChecked} onChange={onChange}>
            <Toggle.Trigger style={{ ...cssVariables }} className={styles.ItemWrapper}>
                <button className={styles.Item}>{isChecked && <FaCheck size={10} />}</button>
                <span>{children}</span>
            </Toggle.Trigger>
        </Toggle>
    );
};

export default Item;
