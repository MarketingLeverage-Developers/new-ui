import { QuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import Select from '@/shared/headless/Select/Select';
import React from 'react';
import type { SelectItem } from '../SearchSelect/SearchSelect';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Content from './components/Content/Content';
import Input from './components/Input/Input';

type SearchSelectInputProps = {
    children: React.ReactNode;
    label: string;
    data: SelectItem[];
    placeholder: string;
};

const SearchSelectInput = ({ children, label, data }: SearchSelectInputProps) => {
    const test = '';
    return (
        <Select>
            <Dropdown>
                <QuerySearch<SelectItem> label={label} data={data}>
                    {children}
                </QuerySearch>
            </Dropdown>
        </Select>
    );
};

export default SearchSelectInput;

SearchSelectInput.Content = Content;
SearchSelectInput.Input = Input;
