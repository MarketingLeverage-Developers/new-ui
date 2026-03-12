import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import PlainButton from '../Button/PlainButton';
import styles from './SearchInput.module.scss';

export type SearchInputWidthPreset = 'auto' | 'coupang';

export type SearchInputProps = {
    value: string;
    onValueChange: (next: string) => void;
    placeholder: string;
    ariaLabel?: string;
    widthPreset?: SearchInputWidthPreset;
};

const SearchInput = ({
    value,
    onValueChange,
    placeholder,
    ariaLabel = placeholder,
    widthPreset = 'auto',
}: SearchInputProps) => (
    <div className={styles.SearchInput} data-width-preset={widthPreset}>
        <FiSearch size={16} />
        <input type="text" value={value} placeholder={placeholder} aria-label={ariaLabel} onChange={(event) => onValueChange(event.target.value)} />
        <PlainButton className={styles.ClearButton} aria-label="입력 지우기" onClick={() => onValueChange('')}>
            <IoCloseOutline size={16} />
        </PlainButton>
    </div>
);

export default SearchInput;
