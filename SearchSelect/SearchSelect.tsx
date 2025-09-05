import React from 'react';
import styles from './SearchSelect.module.scss';
import SelectedItem from './components/SelectedItem/SelectedItem';
import SearchInput from './components/Input/Input';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from './components/Select/Select';

type SearchSelectProps = {
    children: React.ReactNode;
};

// TODO : input 에 data 필터
const SearchSelect = ({ children }: SearchSelectProps) => {
    const test = '';
    return (
        <div className={styles.SearchSelect}>
            <Dropdown>
                <div className={styles.label}>컬럼 선택</div>
                {children}
            </Dropdown>
        </div>
    );
};

export default SearchSelect;

SearchSelect.SelectedItem = SelectedItem;
SearchSelect.Input = SearchInput;
SearchSelect.Select = Select;
