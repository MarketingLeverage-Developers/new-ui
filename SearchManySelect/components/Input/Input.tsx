import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import SearchInput from '@/shared/primitives/SearchInput/SearchInput';
import React from 'react';
import styles from './Input.module.scss';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';

type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'placeholder'>;

const Input = ({ ...rest }: SearchInputProps) => {
    const { query, setQuery, label } = useQuerySearch();
    return (
        <Dropdown.Trigger>
            <div className={styles.InputWrapper}>
                {label && <span className={styles.Label}>{label}</span>}
                <SearchInput
                    {...rest}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`검색어를 입력하세요`}
                />
            </div>
        </Dropdown.Trigger>
    );
};

export default Input;
