import React, { useMemo } from 'react';
import { useCheckboxGroup } from '../CheckboxGroupContext';
import { FaCheck } from 'react-icons/fa';
import styles from '../CheckboxGroup.module.scss';

export type CategoryProps = {
    title: string;
    bgColor?: string;
};

const Category: React.FC<CategoryProps> = ({ title, bgColor = '#FFF3B7' }) => {
    const { checked, setChecked, allIds, disabledIds } = useCheckboxGroup();

    const enabledIds = useMemo(() => Array.from(allIds).filter((id) => !disabledIds.has(id)), [allIds, disabledIds]);
    const total = enabledIds.length;
    const checkedCount = enabledIds.reduce((acc, id) => acc + (checked.has(id) ? 1 : 0), 0);
    const allChecked = total > 0 && checkedCount === total;
    const noneChecked = checkedCount === 0;
    const someChecked = !allChecked && !noneChecked;

    const onToggleParent = () => {
        setChecked((prev) => {
            const base = new Set(prev as Set<string>);
            if (allChecked) {
                enabledIds.forEach((id) => base.delete(id));
            } else {
                enabledIds.forEach((id) => base.add(id));
            }
            return base;
        });
    };

    return (
        <div
            onClick={onToggleParent}
            className={styles.Category}
            style={{
                cursor: 'pointer',
                userSelect: 'none',
                outline: 'none',
                border: 'none',
                background: 'transparent',
                padding: 0,
            }}
        >
            <span
                aria-hidden
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    background: bgColor,
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)',
                }}
            >
                {allChecked ? (
                    <FaCheck size={16} />
                ) : someChecked ? (
                    <svg viewBox="0 0 20 20" width="16" height="16">
                        <rect x="4" y="9" width="12" height="2" rx="1" />
                    </svg>
                ) : null}
            </span>
            <span style={{ fontWeight: 600 }}>{title}</span>
        </div>
    );
};

export default Category;
