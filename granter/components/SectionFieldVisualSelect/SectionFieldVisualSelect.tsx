import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { HiCheck, HiOutlinePlus, HiXMark } from 'react-icons/hi2';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import styles from './SectionFieldVisualSelect.module.scss';

const noop = () => undefined;

export type SectionFieldVisualMode = 'avatar' | 'icon';

const normalizeText = (value: string) => value.trim().toLowerCase();
const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};
const uniqValues = <T extends string>(values: readonly T[]) => Array.from(new Set(values));

const getBackgroundColor = (seed: string) => {
    const normalizedSeed = seed || 'option';
    let hash = 0;

    for (let index = 0; index < normalizedSeed.length; index += 1) {
        hash = normalizedSeed.charCodeAt(index) + ((hash << 5) - hash);
        hash |= 0;
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue} 60% 62%)`;
};

const getFallbackVisualText = (label: string, visualText?: string) => {
    const normalizedVisualText = String(visualText ?? '').trim();

    if (normalizedVisualText.length > 0) {
        return Array.from(normalizedVisualText.replace(/\s+/g, ''))
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    const normalizedLabel = String(label).trim();
    if (!normalizedLabel) return '?';

    const compact = normalizedLabel.replace(/\s+/g, '');
    const firstChar = Array.from(compact)[0] ?? '?';

    if (/[a-z0-9]/i.test(firstChar)) {
        return Array.from(compact)
            .slice(0, 2)
            .join('')
            .toUpperCase();
    }

    return firstChar.toUpperCase();
};

export type SectionFieldVisualSelectOption<T extends string = string> = {
    value: T;
    label: string;
    imageSrc?: string | null;
    imageAlt?: string;
    visualText?: string;
    disabled?: boolean;
    searchText?: string;
};

type SectionFieldVisualSelectCommonProps<T extends string = string> = {
    options: SectionFieldVisualSelectOption<T>[];
    className?: string;
    menuClassName?: string;
    emptyBadgeStyle?: React.CSSProperties;
    visualMode?: SectionFieldVisualMode;
    disabled?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchEmptyText?: React.ReactNode;
    emptyLabel?: React.ReactNode;
    clearable?: boolean;
    clearLabel?: React.ReactNode;
    menuMaxHeight?: number | string;
    menuMinWidth?: number | string;
    selectedSectionLabel?: React.ReactNode;
    maxVisibleVisuals?: number;
    selectionUnitLabel?: string;
    getSelectedItemLabel?: (option: SectionFieldVisualSelectOption<T>, index: number) => React.ReactNode;
};

type SectionFieldVisualSelectSingleProps<T extends string = string> = SectionFieldVisualSelectCommonProps<T> & {
    multiple?: false;
    value?: T;
    defaultValue?: T;
    onChange?: (nextValue: T) => void;
    clearValue?: T;
};

type SectionFieldVisualSelectMultipleProps<T extends string = string> = SectionFieldVisualSelectCommonProps<T> & {
    multiple: true;
    values?: T[];
    defaultValues?: T[];
    onValuesChange?: (nextValues: T[]) => void;
};

export type SectionFieldVisualSelectProps<T extends string = string> =
    | SectionFieldVisualSelectSingleProps<T>
    | SectionFieldVisualSelectMultipleProps<T>;

type SectionFieldVisualSelectCssProperties = React.CSSProperties & {
    '--granter-section-field-visual-select-menu-min-width'?: string;
};

const getOptionSearchText = <T extends string>(option: SectionFieldVisualSelectOption<T>) => {
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
    options: SectionFieldVisualSelectOption<T>[],
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

type VisualTokenProps<T extends string = string> = {
    option: SectionFieldVisualSelectOption<T>;
    size: number;
    fontSize: number;
    mode?: SectionFieldVisualMode;
    className?: string;
};

const VisualToken = <T extends string>({
    option,
    size,
    fontSize,
    mode = 'avatar',
    className,
}: VisualTokenProps<T>) => {
    const [hasImageError, setHasImageError] = useState(false);
    const imageSrc = typeof option.imageSrc === 'string' ? option.imageSrc.trim() : '';
    const showImage = imageSrc.length > 0 && !hasImageError;
    const fallbackText = useMemo(
        () => getFallbackVisualText(option.label, option.visualText),
        [option.label, option.visualText]
    );
    const backgroundColor = useMemo(
        () => getBackgroundColor(option.value || option.label),
        [option.label, option.value]
    );

    useEffect(() => {
        setHasImageError(false);
    }, [imageSrc]);

    return (
        <span
            className={classNames(styles.VisualToken, { [styles.VisualTokenFallback]: !showImage }, className)}
            data-mode={mode}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                fontSize: `${fontSize}px`,
                backgroundColor,
            }}
        >
            {showImage ? (
                <img
                    src={imageSrc}
                    alt={option.imageAlt ?? `${option.label} icon`}
                    className={styles.VisualTokenImage}
                    data-mode={mode}
                    onError={() => setHasImageError(true)}
                />
            ) : (
                <span className={styles.VisualTokenText}>{fallbackText}</span>
            )}
        </span>
    );
};

type TriggerContentProps<T extends string = string> = {
    selectedOptions: SectionFieldVisualSelectOption<T>[];
    emptyLabel: React.ReactNode;
    emptyBadgeStyle?: React.CSSProperties;
    multiple?: boolean;
    maxVisibleVisuals?: number;
    visualMode?: SectionFieldVisualMode;
};

const TriggerContent = <T extends string>({
    selectedOptions,
    emptyLabel,
    emptyBadgeStyle,
    multiple = false,
    maxVisibleVisuals = 3,
    visualMode = 'avatar',
}: TriggerContentProps<T>) => {
    if (selectedOptions.length === 0) {
        return (
            <span className={styles.EmptyBadge} style={emptyBadgeStyle}>
                {emptyLabel}
            </span>
        );
    }

    const visibleOptions = multiple
        ? selectedOptions.slice(0, Math.max(1, maxVisibleVisuals))
        : selectedOptions.slice(0, 1);
    const hiddenCount = multiple ? Math.max(0, selectedOptions.length - visibleOptions.length) : 0;

    return (
        <span className={styles.SelectedStack}>
            <span className={styles.AddBadge} aria-hidden="true">
                <HiOutlinePlus size={18} />
            </span>
            <span className={styles.VisualCluster}>
                {visibleOptions.map((option) => (
                    <VisualToken
                        key={option.value}
                        option={option}
                        size={40}
                        fontSize={13}
                        mode={visualMode}
                        className={styles.SelectedVisual}
                    />
                ))}
                {hiddenCount > 0 ? <span className={styles.VisualOverflow}>+{hiddenCount}</span> : null}
            </span>
        </span>
    );
};

type SectionFieldVisualSelectItemProps<T extends string = string> = {
    option: SectionFieldVisualSelectOption<T>;
    active?: boolean;
    disabled?: boolean;
    multiple?: boolean;
    visualMode?: SectionFieldVisualMode;
    onSelect: (value: T) => void;
};

const SectionFieldVisualSelectItem = <T extends string>({
    option,
    active = false,
    disabled = false,
    multiple = false,
    visualMode = 'avatar',
    onSelect,
}: SectionFieldVisualSelectItemProps<T>) => {
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
            <VisualToken option={option} size={26} fontSize={11} mode={visualMode} />
            <span className={styles.OptionLabel}>{option.label}</span>
            {multiple ? (
                <span className={styles.OptionCheck} data-active={active ? 'true' : 'false'} aria-hidden="true">
                    {active ? <HiCheck size={14} /> : null}
                </span>
            ) : null}
        </button>
    );
};

type SectionFieldVisualSelectClearItemProps = {
    active?: boolean;
    disabled?: boolean;
    label: React.ReactNode;
    onClear: () => void;
};

const SectionFieldVisualSelectClearItem = ({
    active = false,
    disabled = false,
    label,
    onClear,
}: SectionFieldVisualSelectClearItemProps) => (
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

type SectionFieldVisualSelectMenuProps<T extends string = string> = {
    selectedOptions: SectionFieldVisualSelectOption<T>[];
    filteredOptions: SectionFieldVisualSelectOption<T>[];
    multiple?: boolean;
    visualMode?: SectionFieldVisualMode;
    clearable?: boolean;
    clearLabel: React.ReactNode;
    disabled?: boolean;
    searchEmptyText: React.ReactNode;
    isSelected: (value: T) => boolean;
    isClearActive: boolean;
    selectedSectionLabel: React.ReactNode;
    getSelectedItemLabel: (option: SectionFieldVisualSelectOption<T>, index: number) => React.ReactNode;
    onSelect: (value: T) => void;
    onClear: () => void;
    onRemoveSelected: (value: T) => void;
};

const SectionFieldVisualSelectMenu = <T extends string>({
    selectedOptions,
    filteredOptions,
    multiple = false,
    visualMode = 'avatar',
    clearable = false,
    clearLabel,
    disabled = false,
    searchEmptyText,
    isSelected,
    isClearActive,
    selectedSectionLabel,
    getSelectedItemLabel,
    onSelect,
    onClear,
    onRemoveSelected,
}: SectionFieldVisualSelectMenuProps<T>) => (
    <div className={styles.OptionsViewport}>
        {multiple && selectedOptions.length > 0 ? (
            <div className={styles.SelectedSection}>
                <div className={styles.SelectedSectionLabel}>{selectedSectionLabel}</div>
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
                            <VisualToken option={option} size={22} fontSize={10} mode={visualMode} />
                            <span className={styles.SelectedItemLabel}>{getSelectedItemLabel(option, index)}</span>
                            <span className={styles.SelectedItemRemove} aria-hidden="true">
                                <HiXMark size={14} />
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        ) : null}

        {clearable ? (
            <SectionFieldVisualSelectClearItem
                label={clearLabel}
                active={isClearActive}
                disabled={disabled}
                onClear={onClear}
            />
        ) : null}

        {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
                <SectionFieldVisualSelectItem
                    key={option.value}
                    option={option}
                    active={isSelected(option.value)}
                    disabled={disabled}
                    multiple={multiple}
                    visualMode={visualMode}
                    onSelect={onSelect}
                />
            ))
        ) : (
            <div className={styles.Empty}>{searchEmptyText}</div>
        )}
    </div>
);

type SectionFieldVisualSelectBaseProps<T extends string = string> = SectionFieldVisualSelectCommonProps<T> & {
    selectedValues: T[];
    multiple?: boolean;
    isClearActive: boolean;
    onSelect: (value: T) => void;
    onClear: () => void;
};

const SectionFieldVisualSelectBase = <T extends string>({
    options,
    className,
    menuClassName,
    emptyBadgeStyle,
    visualMode = 'avatar',
    disabled = false,
    searchable = true,
    searchPlaceholder = '항목 검색',
    searchEmptyText = '선택 가능한 항목이 없습니다.',
    emptyLabel = '항목 추가',
    clearable = false,
    clearLabel = '선택 안함',
    menuMaxHeight = 240,
    menuMinWidth = 240,
    selectedSectionLabel = '선택된 항목',
    selectedValues,
    multiple = false,
    maxVisibleVisuals = 3,
    selectionUnitLabel = '개',
    getSelectedItemLabel = (option) => option.label,
    isClearActive,
    onSelect,
    onClear,
}: SectionFieldVisualSelectBaseProps<T>) => {
    const { isOpen } = useDropdown();
    const [searchQuery, setSearchQuery] = useState('');
    const filteredOptions = useFilteredOptions(options, searchable, searchQuery);
    const optionMap = useMemo(() => new Map(options.map((option) => [option.value, option])), [options]);
    const selectedOptions = useMemo(
        () =>
            selectedValues
                .map((value) => optionMap.get(value))
                .filter(Boolean) as SectionFieldVisualSelectOption<T>[],
        [optionMap, selectedValues]
    );
    const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
    const cssVariables: SectionFieldVisualSelectCssProperties = {
        '--granter-section-field-visual-select-menu-min-width': toCssLength(menuMinWidth),
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
                                ? `${selectedOptions.length}${selectionUnitLabel} 선택됨`
                                : `${selectedOptions[0]?.label ?? ''} 선택됨`
                            : toAccessibleText(emptyLabel, '항목 추가')
                    }
                >
                    <TriggerContent
                        selectedOptions={selectedOptions}
                        emptyLabel={emptyLabel}
                        emptyBadgeStyle={emptyBadgeStyle}
                        multiple={multiple}
                        maxVisibleVisuals={maxVisibleVisuals}
                        visualMode={visualMode}
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

                    <SectionFieldVisualSelectMenu
                        selectedOptions={selectedOptions}
                        filteredOptions={filteredOptions}
                        multiple={multiple}
                        visualMode={visualMode}
                        clearable={clearable}
                        clearLabel={clearLabel}
                        disabled={disabled}
                        searchEmptyText={searchEmptyText}
                        isSelected={(value) => selectedSet.has(value)}
                        isClearActive={isClearActive}
                        selectedSectionLabel={selectedSectionLabel}
                        getSelectedItemLabel={getSelectedItemLabel}
                        onSelect={onSelect}
                        onClear={onClear}
                        onRemoveSelected={onSelect}
                    />
                </Dropdown.Content>
            ) : null}
        </div>
    );
};

const SectionFieldVisualSelectSingle = <T extends string>({
    options,
    value,
    defaultValue,
    onChange = noop,
    clearValue = '' as T,
    clearable = false,
    clearLabel = '선택 안함',
    ...rest
}: SectionFieldVisualSelectSingleProps<T>) => {
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
        <SectionFieldVisualSelectBase
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

const SectionFieldVisualSelectMultiple = <T extends string>({
    options,
    values,
    defaultValues,
    onValuesChange = noop,
    clearable = false,
    clearLabel = '전체 해제',
    ...rest
}: SectionFieldVisualSelectMultipleProps<T>) => {
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
        <SectionFieldVisualSelectBase
            {...rest}
            options={options}
            multiple
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
    props: SectionFieldVisualSelectProps<T>
): props is SectionFieldVisualSelectMultipleProps<T> => props.multiple === true;

const SectionFieldVisualSelect = (<T extends string = string>(props: SectionFieldVisualSelectProps<T>) => (
    <Dropdown>
        {isMultipleProps(props) ? (
            <SectionFieldVisualSelectMultiple {...props} />
        ) : (
            <SectionFieldVisualSelectSingle {...props} />
        )}
    </Dropdown>
)) as <T extends string = string>(props: SectionFieldVisualSelectProps<T>) => React.ReactElement;

export default SectionFieldVisualSelect;
