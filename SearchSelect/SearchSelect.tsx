import React, { createContext, useContext, useState } from 'react';
import styles from './SearchSelect.module.scss';
import SearchInput from './components/Input/Input';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import SelectComponent from './components/Select/Select';
import Select from '@/shared/headless/Select/Select';

export type SelectItem = {
    label: string;
    uid: string;
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
    const value = React.useMemo(() => ({ query, setQuery, label, data }), [query, label, data]);

    return (
        <div className={styles.SearchSelect}>
            <Select>
                <Dropdown>
                    <SearchSelectContext.Provider value={value}>{children}</SearchSelectContext.Provider>
                </Dropdown>
            </Select>
        </div>
    );
};

SearchSelect.Input = SearchInput;
SearchSelect.Select = SelectComponent;

export const useSearchSelect = () => useContext(SearchSelectContext);
