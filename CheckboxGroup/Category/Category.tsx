import React, { useMemo } from 'react';
import { useCheckboxGroup, CheckboxGroupCtx } from '../CheckboxGroupContext';
import { FaCheck } from 'react-icons/fa';
import styles from '../CheckboxGroup.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';

export type CategoryProps = {
    /** 카테고리 키 (안 주면 title 사용) — 가능하면 안정적인 고유값 권장 */
    id?: string;
    title: string;
    selectAll?: boolean;
    bgColor?: string;
    color?: string;
    padding?: PaddingSize;
    children?: React.ReactNode;
};

const Category: React.FC<CategoryProps> = ({
    id,
    title,
    selectAll = true,
    bgColor = '#FFF3B7',
    color = '#BD7018',
    padding,
    children,
}) => {
    const parentCtx = useCheckboxGroup();
    const categoryKey = id ?? title;

    const enabledIds = useMemo(
        () => Array.from(parentCtx.categories.get(categoryKey) ?? []),
        [parentCtx.categories, categoryKey]
    );

    const total = enabledIds.length;
    const checkedCount = enabledIds.reduce((acc, x) => acc + (parentCtx.checked.has(x) ? 1 : 0), 0);
    const allChecked = total > 0 && checkedCount === total;

    const checkboxCss: CSSVariables = {
        '--backgroundColor': bgColor,
        '--color': color,
    };

    const contentCss: CSSVariables = {
        '--padding': toCssPadding(padding),
    };

    const onToggleParent = () => {
        if (!selectAll) return; // 전체선택 비활성화 시 무시
        parentCtx.setChecked((prev) => {
            const base = new Set(prev as Set<string>);
            if (allChecked) enabledIds.forEach((id) => base.delete(id));
            else enabledIds.forEach((id) => base.add(id));
            return base;
        });
    };

    // 같은 컨텍스트 타입을 재제공하되 currentCategory만 지정
    const childCtx = {
        ...parentCtx,
        currentCategory: categoryKey,
    };

    return (
        <CheckboxGroupCtx.Provider value={childCtx}>
            <div className={styles.CategoryWrapper}>
                <div
                    onClick={selectAll ? onToggleParent : undefined}
                    className={styles.Category}
                    style={{ cursor: selectAll ? 'pointer' : 'default' }}
                >
                    {selectAll ? (
                        <span style={{ ...checkboxCss }} className={styles.CategoryCheckbox}>
                            {allChecked ? <FaCheck size={16} color={color} /> : null}
                        </span>
                    ) : null}
                    <span style={{ fontWeight: 600 }}>{title}</span>
                </div>

                <div className={styles.Content} style={{ ...contentCss }}>
                    {children}
                </div>
            </div>
        </CheckboxGroupCtx.Provider>
    );
};

export default Category;
