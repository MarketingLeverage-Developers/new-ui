import React, { useMemo } from 'react';
import styles from './Input.module.scss';
import { useSelect } from '@/shared/headless/Select/Select';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import RoundedInput from '@/shared/primitives/RoundedInput/RoundedInput';
// import { useSearchSelect } from '../../SearchSelect';

type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'placeholder'>;

const Input = ({ ...rest }: SearchInputProps) => {
    // const { data } = useSearchSelect();
    const { data } = useQuerySearch();
    const { selectValue } = useSelect();

    const labelMap = useMemo(() => {
        const map = new Map<string, string>();
        data.forEach((i: any) => map.set(i.uid, i.label));
        return map;
    }, [data]);

    const value = labelMap.get(selectValue) ?? '';
    const hasValue = !!value;

    return (
        <Dropdown.Trigger>
            <div className={styles.InputWrapper}>
                <RoundedInput {...rest} value={value} readOnly className={hasValue ? styles.Selected : undefined} />
                <BaseButton radius={8} padding={{ x: 17, y: 14 }} textColor="var(--Primary1)" bgColor="var(--Primary2)">
                    업체 검색
                </BaseButton>
            </div>
        </Dropdown.Trigger>
    );
};

export default Input;
