import { QuerySearch, useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import Select from '@/shared/headless/Select/Select';
import React from 'react';
import type { SelectItem } from '../SearchSelect/SearchSelect';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Content from './components/Content/Content';
import Input from './components/Input/Input';

type SearchSelectInputChangeEvent = {
    target: {
        value: string;
    };
};

type SearchSelectInputProps<T extends SelectItem> = {
    children: React.ReactNode;
    label: string;
    data: T[];
    placeholder?: string;
    value?: string;
    onChange?: (event: SearchSelectInputChangeEvent) => void;
};

const SearchSelectInput = <T extends SelectItem>({ children, label, data, value, onChange }: SearchSelectInputProps<T>) => {
    const handleChange = React.useCallback(
        (nextValue: string) => {
            onChange?.({
                target: {
                    value: nextValue,
                },
            });
        },
        [onChange]
    );

    return (
        <Select value={value} onChange={onChange ? handleChange : undefined}>
            <Dropdown>
                <QuerySearch<T> label={label} data={data}>
                    <SyncControlledQuery value={value} />
                    {children}
                </QuerySearch>
            </Dropdown>
        </Select>
    );
};

export default SearchSelectInput;

SearchSelectInput.Content = Content;
SearchSelectInput.Input = Input;

const SyncControlledQuery = ({ value }: { value?: string }) => {
    const { data, query, setQuery } = useQuerySearch<SelectItem>();
    const prevValueRef = React.useRef<string | undefined>(undefined);

    React.useEffect(() => {
        if (value === undefined) return;
        if (prevValueRef.current === value) return;
        prevValueRef.current = value;

        if (!value) {
            if (query !== '') setQuery('', { isSync: true });
            return;
        }

        const found = data.find((item) => String(item.uuid) === String(value));
        const nextQuery = found ? String(found.label ?? '') : '';
        if (query !== nextQuery) setQuery(nextQuery, { isSync: true });
    }, [data, query, setQuery, value]);

    return null;
};
