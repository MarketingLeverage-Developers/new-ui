import React from 'react';
import styles from './SearchManySelect.module.scss';
import SearchInput from './components/Input/Input';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from './components/Select/Select';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import Selected from './components/Selected/Selected';
import { QuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';

export type SelectItem = {
    label: string;
    uuid: string;
};

type SearchManySelectProps = {
    children: React.ReactNode;
    label: string;
    data: SelectItem[];
};

export const SearchManySelect = ({ children, label, data }: SearchManySelectProps) => (
    // const [query, setQuery] = useState('');
    // const value = React.useMemo(() => ({ query, setQuery, label, data }), [query, label, data]);

    <div className={styles.SearchManySelect}>
        {/* <span className={styles.Title}>{label} 설정</span> */}
        <ManySelect>
            <Dropdown>
                <QuerySearch<SelectItem> label={label} data={data}>
                    {children}
                </QuerySearch>
            </Dropdown>
        </ManySelect>
    </div>
);

SearchManySelect.Selected = Selected;
SearchManySelect.Input = SearchInput;
SearchManySelect.Select = Select;
