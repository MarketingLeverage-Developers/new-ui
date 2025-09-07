import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import SearchInput from '@/shared/primitives/SearchInput/SearchInput';
import React from 'react';
import { useSearchSelect } from '../../SearchSelect';

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ ...props }: SearchInputProps) => {
    const { query, setQuery } = useSearchSelect();
    return (
        <Dropdown.Trigger>
            <SearchInput {...props} value={query} onChange={(e) => setQuery(e.target.value)} />
        </Dropdown.Trigger>
    );
};

export default Input;
