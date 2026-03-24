import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import styles from './SectionFieldSelect.module.scss';

const noop = () => undefined;

export type SectionFieldSelectOption<T extends string = string> = {
    value: T;
    label: React.ReactNode;
    disabled?: boolean;
    searchText?: string;
};

export type SectionFieldSelectProps<T extends string = string> = {
    options: SectionFieldSelectOption<T>[];
    value?: T;
    defaultValue?: T;
    onChange?: (nextValue: T) => void;
    placeholder?: React.ReactNode;
    className?: string;
    menuClassName?: string;
    menuMaxHeight?: number | string;
    disabled?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchEmptyText?: React.ReactNode;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const getOptionSearchText = <T extends string>(option: SectionFieldSelectOption<T>) => {
    if (typeof option.searchText === 'string' && option.searchText.trim().length > 0) {
        return option.searchText;
    }

    if (typeof option.label === 'string' || typeof option.label === 'number') {
        return String(option.label);
    }

    return String(option.value);
};

type SectionFieldSelectItemProps<T extends string = string> = {
    option: SectionFieldSelectOption<T>;
    disabled?: boolean;
};

const SectionFieldSelectItem = <T extends string>({
    option,
    disabled = false,
}: SectionFieldSelectItemProps<T>) => {
    const { isActive, changeSelectValue } = useSelect();
    const { close } = useDropdown();
    const isDisabled = Boolean(disabled || option.disabled);

    return (
        <button
            type="button"
            className={styles.Option}
            data-active={isActive(option.value) ? 'true' : 'false'}
            disabled={isDisabled}
            onClick={() => {
                if (isDisabled) return;
                changeSelectValue(option.value);
                close();
            }}
        >
            {option.label}
        </button>
    );
};

type SectionFieldSelectViewProps<T extends string = string> = {
    options: SectionFieldSelectOption<T>[];
    placeholder: React.ReactNode;
    className?: string;
    menuClassName?: string;
    menuMaxHeight: number | string;
    disabled?: boolean;
    searchable?: boolean;
    searchPlaceholder: string;
    searchEmptyText: React.ReactNode;
};

const SectionFieldSelectView = <T extends string>({
    options,
    placeholder,
    className,
    menuClassName,
    menuMaxHeight,
    disabled = false,
    searchable = false,
    searchPlaceholder,
    searchEmptyText,
}: SectionFieldSelectViewProps<T>) => {
    const { selectValue } = useSelect();
    const { isOpen } = useDropdown();
    const [searchQuery, setSearchQuery] = useState('');
    const selectedOption = options.find((option) => option.value === selectValue);
    const normalizedSearchQuery = normalizeText(searchQuery);
    const filteredOptions = useMemo(
        () =>
            !searchable || normalizedSearchQuery.length === 0
                ? options
                : options.filter((option) => normalizeText(getOptionSearchText(option)).includes(normalizedSearchQuery)),
        [normalizedSearchQuery, options, searchable]
    );

    useEffect(() => {
        if (isOpen) return;
        setSearchQuery('');
    }, [isOpen]);

    return (
        <div className={classNames(styles.Root, className)}>
            <Dropdown.Trigger className={styles.TriggerWrap} disabled={disabled}>
                <button type="button" className={styles.Trigger} disabled={disabled}>
                    <span className={styles.Label} data-placeholder={selectedOption ? 'false' : 'true'}>
                        {selectedOption?.label ?? placeholder}
                    </span>

                    <span className={styles.Icon} data-open={isOpen ? 'true' : 'false'}>
                        <HiOutlineChevronDown size={16} />
                    </span>
                </button>
            </Dropdown.Trigger>

            {options.length > 0 ? (
                <Dropdown.Content
                    className={classNames(styles.Menu, menuClassName)}
                    placement="bottom-start"
                    matchTriggerWidth
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

                    <div className={styles.OptionsViewport}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <SectionFieldSelectItem
                                    key={option.value}
                                    option={option}
                                    disabled={disabled}
                                />
                            ))
                        ) : (
                            <div className={styles.Empty}>
                                {searchEmptyText}
                            </div>
                        )}
                    </div>
                </Dropdown.Content>
            ) : null}
        </div>
    );
};

const SectionFieldSelect = (<T extends string = string>({
    options,
    value,
    defaultValue,
    onChange = noop,
    placeholder = '선택해주세요.',
    className,
    menuClassName,
    menuMaxHeight = 240,
    disabled = false,
    searchable = false,
    searchPlaceholder = '검색어를 입력해주세요.',
    searchEmptyText = '검색 결과가 없습니다.',
}: SectionFieldSelectProps<T>) => (
    <Select
        value={value}
        defaultValue={defaultValue}
        onChange={(nextValue) => onChange(nextValue as T)}
    >
        <Dropdown>
            <SectionFieldSelectView
                options={options}
                placeholder={placeholder}
                className={className}
                menuClassName={menuClassName}
                menuMaxHeight={menuMaxHeight}
                disabled={disabled}
                searchable={searchable}
                searchPlaceholder={searchPlaceholder}
                searchEmptyText={searchEmptyText}
            />
        </Dropdown>
    </Select>
)) as <T extends string = string>(props: SectionFieldSelectProps<T>) => React.ReactElement;

export default SectionFieldSelect;
