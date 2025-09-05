import React, { useRef } from 'react';
import styles from './SearchInput.module.scss';
import { MdCancel } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const SearchInput = ({ value, onChange, ...props }: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const clearHandler = () => {
        if (onChange) {
            onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
        } else if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className={styles.SearchInputWrapper}>
            <input ref={inputRef} value={value} onChange={onChange} {...props} />
            <div className={styles.SearchIcons}>
                <CiSearch />
            </div>
            {String(value ?? inputRef.current?.value ?? '').length > 0 && (
                <div className={styles.CancelIcons}>
                    <MdCancel style={{ cursor: 'pointer' }} onClick={clearHandler} />
                </div>
            )}
        </div>
    );
};

export default SearchInput;
