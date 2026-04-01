import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { FiPlus, FiX } from 'react-icons/fi';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import BlackButton from '../Button/BlackButton';
import WhiteButton from '../Button/WhiteButton';
import SectionFieldInput from '../SectionFieldInput/SectionFieldInput';
import Text from '../Text/Text';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import styles from './SectionFieldMultiValueInput.module.scss';
import { joinCommaSeparatedValues, parseCommaSeparatedValues } from './utils';

export type SectionFieldMultiValueInputProps = {
    value: string;
    onChange: (nextValue: string) => void;
    inputPlaceholder?: string;
    emptyText?: string;
    addButtonText?: string;
    removeButtonText?: string;
    disabled?: boolean;
    variant?: 'default' | 'compact' | 'compact-dropdown';
};

const CompactDropdownChevron = () => {
    const { isOpen } = useDropdown();

    return (
        <span className={styles.CompactSummaryIcon} data-open={isOpen ? 'true' : 'false'}>
            <HiOutlineChevronDown size={16} />
        </span>
    );
};

type CompactDropdownFieldProps = {
    pendingValue: string;
    setPendingValue: React.Dispatch<React.SetStateAction<string>>;
    inputPlaceholder: string;
    addButtonText: string;
    emptyText: string;
    removeButtonText: string;
    disabled: boolean;
    selectedValues: string[];
    addPendingValues: () => void;
    removeValue: (targetValue: string) => void;
};

const CompactDropdownField = ({
    pendingValue,
    setPendingValue,
    inputPlaceholder,
    addButtonText,
    emptyText,
    removeButtonText,
    disabled,
    selectedValues,
    addPendingValues,
    removeValue,
}: CompactDropdownFieldProps) => {
    const { anchorRef, isOpen, toggle, menuId, setLastFocusedEl } = useDropdown();

    return (
        <>
            <div
                ref={anchorRef}
                className={classNames(styles.Form, styles.FormCompact)}
                data-disabled={disabled ? 'true' : 'false'}
            >
                <SectionFieldInput
                    value={pendingValue}
                    onChange={(event) => setPendingValue(event.target.value)}
                    placeholder={inputPlaceholder}
                    disabled={disabled}
                    className={styles.InputCompact}
                    onKeyDown={(event) => {
                        if (event.key !== 'Enter' && event.key !== ',') return;

                        event.preventDefault();
                        addPendingValues();
                    }}
                />

                <button
                    type="button"
                    className={styles.CompactAddButton}
                    disabled={disabled || pendingValue.trim().length === 0}
                    onClick={addPendingValues}
                    aria-label={addButtonText}
                >
                    <FiPlus size={20} />
                </button>

                <button
                    type="button"
                    className={styles.CompactSummaryTrigger}
                    disabled={disabled || selectedValues.length === 0}
                    aria-label={selectedValues.length > 0 ? `추가된 주소 ${selectedValues.length}개` : '주소 없음'}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    aria-controls={menuId}
                    onClick={() => {
                        if (disabled || selectedValues.length === 0) return;
                        if (!isOpen) setLastFocusedEl(document.activeElement as HTMLElement | null);
                        toggle();
                    }}
                    onKeyDown={(event) => {
                        if (disabled || selectedValues.length === 0) return;
                        if (event.key !== 'ArrowDown') return;

                        event.preventDefault();
                        if (!isOpen) setLastFocusedEl(document.activeElement as HTMLElement | null);
                        toggle();
                    }}
                >
                    <CompactDropdownChevron />
                </button>
            </div>

            <Dropdown.Content
                className={styles.CompactMenu}
                placement="bottom-start"
                matchTriggerWidth
                keepMounted={false}
                style={{ maxHeight: 280 }}
            >
                {selectedValues.length === 0 ? (
                    <div className={styles.CompactMenuEmpty}>
                        <Text size="sm" tone="muted">
                            {emptyText}
                        </Text>
                    </div>
                ) : (
                    <div className={styles.CompactMenuList}>
                        {selectedValues.map((item) => (
                            <div key={item} className={styles.CompactMenuItem}>
                                <Text
                                    size="sm"
                                    weight="medium"
                                    className={classNames(styles.ItemText, styles.CompactMenuItemText)}
                                >
                                    {item}
                                </Text>
                                <button
                                    type="button"
                                    className={styles.CompactRemoveButton}
                                    disabled={disabled}
                                    onClick={() => removeValue(item)}
                                    aria-label={`${item} ${removeButtonText}`}
                                >
                                    <FiX size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </Dropdown.Content>
        </>
    );
};

const SectionFieldMultiValueInput = ({
    value,
    onChange,
    inputPlaceholder = '값을 입력하세요',
    emptyText = '추가된 항목이 없습니다.',
    addButtonText = '추가',
    removeButtonText = '제거',
    disabled = false,
    variant = 'default',
}: SectionFieldMultiValueInputProps) => {
    const [pendingValue, setPendingValue] = useState('');
    const selectedValues = useMemo(() => parseCommaSeparatedValues(value), [value]);
    const isCompact = variant === 'compact';
    const isCompactDropdown = variant === 'compact-dropdown';
    const isCompactControl = isCompact || isCompactDropdown;

    const addPendingValues = useCallback(() => {
        const nextCandidates = parseCommaSeparatedValues(pendingValue);

        if (nextCandidates.length === 0) return;

        const nextValues = [...selectedValues];

        nextCandidates.forEach((candidate) => {
            if (!nextValues.includes(candidate)) {
                nextValues.push(candidate);
            }
        });

        onChange(joinCommaSeparatedValues(nextValues));
        setPendingValue('');
    }, [onChange, pendingValue, selectedValues]);

    const removeValue = useCallback(
        (targetValue: string) => {
            onChange(joinCommaSeparatedValues(selectedValues.filter((item) => item !== targetValue)));
        },
        [onChange, selectedValues]
    );

    return (
        <div className={styles.Root}>
            {isCompactDropdown ? (
                <Dropdown>
                    <CompactDropdownField
                        pendingValue={pendingValue}
                        setPendingValue={setPendingValue}
                        inputPlaceholder={inputPlaceholder}
                        addButtonText={addButtonText}
                        emptyText={emptyText}
                        removeButtonText={removeButtonText}
                        disabled={disabled}
                        selectedValues={selectedValues}
                        addPendingValues={addPendingValues}
                        removeValue={removeValue}
                    />
                </Dropdown>
            ) : null}

            {isCompactDropdown ? null : (
                <div
                    className={classNames(styles.Form, isCompactControl && styles.FormCompact)}
                    data-disabled={disabled ? 'true' : 'false'}
                >
                    <SectionFieldInput
                        value={pendingValue}
                        onChange={(event) => setPendingValue(event.target.value)}
                        placeholder={inputPlaceholder}
                        disabled={disabled}
                        className={classNames(isCompactControl && styles.InputCompact)}
                        onKeyDown={(event) => {
                            if (event.key !== 'Enter' && event.key !== ',') return;

                            event.preventDefault();
                            addPendingValues();
                        }}
                    />
                    {isCompactControl ? (
                        <button
                            type="button"
                            className={styles.CompactAddButton}
                            disabled={disabled || pendingValue.trim().length === 0}
                            onClick={addPendingValues}
                            aria-label={addButtonText}
                        >
                            <FiPlus size={24} />
                        </button>
                    ) : (
                        <BlackButton
                            size="sm"
                            disabled={disabled || pendingValue.trim().length === 0}
                            onClick={addPendingValues}
                        >
                            {addButtonText}
                        </BlackButton>
                    )}
                </div>
            )}

            {isCompactDropdown ? null : selectedValues.length === 0 ? (
                <Text size="sm" tone="muted">
                    {emptyText}
                </Text>
            ) : (
                <div className={classNames(styles.List, isCompact && styles.ListCompact)}>
                    {selectedValues.map((item) => (
                        <div key={item} className={classNames(styles.Item, isCompact && styles.ItemCompact)}>
                            <Text size="sm" weight="medium" className={styles.ItemText}>
                                {item}
                            </Text>
                            {isCompact ? (
                                <button
                                    type="button"
                                    className={styles.CompactRemoveButton}
                                    disabled={disabled}
                                    onClick={() => removeValue(item)}
                                    aria-label={`${item} ${removeButtonText}`}
                                >
                                    <FiX size={18} />
                                </button>
                            ) : (
                                <WhiteButton size="sm" disabled={disabled} onClick={() => removeValue(item)}>
                                    {removeButtonText}
                                </WhiteButton>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SectionFieldMultiValueInput;
