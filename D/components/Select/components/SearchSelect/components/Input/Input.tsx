import React, { useMemo } from 'react';
import styles from './Input.module.scss';
import { useSelect } from '@/shared/headless/Select/Select';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import BaseButton from '@/shared/primitives/D/components/Button/components/BaseButton/BaseButton';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import RoundedInput from '@/shared/primitives/RoundedInput/RoundedInput';

/** 기존 SearchSelect Input을 D 패턴에 맞춰 이동 */
type SearchSelectInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'placeholder'>;

const SearchSelectInput: React.FC<SearchSelectInputProps> = ({ ...rest }) => {
    const { data } = useQuerySearch<any>();
    const { selectValue } = useSelect();

    const labelMap = useMemo(() => {
        const map = new Map<string, string>();
        data.forEach((i: any) => map.set(i.uuid, i.label));
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

export type { SearchSelectInputProps };
export default SearchSelectInput;
