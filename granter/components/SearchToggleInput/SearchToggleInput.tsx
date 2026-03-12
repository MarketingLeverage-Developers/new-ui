import React from 'react';
import classNames from 'classnames';
import { FiSearch } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import IconButton from '../Button/IconButton';
import PlainButton from '../Button/PlainButton';
import styles from './SearchToggleInput.module.scss';

export type SearchToggleInputProps = {
    placeholder?: string;
    ariaLabel?: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    className?: string;
};

type SearchInputContentProps = {
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onSearch?: (value: string) => void;
};

const SearchInputContent = ({ placeholder, value, onChange, onSearch }: SearchInputContentProps) => {
    const { close } = useDropdown();

    const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key !== 'Enter') return;
        onSearch?.(value);
        close();
    };

    return (
        <Dropdown.Content className={styles.Content} placement="bottom-end">
            <div className={styles.SearchField}>
                <FiSearch size={16} />
                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {value ? (
                    <PlainButton className={styles.ClearButton} aria-label="입력 지우기" onClick={() => onChange('')}>
                        <IoCloseOutline size={16} />
                    </PlainButton>
                ) : null}
            </div>
        </Dropdown.Content>
    );
};

const SearchToggleInput = ({
    placeholder = '검색어 입력',
    ariaLabel = '검색',
    value,
    defaultValue = '',
    onValueChange,
    onSearch,
    className,
}: SearchToggleInputProps) => {
    const isControlled = typeof value === 'string';
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const inputValue = isControlled ? (value as string) : internalValue;

    const handleChange = (nextValue: string) => {
        if (!isControlled) {
            setInternalValue(nextValue);
        }
        onValueChange?.(nextValue);
    };

    return (
        <Dropdown>
            <div className={classNames(styles.Root, className)}>
                <Dropdown.Trigger className={styles.Trigger}>
                    <IconButton size="icon" aria-label={ariaLabel} leftIcon={<FiSearch size={16} />} />
                </Dropdown.Trigger>

                <SearchInputContent placeholder={placeholder} value={inputValue} onChange={handleChange} onSearch={onSearch} />
            </div>
        </Dropdown>
    );
};

export default SearchToggleInput;
