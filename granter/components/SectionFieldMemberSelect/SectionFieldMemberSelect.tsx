import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import { getFallbackUserProfileSrc } from '@/shared/utils/profile/getFallbackUserProfileSrc';
import React, { useEffect, useMemo, useState } from 'react';
import { HiCheck, HiOutlinePlus, HiXMark } from 'react-icons/hi2';
import classNames from 'classnames';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import styles from './SectionFieldMemberSelect.module.scss';

const noop = () => undefined;

const normalizeText = (value: string) => value.trim().toLowerCase();
const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};
const uniqValues = <T extends string>(values: readonly T[]) => Array.from(new Set(values));

export type SectionFieldMemberSelectOption<T extends string = string> = {
    value: T;
    label: string;
    profileImageUrl?: string | null;
    disabled?: boolean;
    searchText?: string;
};

const resolveUserAvatarSrc = <T extends string>(option: SectionFieldMemberSelectOption<T>) => {
    const profileImageUrl = option.profileImageUrl?.trim();

    if (profileImageUrl && profileImageUrl.length > 0) {
        return profileImageUrl;
    }

    return getFallbackUserProfileSrc(option.value || option.label);
};

type SectionFieldMemberSelectCommonProps<T extends string = string> = {
    options: SectionFieldMemberSelectOption<T>[];
    className?: string;
    menuClassName?: string;
    disabled?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchEmptyText?: React.ReactNode;
    emptyLabel?: React.ReactNode;
    clearable?: boolean;
    clearLabel?: React.ReactNode;
    menuMaxHeight?: number | string;
    menuMinWidth?: number | string;
};

type SectionFieldMemberSelectSingleProps<T extends string = string> = SectionFieldMemberSelectCommonProps<T> & {
    multiple?: false;
    value?: T;
    defaultValue?: T;
    onChange?: (nextValue: T) => void;
    clearValue?: T;
};

type SectionFieldMemberSelectMultipleProps<T extends string = string> = SectionFieldMemberSelectCommonProps<T> & {
    multiple: true;
    values?: T[];
    defaultValues?: T[];
    onValuesChange?: (nextValues: T[]) => void;
    maxVisibleAvatars?: number;
};

export type SectionFieldMemberSelectProps<T extends string = string> =
    | SectionFieldMemberSelectSingleProps<T>
    | SectionFieldMemberSelectMultipleProps<T>;

type SectionFieldMemberSelectCssProperties = React.CSSProperties & {
    '--granter-section-field-member-select-menu-min-width'?: string;
};

const getOptionSearchText = <T extends string>(option: SectionFieldMemberSelectOption<T>) => {
    if (typeof option.searchText === 'string' && option.searchText.trim().length > 0) {
        return option.searchText;
    }

    return option.label;
};

const toAccessibleText = (value: React.ReactNode, fallback: string) => {
    if (typeof value === 'string' && value.trim().length > 0) return value;
    if (typeof value === 'number') return String(value);
    return fallback;
};

const useFilteredOptions = <T extends string>(
    options: SectionFieldMemberSelectOption<T>[],
    searchable: boolean,
    searchQuery: string
) => {
    const normalizedSearchQuery = normalizeText(searchQuery);

    return useMemo(
        () =>
            !searchable || normalizedSearchQuery.length === 0
                ? options
                : options.filter((option) =>
                      normalizeText(getOptionSearchText(option)).includes(normalizedSearchQuery)
                  ),
        [normalizedSearchQuery, options, searchable]
    );
};

type TriggerContentProps<T extends string = string> = {
    selectedOptions: SectionFieldMemberSelectOption<T>[];
    emptyLabel: React.ReactNode;
    multiple?: boolean;
    maxVisibleAvatars?: number;
};

const TriggerContent = <T extends string>({
    selectedOptions,
    emptyLabel,
    multiple = false,
    maxVisibleAvatars = 3,
}: TriggerContentProps<T>) => {
    if (selectedOptions.length === 0) {
        return <span className={styles.EmptyBadge}>{emptyLabel}</span>;
    }

    const visibleOptions = multiple ? selectedOptions.slice(0, Math.max(1, maxVisibleAvatars)) : selectedOptions.slice(0, 1);
    const hiddenCount = multiple ? Math.max(0, selectedOptions.length - visibleOptions.length) : 0;

    return (
        <span className={styles.SelectedStack}>
            <span className={styles.AddBadge} aria-hidden="true">
                <HiOutlinePlus size={18} />
            </span>
            <span className={styles.AvatarCluster}>
                {visibleOptions.map((option) => (
                    <MemberProfileAvatar
                        key={option.value}
                        className={styles.SelectedAvatar}
                        name={option.label}
                        src={resolveUserAvatarSrc(option)}
                        size={40}
                        fontSize={13}
                    />
                ))}
                {hiddenCount > 0 ? <span className={styles.AvatarOverflow}>+{hiddenCount}</span> : null}
            </span>
        </span>
    );
};

type SectionFieldMemberSelectItemProps<T extends string = string> = {
    option: SectionFieldMemberSelectOption<T>;
    active?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    onSelect: (value: T) => void;
};

const SectionFieldMemberSelectItem = <T extends string>({
    option,
    active = false,
    disabled = false,
    multiple = false,
    onSelect,
}: SectionFieldMemberSelectItemProps<T>) => {
    const isDisabled = Boolean(disabled || option.disabled);

    return (
        <button
            type="button"
            className={styles.Option}
            data-active={active ? 'true' : 'false'}
            disabled={isDisabled}
            onClick={() => {
                if (isDisabled) return;
                onSelect(option.value);
            }}
        >
            <MemberProfileAvatar name={option.label} src={resolveUserAvatarSrc(option)} size={26} fontSize={11} />
            <span className={styles.OptionLabel}>{option.label}</span>
            {multiple ? (
                <span className={styles.OptionCheck} data-active={active ? 'true' : 'false'} aria-hidden="true">
                    {active ? <HiCheck size={14} /> : null}
                </span>
            ) : null}
        </button>
    );
};

type SectionFieldMemberSelectClearItemProps = {
    active?: boolean;
    disabled?: boolean;
    label: React.ReactNode;
    onClear: () => void;
};

const SectionFieldMemberSelectClearItem = ({
    active = false,
    disabled = false,
    label,
    onClear,
}: SectionFieldMemberSelectClearItemProps) => (
    <button
        type="button"
        className={styles.Option}
        data-active={active ? 'true' : 'false'}
        disabled={disabled}
        onClick={() => {
            if (disabled) return;
            onClear();
        }}
    >
        <span className={styles.ClearDot} aria-hidden="true" />
        <span className={styles.OptionLabel}>{label}</span>
    </button>
);

type SectionFieldMemberSelectMenuProps<T extends string = string> = {
    selectedOptions: SectionFieldMemberSelectOption<T>[];
    filteredOptions: SectionFieldMemberSelectOption<T>[];
    multiple?: boolean;
    clearable?: boolean;
    clearLabel: React.ReactNode;
    disabled?: boolean;
    searchEmptyText: React.ReactNode;
    isSelected: (value: T) => boolean;
    isClearActive: boolean;
    onSelect: (value: T) => void;
    onClear: () => void;
    onRemoveSelected: (value: T) => void;
};

const SectionFieldMemberSelectMenu = <T extends string>({
    selectedOptions,
    filteredOptions,
    multiple = false,
    clearable = false,
    clearLabel,
    disabled = false,
    searchEmptyText,
    isSelected,
    isClearActive,
    onSelect,
    onClear,
    onRemoveSelected,
}: SectionFieldMemberSelectMenuProps<T>) => (
    <div className={styles.OptionsViewport}>
        {multiple && selectedOptions.length > 0 ? (
            <div className={styles.SelectedSection}>
                <div className={styles.SelectedSectionLabel}>선택된 담당자</div>
                <div className={styles.SelectedList}>
                    {selectedOptions.map((option, index) => (
                        <button
                            key={option.value}
                            type="button"
                            className={styles.SelectedItem}
                            disabled={disabled}
                            onClick={() => {
                                if (disabled) return;
                                onRemoveSelected(option.value);
                            }}
                        >
                            <MemberProfileAvatar
                                name={option.label}
                                src={resolveUserAvatarSrc(option)}
                                size={22}
                                fontSize={10}
                            />
                            <span className={styles.SelectedItemLabel}>
                                {option.label}
                                {index === 0 ? ' · 주 담당자' : ''}
                            </span>
                            <span className={styles.SelectedItemRemove} aria-hidden="true">
                                <HiXMark size={14} />
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        ) : null}

        {clearable ? (
            <SectionFieldMemberSelectClearItem
                label={clearLabel}
                active={isClearActive}
                disabled={disabled}
                onClear={onClear}
            />
        ) : null}

        {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
                <SectionFieldMemberSelectItem
                    key={option.value}
                    option={option}
                    active={isSelected(option.value)}
                    disabled={disabled}
                    multiple={multiple}
                    onSelect={onSelect}
                />
            ))
        ) : (
            <div className={styles.Empty}>{searchEmptyText}</div>
        )}
    </div>
);

type SectionFieldMemberSelectBaseProps<T extends string = string> = SectionFieldMemberSelectCommonProps<T> & {
    selectedValues: T[];
    multiple?: boolean;
    maxVisibleAvatars?: number;
    isClearActive: boolean;
    onSelect: (value: T) => void;
    onClear: () => void;
};

const SectionFieldMemberSelectBase = <T extends string>({
    options,
    className,
    menuClassName,
    disabled = false,
    searchable = true,
    searchPlaceholder = '이름으로 검색',
    searchEmptyText = '선택 가능한 담당자가 없습니다.',
    emptyLabel = '담당자 추가',
    clearable = false,
    clearLabel = '선택 안함',
    menuMaxHeight = 240,
    menuMinWidth = 240,
    selectedValues,
    multiple = false,
    maxVisibleAvatars = 3,
    isClearActive,
    onSelect,
    onClear,
}: SectionFieldMemberSelectBaseProps<T>) => {
    const { isOpen } = useDropdown();
    const [searchQuery, setSearchQuery] = useState('');
    const filteredOptions = useFilteredOptions(options, searchable, searchQuery);
    const optionMap = useMemo(() => new Map(options.map((option) => [option.value, option])), [options]);
    const selectedOptions = useMemo(
        () => selectedValues.map((value) => optionMap.get(value)).filter(Boolean) as SectionFieldMemberSelectOption<T>[],
        [optionMap, selectedValues]
    );
    const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
    const cssVariables: SectionFieldMemberSelectCssProperties = {
        '--granter-section-field-member-select-menu-min-width': toCssLength(menuMinWidth),
    };
    const hasMenuItems = clearable || options.length > 0;
    const selectedLabelText = selectedOptions.map((option) => option.label).join(', ');

    useEffect(() => {
        if (isOpen) return;
        setSearchQuery('');
    }, [isOpen]);

    return (
        <div className={classNames(styles.Root, className)} style={cssVariables}>
            <Dropdown.Trigger className={styles.TriggerWrap} disabled={disabled}>
                <button
                    type="button"
                    className={styles.Trigger}
                    data-open={isOpen ? 'true' : 'false'}
                    data-has-value={selectedOptions.length > 0 ? 'true' : 'false'}
                    disabled={disabled}
                    title={selectedLabelText || undefined}
                    aria-label={
                        selectedOptions.length > 0
                            ? multiple
                                ? `${selectedOptions.length}명 선택됨`
                                : `${selectedOptions[0]?.label ?? ''} 선택됨`
                            : toAccessibleText(emptyLabel, '담당자 추가')
                    }
                >
                    <TriggerContent
                        selectedOptions={selectedOptions}
                        emptyLabel={emptyLabel}
                        multiple={multiple}
                        maxVisibleAvatars={maxVisibleAvatars}
                    />
                </button>
            </Dropdown.Trigger>

            {hasMenuItems ? (
                <Dropdown.Content
                    className={classNames(styles.Menu, menuClassName)}
                    placement="bottom-start"
                    keepMounted={false}
                    style={{ maxHeight: menuMaxHeight }}
                >
                    {searchable ? (
                        <div className={styles.SearchWrap}>
                            <input
                                type="text"
                                value={searchQuery}
                                className={styles.SearchInput}
                                placeholder={searchPlaceholder}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                aria-label={searchPlaceholder}
                            />
                        </div>
                    ) : null}

                    <SectionFieldMemberSelectMenu
                        selectedOptions={selectedOptions}
                        filteredOptions={filteredOptions}
                        multiple={multiple}
                        clearable={clearable}
                        clearLabel={clearLabel}
                        disabled={disabled}
                        searchEmptyText={searchEmptyText}
                        isSelected={(value) => selectedSet.has(value)}
                        isClearActive={isClearActive}
                        onSelect={onSelect}
                        onClear={onClear}
                        onRemoveSelected={onSelect}
                    />
                </Dropdown.Content>
            ) : null}
        </div>
    );
};

const SectionFieldMemberSelectSingle = <T extends string>({
    options,
    value,
    defaultValue,
    onChange = noop,
    clearValue = '' as T,
    clearable = false,
    clearLabel = '선택 안함',
    ...rest
}: SectionFieldMemberSelectSingleProps<T>) => {
    const { close } = useDropdown();
    const [internalValue, setInternalValue] = useState<T>(defaultValue ?? clearValue);
    const isControlled = value !== undefined;
    const selectedValue = (isControlled ? (value as T) : internalValue) ?? clearValue;
    const hasSelection = selectedValue !== clearValue;
    const selectedValues = hasSelection ? [selectedValue] : [];

    const handleChange = (nextValue: T) => {
        if (!isControlled) {
            setInternalValue(nextValue);
        }
        onChange(nextValue);
    };

    return (
        <SectionFieldMemberSelectBase
            {...rest}
            options={options}
            clearable={clearable}
            clearLabel={clearLabel}
            selectedValues={selectedValues}
            isClearActive={!hasSelection}
            onSelect={(nextValue) => {
                handleChange(nextValue);
                close();
            }}
            onClear={() => {
                handleChange(clearValue);
                close();
            }}
        />
    );
};

const SectionFieldMemberSelectMultiple = <T extends string>({
    options,
    values,
    defaultValues,
    onValuesChange = noop,
    maxVisibleAvatars = 3,
    clearable = false,
    clearLabel = '전체 해제',
    ...rest
}: SectionFieldMemberSelectMultipleProps<T>) => {
    const [internalValues, setInternalValues] = useState<T[]>(() => uniqValues(defaultValues ?? []));
    const isControlled = values !== undefined;
    const selectedValues = useMemo(
        () => uniqValues((isControlled ? values : internalValues) ?? []),
        [internalValues, isControlled, values]
    );

    const handleChange = (nextValues: T[]) => {
        const normalizedNextValues = uniqValues(nextValues);

        if (!isControlled) {
            setInternalValues(normalizedNextValues);
        }

        onValuesChange(normalizedNextValues);
    };

    return (
        <SectionFieldMemberSelectBase
            {...rest}
            options={options}
            multiple
            maxVisibleAvatars={maxVisibleAvatars}
            clearable={clearable}
            clearLabel={clearLabel}
            selectedValues={selectedValues}
            isClearActive={selectedValues.length === 0}
            onSelect={(nextValue) => {
                handleChange(
                    selectedValues.includes(nextValue)
                        ? selectedValues.filter((value) => value !== nextValue)
                        : [...selectedValues, nextValue]
                );
            }}
            onClear={() => handleChange([])}
        />
    );
};

const isMultipleProps = <T extends string>(
    props: SectionFieldMemberSelectProps<T>
): props is SectionFieldMemberSelectMultipleProps<T> => props.multiple === true;

const SectionFieldMemberSelect = (<T extends string = string>(props: SectionFieldMemberSelectProps<T>) => (
    <Dropdown>
        {isMultipleProps(props) ? (
            <SectionFieldMemberSelectMultiple {...props} />
        ) : (
            <SectionFieldMemberSelectSingle {...props} />
        )}
    </Dropdown>
)) as <T extends string = string>(props: SectionFieldMemberSelectProps<T>) => React.ReactElement;

export default SectionFieldMemberSelect;
