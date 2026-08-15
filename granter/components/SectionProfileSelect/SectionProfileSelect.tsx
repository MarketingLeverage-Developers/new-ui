import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { HiCheck, HiOutlineChevronDown, HiOutlinePlus } from 'react-icons/hi2';
import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import styles from './SectionProfileSelect.module.scss';

const noop = () => undefined;

export type SectionProfileSelectSize = 'xs' | 'sm' | 'md' | 'lg';
export type SectionProfileSelectVariant = 'default' | 'document';

export type SectionProfileSelectOption<T extends string = string> = {
    value: T;
    title: string;
    description?: React.ReactNode;
    imageSrc?: string | null;
    imageAlt?: string;
    fallbackText?: string | null;
    disabled?: boolean;
    searchText?: string;
};

export type SectionProfileSelectProps<T extends string = string> = {
    options: SectionProfileSelectOption<T>[];
    value?: T;
    defaultValue?: T;
    onChange?: (nextValue: T) => void;
    emptyTitle?: React.ReactNode;
    placeholder?: React.ReactNode;
    className?: string;
    menuClassName?: string;
    menuMaxHeight?: number | string;
    matchTriggerWidth?: boolean;
    disabled?: boolean;
    size?: SectionProfileSelectSize;
    variant?: SectionProfileSelectVariant;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchEmptyText?: React.ReactNode;
    ariaLabelledBy?: string;
};

const normalizeText = (value: string) => value.trim().toLowerCase();
const getOptionSearchText = <T extends string>(option: SectionProfileSelectOption<T>) =>
    option.searchText?.trim() || `${option.title} ${String(option.description ?? '')}`;

type ProfileContentProps<T extends string = string> = {
    option: SectionProfileSelectOption<T>;
    compact?: boolean;
};

const ProfileContent = <T extends string>({ option, compact = false }: ProfileContentProps<T>) => (
    <>
        <MemberProfileAvatar
            className={styles.Avatar}
            name={option.title}
            src={option.imageSrc}
            fallbackText={option.fallbackText ?? option.title.slice(0, 1)}
            alt={option.imageAlt ?? `${option.title} 프로필`}
            size={compact ? 34 : 36}
            fontSize={compact ? 12 : 13}
        />
        <span className={styles.ProfileText}>
            <span className={styles.ProfileTitle}>{option.title}</span>
            {option.description ? <span className={styles.ProfileDescription}>{option.description}</span> : null}
        </span>
    </>
);

type ProfileOptionProps<T extends string = string> = {
    option: SectionProfileSelectOption<T>;
    disabled?: boolean;
};

const ProfileOption = <T extends string>({ option, disabled = false }: ProfileOptionProps<T>) => {
    const { isActive, changeSelectValue } = useSelect();
    const { close } = useDropdown();
    const active = isActive(option.value);
    const optionDisabled = Boolean(disabled || option.disabled);

    return (
        <button
            type="button"
            className={styles.Option}
            data-active={active ? 'true' : 'false'}
            disabled={optionDisabled}
            onClick={() => {
                if (optionDisabled) return;
                changeSelectValue(option.value);
                close();
            }}
        >
            <ProfileContent option={option} compact />
            <span className={styles.OptionCheck} aria-hidden="true">
                {active ? <HiCheck size={16} /> : null}
            </span>
        </button>
    );
};

type SectionProfileSelectViewProps<T extends string = string> = Omit<
    SectionProfileSelectProps<T>,
    'value' | 'defaultValue' | 'onChange'
> & {
    placeholder: React.ReactNode;
    menuMaxHeight: number | string;
    matchTriggerWidth: boolean;
    size: SectionProfileSelectSize;
    variant: SectionProfileSelectVariant;
    searchable: boolean;
    searchPlaceholder: string;
    searchEmptyText: React.ReactNode;
};

const SectionProfileSelectView = <T extends string>({
    options,
    emptyTitle,
    placeholder,
    className,
    menuClassName,
    menuMaxHeight,
    matchTriggerWidth,
    disabled = false,
    size,
    variant,
    searchable,
    searchPlaceholder,
    searchEmptyText,
    ariaLabelledBy,
}: SectionProfileSelectViewProps<T>) => {
    const { selectValue } = useSelect();
    const { isOpen } = useDropdown();
    const [searchQuery, setSearchQuery] = useState('');
    const selectedOption = options.find((option) => option.value === selectValue);
    const normalizedSearchQuery = normalizeText(searchQuery);
    const filteredOptions = useMemo(
        () =>
            !searchable || normalizedSearchQuery.length === 0
                ? options
                : options.filter((option) =>
                      normalizeText(getOptionSearchText(option)).includes(normalizedSearchQuery)
                  ),
        [normalizedSearchQuery, options, searchable]
    );

    useEffect(() => {
        if (!isOpen) setSearchQuery('');
    }, [isOpen]);

    return (
        <div className={classNames(styles.Root, className)} data-size={size} data-variant={variant}>
            <Dropdown.Trigger className={styles.TriggerWrap} disabled={disabled}>
                <button
                    type="button"
                    className={styles.Trigger}
                    data-empty={selectedOption ? 'false' : 'true'}
                    disabled={disabled}
                    aria-labelledby={ariaLabelledBy}
                >
                    <span className={styles.TriggerContent}>
                        {selectedOption ? (
                            <ProfileContent option={selectedOption} />
                        ) : (
                            <>
                                <span className={styles.EmptyAvatar} aria-hidden="true">
                                    <HiOutlinePlus size={18} />
                                </span>
                                <span className={styles.ProfileText}>
                                    <span className={styles.ProfileTitle}>{emptyTitle}</span>
                                    <span className={styles.ProfileDescription}>{placeholder}</span>
                                </span>
                            </>
                        )}
                    </span>
                    {selectedOption ? (
                        <span className={styles.Chevron} data-open={isOpen ? 'true' : 'false'} aria-hidden="true">
                            <HiOutlineChevronDown size={16} />
                        </span>
                    ) : null}
                </button>
            </Dropdown.Trigger>

            {options.length > 0 ? (
                <Dropdown.Content
                    className={classNames(styles.Menu, menuClassName)}
                    placement="bottom-start"
                    matchTriggerWidth={matchTriggerWidth}
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
                                aria-label={searchPlaceholder}
                                onChange={(event) => setSearchQuery(event.target.value)}
                            />
                        </div>
                    ) : null}
                    <div className={styles.OptionsViewport}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <ProfileOption key={option.value} option={option} disabled={disabled} />
                            ))
                        ) : (
                            <div className={styles.Empty}>{searchEmptyText}</div>
                        )}
                    </div>
                </Dropdown.Content>
            ) : null}
        </div>
    );
};

const SectionProfileSelect = (<T extends string = string>({
    options,
    value,
    defaultValue,
    onChange = noop,
    emptyTitle = '추가하기',
    placeholder = '선택해주세요.',
    className,
    menuClassName,
    menuMaxHeight = 280,
    matchTriggerWidth = true,
    disabled = false,
    size = 'md',
    variant = 'default',
    searchable = true,
    searchPlaceholder = '검색어를 입력해주세요.',
    searchEmptyText = '검색 결과가 없습니다.',
    ariaLabelledBy,
}: SectionProfileSelectProps<T>) => (
    <Select value={value} defaultValue={defaultValue} onChange={(nextValue) => onChange(nextValue as T)}>
        <Dropdown>
            <SectionProfileSelectView
                options={options}
                emptyTitle={emptyTitle}
                placeholder={placeholder}
                className={className}
                menuClassName={menuClassName}
                menuMaxHeight={menuMaxHeight}
                matchTriggerWidth={matchTriggerWidth}
                disabled={disabled}
                size={size}
                variant={variant}
                searchable={searchable}
                searchPlaceholder={searchPlaceholder}
                searchEmptyText={searchEmptyText}
                ariaLabelledBy={ariaLabelledBy}
            />
        </Dropdown>
    </Select>
)) as <T extends string = string>(props: SectionProfileSelectProps<T>) => React.ReactElement;

export default SectionProfileSelect;
