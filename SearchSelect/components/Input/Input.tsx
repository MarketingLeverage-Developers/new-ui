import React from 'react';
import styles from './Input.module.scss';
import RoundedInput from '@/shared/primitives/RoundedInput/RoundedInput';
import { useSelect } from '@/shared/headless/Select/Select';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';

type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'placeholder'>;

const Input = ({ ...rest }: SearchInputProps) => {
    // const { query, setQuery } = useSearchSelect();
    const { selectValue } = useSelect();
    return (
        <Dropdown.Trigger>
            <div className={styles.InputWrapper}>
                <RoundedInput {...rest} value={selectValue} style={{ width: '100%' }} />
            </div>
            <BaseButton radius={8} padding={{ x: 17, y: 14 }} textColor="var(--Primary1)" bgColor="var(--Primary2)">
                업체 검색
            </BaseButton>
        </Dropdown.Trigger>
    );
};

export default Input;
