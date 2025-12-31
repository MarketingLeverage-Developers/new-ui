import React from 'react';
import styles from './SearchManySelect.module.scss';
import SearchInput from './components/Input/Input';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from './components/Select/Select';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import Selected from './components/Selected/Selected';
import { QuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';

export type SelectItem = { label: string; uuid: string };

type SearchManySelectProps<T> = {
    children: React.ReactNode;
    label: string;
    data: T[];
};

type SearchManySelectComponent = (<T = SelectItem>(props: SearchManySelectProps<T>) => React.ReactElement) & {
    Selected: typeof Selected;
    Input: typeof SearchInput;
    Select: typeof Select;
};

export const SearchManySelect = (({ children, label, data }) => (
    <div className={styles.SearchManySelect}>
        <ManySelect>
            <Dropdown>
                <QuerySearch label={label} data={data}>
                    {children}
                </QuerySearch>
            </Dropdown>
        </ManySelect>
    </div>
)) as SearchManySelectComponent;

SearchManySelect.Selected = Selected;
SearchManySelect.Input = SearchInput;
SearchManySelect.Select = Select;
