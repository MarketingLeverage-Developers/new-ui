import React, { createContext, useContext, useState } from 'react';
import styles from './SearchSelect.module.scss';
import SearchInput from './components/Input/Input';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from './components/Select/Select';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import Selected from './components/Selected/Selected';

type SearchSelectContextType = {
    query: string;
    setQuery: (q: string) => void;
};

const SearchSelectContext = createContext<SearchSelectContextType>({
    query: '',
    setQuery: () => {},
});

type SearchSelectProps = {
    children: React.ReactNode;
};

const SearchSelect = ({ children }: SearchSelectProps) => {
    const [query, setQuery] = useState('');

    return (
        <div className={styles.SearchSelect}>
            <ManySelect>
                <Dropdown>
                    <div className={styles.label}>컬럼 선택</div>
                    <SearchSelectContext.Provider value={{ query, setQuery }}>{children}</SearchSelectContext.Provider>
                </Dropdown>
            </ManySelect>
        </div>
    );
};

export default SearchSelect;

SearchSelect.Selected = Selected;
SearchSelect.Input = SearchInput;
SearchSelect.Select = Select;

export const useSearchSelect = () => useContext(SearchSelectContext);
