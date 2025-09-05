import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import SearchInput from '@/shared/primitives/SearchInput/SearchInput';
import React from 'react';

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = ({ value, onChange, ...props }: SearchInputProps) => (
    <Dropdown.Trigger>
        <SearchInput {...props} value={value} onChange={onChange} />
    </Dropdown.Trigger>
);

export default Input;
