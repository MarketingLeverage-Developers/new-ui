import React from 'react';
import styles from './SearchSelect.module.scss';
import SearchInput from './components/Input/Input';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import SelectComponent from './components/Select/Select';
import Select from '@/shared/headless/Select/Select';
import { QuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';

export type SelectItem = {
    label: string;
    uid: string;
};

type SearchSelectProps = {
    children: React.ReactNode;
    label: string;
    data: SelectItem[];
};

export const SearchSelect = ({ children, label, data }: SearchSelectProps) => (
    // const [query, setQuery] = useState('');
    // const value = React.useMemo(() => ({ query, setQuery, label, data }), [query, label, data]);

    <div className={styles.SearchSelect}>
        <Select>
            <Dropdown>
                <QuerySearch<SelectItem> label={label} data={data}>
                    {children}
                </QuerySearch>
            </Dropdown>
        </Select>
    </div>
);

SearchSelect.Input = SearchInput;
SearchSelect.Select = SelectComponent;
