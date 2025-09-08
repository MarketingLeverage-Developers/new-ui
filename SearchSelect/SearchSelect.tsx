import React, { createContext, useContext, useState } from 'react';
import styles from './SearchSelect.module.scss';
import SearchInput from './components/Input/Input';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from './components/Select/Select';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import Selected from './components/Selected/Selected';

export type SelectItem = {
    label: string;
    value: string;
};

type SearchSelectContextType = {
    query: string;
    setQuery: (q: string) => void;
    label: string;
    data: SelectItem[];
};

const SearchSelectContext = createContext<SearchSelectContextType>({
    query: '',
    setQuery: () => {},
    label: '',
    data: [],
});

type SearchSelectProps = {
    children: React.ReactNode;
    label: string;
    data: SelectItem[];
};

export const SearchSelect = ({ children, label, data }: SearchSelectProps) => {
    const [query, setQuery] = useState('');
    const [labelState] = useState(label);
    const [dataState] = useState(data);

    return (
        <div className={styles.SearchSelect}>
            {/* <span className={styles.Title}>{label} 설정</span> */}
            <ManySelect>
                <Dropdown>
                    <SearchSelectContext.Provider value={{ query, setQuery, label: labelState, data: dataState }}>
                        {children}
                    </SearchSelectContext.Provider>
                </Dropdown>
            </ManySelect>
        </div>
    );
};

SearchSelect.Selected = Selected;
SearchSelect.Input = SearchInput;
SearchSelect.Select = Select;

export const useSearchSelect = () => useContext(SearchSelectContext);
