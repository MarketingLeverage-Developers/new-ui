import React from 'react';
import Dropdown from '../shared/headless/Dropdown/Dropdown';
import Select from '../shared/headless/Select/Select';
import { QuerySearch } from '../shared/headless/QuerySearch/QuerySearch';
import { Content, Display, Item } from './components';
import type { SearchableBorderRoundedSelectItem } from './components/types';

export type { SearchableBorderRoundedSelectItem } from './components/types';

type SearchableBorderRoundedSelectProps<T extends SearchableBorderRoundedSelectItem> = Omit<
    React.ComponentProps<typeof Select>,
    'children'
> & {
    children: React.ReactNode;
    label: string;
    data: T[];
    defaultQuery?: string;
};

const SearchableBorderRoundedSelect = <T extends SearchableBorderRoundedSelectItem>({
    children,
    label,
    data,
    defaultQuery = '',
    ...props
}: SearchableBorderRoundedSelectProps<T>) => (
    <Dropdown>
        <Select {...props}>
            <QuerySearch<T> label={label} data={data} defaultQuery={defaultQuery}>
                {children}
            </QuerySearch>
        </Select>
    </Dropdown>
);

SearchableBorderRoundedSelect.Display = Display;
SearchableBorderRoundedSelect.Content = Content;
SearchableBorderRoundedSelect.Item = Item;

export default SearchableBorderRoundedSelect;
