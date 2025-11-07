import React from 'react';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Flex from '@/shared/primitives/Flex/Flex';
import FormSearchInput from '@/shared/primitives/FormSearchInput/FormSearchInput';
type InputProps = {
    placeholder: string;
};

const Input = ({ placeholder }: InputProps) => {
    const { query, setQuery } = useQuerySearch();

    return (
        <Dropdown.Trigger>
            <Flex height={46} width={'100%'}>
                <FormSearchInput placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
            </Flex>
        </Dropdown.Trigger>
    );
};

export default Input;
