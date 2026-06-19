import React from 'react';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import Dropdown from '../../../shared/headless/Dropdown/Dropdown';
import styles from './FilterMultiSelect.module.scss';

export type FilterMultiSelectItem<T extends string | number = string | number> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
};

export type FilterMultiSelectProps<T extends string | number = string | number> = {
    label: React.ReactNode;
    sections: FilterMultiSelectItem<T>[];
    selectedValues: T[];
    onToggle: (value: T) => void;
    onClear?: () => void;
    disabled?: boolean;
    emptyText?: React.ReactNode;
};

const FilterMultiSelect = <T extends string | number = string | number>({
    label,
    sections,
    selectedValues,
    onToggle,
    onClear,
    disabled = false,
    emptyText = '옵션이 없습니다.',
}: FilterMultiSelectProps<T>) => {
    const selectedValueSet = React.useMemo(() => new Set(selectedValues), [selectedValues]);
    const selectedCount = selectedValues.length;

    return (
        <Dropdown>
            <Dropdown.Trigger className={styles.Trigger} role="button" tabIndex={0} disabled={disabled}>
                <span className={styles.TriggerLabel}>{label}</span>
                {selectedCount > 0 ? <span className={styles.Count}>{selectedCount}</span> : null}
                <MdOutlineKeyboardArrowDown className={styles.Arrow} />
            </Dropdown.Trigger>
            <Dropdown.Content className={styles.Menu} placement="bottom-start" offset={8} keepMounted={false}>
                <div className={styles.MenuHeader}>
                    <strong>{label}</strong>
                    {selectedCount > 0 && onClear ? (
                        <button type="button" onClick={onClear}>
                            초기화
                        </button>
                    ) : null}
                </div>
                <div className={styles.MenuList}>
                    {sections.length > 0 ? (
                        sections.map((item) => {
                            const selected = selectedValueSet.has(item.value);

                            return (
                                <button
                                    key={String(item.value)}
                                    type="button"
                                    className={styles.MenuItem}
                                    data-active={selected ? 'true' : 'false'}
                                    aria-pressed={selected}
                                    disabled={disabled || item.disabled}
                                    onClick={() => onToggle(item.value)}
                                >
                                    <span className={styles.Checkbox} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })
                    ) : (
                        <span className={styles.Empty}>{emptyText}</span>
                    )}
                </div>
            </Dropdown.Content>
        </Dropdown>
    );
};

export default FilterMultiSelect;
