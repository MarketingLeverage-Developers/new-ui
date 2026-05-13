import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { HiCheck, HiOutlinePlus, HiXMark } from 'react-icons/hi2';
import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import styles from './SectionFieldVisualMemberSelect.module.scss';

const noop = () => undefined;

export type SectionFieldVisualMemberSelectOption<T extends string = string> = {
    value: T;
    label: string;
    profileImageUrl?: string | null;
    disabled?: boolean;
    searchText?: string;
};

export type SectionFieldVisualMemberSelectProps<T extends string = string> = {
    options: SectionFieldVisualMemberSelectOption<T>[];
    values?: T[];
    defaultValues?: T[];
    onValuesChange?: (nextValues: T[]) => void;
    className?: string;
    menuClassName?: string;
    disabled?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchEmptyText?: React.ReactNode;
    emptyLabel?: React.ReactNode;
    listLabel?: React.ReactNode;
    menuMaxHeight?: number | string;
    menuMinWidth?: number | string;
    triggerSize?: number;
    avatarSize?: number;
    avatarFontSize?: number;
    maxVisibleAvatars?: number;
};

type CssProperties = React.CSSProperties & {
    '--granter-section-field-visual-member-select-menu-min-width'?: string;
    '--granter-section-field-visual-member-select-trigger-size'?: string;
    '--granter-section-field-visual-member-select-avatar-size'?: string;
    '--granter-section-field-visual-member-select-avatar-font-size'?: string;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

const uniqValues = <T extends string>(values: readonly T[]) => Array.from(new Set(values));

const getOptionSearchText = <T extends string>(option: SectionFieldVisualMemberSelectOption<T>) => {
    if (typeof option.searchText === 'string' && option.searchText.trim().length > 0) {
        return option.searchText;
    }

    return option.label;
};

const useFilteredOptions = <T extends string>(
    options: SectionFieldVisualMemberSelectOption<T>[],
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
    selectedOptions: SectionFieldVisualMemberSelectOption<T>[];
    maxVisibleAvatars: number;
    avatarSize: number;
    avatarFontSize: number;
};

const TriggerContent = <T extends string>({
    selectedOptions,
    maxVisibleAvatars,
    avatarSize,
    avatarFontSize,
}: TriggerContentProps<T>) => {
    const visibleOptions = selectedOptions.slice(0, Math.max(1, maxVisibleAvatars));
    const hiddenCount = Math.max(0, selectedOptions.length - visibleOptions.length);

    return (
        <span className={styles.SelectedStack}>
            <span className={styles.AddBadge} aria-hidden="true">
                <HiOutlinePlus size={Math.max(14, Math.round(avatarSize * 0.45))} />
            </span>
            {visibleOptions.length > 0 ? (
                <span className={styles.AvatarCluster}>
                    {visibleOptions.map((option) => (
                        <MemberProfileAvatar
                            key={option.value}
                            className={styles.Avatar}
                            name={option.label}
                            src={option.profileImageUrl}
                            size={avatarSize}
                            fontSize={avatarFontSize}
                        />
                    ))}
                    {hiddenCount > 0 ? <span className={styles.VisualOverflow}>+{hiddenCount}</span> : null}
                </span>
            ) : null}
        </span>
    );
};

type OptionItemProps<T extends string = string> = {
    option: SectionFieldVisualMemberSelectOption<T>;
    active: boolean;
    disabled?: boolean;
    onSelect: (value: T) => void;
};

const OptionItem = <T extends string>({ option, active, disabled = false, onSelect }: OptionItemProps<T>) => {
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
            <MemberProfileAvatar name={option.label} src={option.profileImageUrl} size={26} fontSize={11} />
            <span className={styles.OptionLabel}>{option.label}</span>
            <span className={styles.OptionCheck} data-active={active ? 'true' : 'false'} aria-hidden="true">
                {active ? <HiCheck size={14} /> : null}
            </span>
        </button>
    );
};

const SectionFieldVisualMemberSelectBase = <T extends string = string>({
    options,
    values,
    defaultValues,
    onValuesChange = noop,
    className,
    menuClassName,
    disabled = false,
    searchable = true,
    searchPlaceholder = '이름으로 검색',
    searchEmptyText = '선택 가능한 담당자가 없습니다.',
    emptyLabel = '담당자 추가',
    listLabel = '담당자 리스트',
    menuMaxHeight = 240,
    menuMinWidth = 240,
    triggerSize = 40,
    avatarSize = triggerSize,
    avatarFontSize = 13,
    maxVisibleAvatars = 3,
}: SectionFieldVisualMemberSelectProps<T>) => {
    const { isOpen } = useDropdown();
    const [searchQuery, setSearchQuery] = useState('');
    const [internalValues, setInternalValues] = useState<T[]>(() => uniqValues(defaultValues ?? []));
    const isControlled = values !== undefined;
    const selectedValues = useMemo(
        () => uniqValues((isControlled ? values : internalValues) ?? []),
        [internalValues, isControlled, values]
    );
    const optionMap = useMemo(() => new Map(options.map((option) => [option.value, option])), [options]);
    const selectedOptions = useMemo(
        () =>
            selectedValues
                .map((value) => optionMap.get(value))
                .filter(Boolean) as SectionFieldVisualMemberSelectOption<T>[],
        [optionMap, selectedValues]
    );
    const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);
    const filteredOptions = useFilteredOptions(options, searchable, searchQuery);
    const selectedLabelText = selectedOptions.map((option) => option.label).join(', ');
    const cssVariables: CssProperties = {
        '--granter-section-field-visual-member-select-menu-min-width': toCssLength(menuMinWidth),
        '--granter-section-field-visual-member-select-trigger-size': toCssLength(triggerSize),
        '--granter-section-field-visual-member-select-avatar-size': toCssLength(avatarSize),
        '--granter-section-field-visual-member-select-avatar-font-size': toCssLength(avatarFontSize),
    };

    useEffect(() => {
        if (isOpen) return;
        setSearchQuery('');
    }, [isOpen]);

    const handleChange = (nextValues: T[]) => {
        const normalizedNextValues = uniqValues(nextValues);

        if (!isControlled) {
            setInternalValues(normalizedNextValues);
        }

        onValuesChange(normalizedNextValues);
    };

    const handleSelect = (nextValue: T) => {
        handleChange(
            selectedValues.includes(nextValue)
                ? selectedValues.filter((value) => value !== nextValue)
                : [...selectedValues, nextValue]
        );
    };

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
                            ? `${selectedOptions.length}명 선택됨`
                            : String(emptyLabel || '담당자 추가')
                    }
                >
                    <TriggerContent
                        selectedOptions={selectedOptions}
                        maxVisibleAvatars={maxVisibleAvatars}
                        avatarSize={avatarSize}
                        avatarFontSize={avatarFontSize}
                    />
                </button>
            </Dropdown.Trigger>

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

                {selectedOptions.length > 0 ? (
                    <div className={styles.SelectedSection}>
                        <div className={styles.SelectedSectionLabel}>선택된 담당자</div>
                        <div className={styles.SelectedList}>
                            {selectedOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    className={styles.SelectedItem}
                                    disabled={disabled}
                                    title={option.label}
                                    onClick={() => {
                                        if (disabled) return;
                                        handleSelect(option.value);
                                    }}
                                >
                                    <MemberProfileAvatar
                                        name={option.label}
                                        src={option.profileImageUrl}
                                        size={22}
                                        fontSize={10}
                                    />
                                    <span className={styles.SelectedItemLabel}>{option.label}</span>
                                    <span className={styles.SelectedItemRemove} aria-hidden="true">
                                        <HiXMark size={14} />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}

                <div className={styles.ListLabel}>{listLabel}</div>
                <div className={styles.OptionsViewport}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <OptionItem
                                key={option.value}
                                option={option}
                                active={selectedSet.has(option.value)}
                                disabled={disabled}
                                onSelect={handleSelect}
                            />
                        ))
                    ) : (
                        <div className={styles.Empty}>{searchEmptyText}</div>
                    )}
                </div>
            </Dropdown.Content>
        </div>
    );
};

const SectionFieldVisualMemberSelect = <T extends string = string>(
    props: SectionFieldVisualMemberSelectProps<T>
) => (
    <Dropdown>
        <SectionFieldVisualMemberSelectBase {...props} />
    </Dropdown>
);

export default SectionFieldVisualMemberSelect;
