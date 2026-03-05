import React from 'react';
import { FiSearch } from 'react-icons/fi';
import styles from '../../GranterSearchSidebar.module.scss';

export type GranterSearchSidebarSearchInputProps = {
    value: string;
    placeholder?: string;
    onChange?: (value: string) => void;
};

const SearchInput = ({ value, placeholder = '검색', onChange }: GranterSearchSidebarSearchInputProps) => (
    <div className={styles.SearchField}>
        <FiSearch size={14} />
        <input value={value} placeholder={placeholder} onChange={(e) => onChange?.(e.target.value)} />
    </div>
);

export default SearchInput;
