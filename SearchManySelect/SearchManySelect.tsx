import React, { createContext, useContext, useState } from 'react';
import styles from './SearchManySelect.module.scss';
import SearchInput from './components/Input/Input';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from './components/Select/Select';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import Selected from './components/Selected/Selected';

export type SelectItem = {
    label: string;
    uid: string;
};

type SearchManySelectContextType = {
    query: string;
    setQuery: (q: string) => void;
    label: string;
    data: SelectItem[];
};

const SearchManySelectContext = createContext<SearchManySelectContextType>({
    query: '',
    setQuery: () => {},
    label: '',
    data: [],
});

type SearchManySelectProps = {
    children: React.ReactNode;
    label: string;
    data: SelectItem[];
};

export const SearchManySelect = ({ children, label, data }: SearchManySelectProps) => {
    const [query, setQuery] = useState('');
    const value = React.useMemo(() => ({ query, setQuery, label, data }), [query, label, data]);

    return (
        <div className={styles.SearchManySelect}>
            {/* <span className={styles.Title}>{label} 설정</span> */}
            <ManySelect>
                <Dropdown>
                    <SearchManySelectContext.Provider value={value}>{children}</SearchManySelectContext.Provider>
                </Dropdown>
            </ManySelect>
        </div>
    );
};

SearchManySelect.Selected = Selected;
SearchManySelect.Input = SearchInput;
SearchManySelect.Select = Select;

export const useSearchManySelect = () => useContext(SearchManySelectContext);
