import React, { useMemo } from 'react';
import styles from './Input.module.scss';
import { useSelect } from '../../../shared/headless/Select/Select';
import Dropdown from '../../../shared/headless/Dropdown/Dropdown';
import BaseButton from '../../../BaseButton/BaseButton';
import { useQuerySearch } from '../../../shared/headless/QuerySearch/QuerySearch';
import RoundedInput from '../../../RoundedInput/RoundedInput';
import type { CSSLength } from '../../../shared/types';
import type { SelectItem } from '../../SearchSelect';
// import { useSearchSelect } from '../../SearchSelect';

type SearchInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'placeholder'> & {
    buttonLabel?: string;
    buttonFontSize?: CSSLength;
};

const Input = ({ buttonLabel = '업체 검색', buttonFontSize, ...rest }: SearchInputProps) => {
    // const { data } = useSearchSelect();
    const { data } = useQuerySearch<SelectItem>();
    const { selectValue } = useSelect();

    const labelMap = useMemo(() => {
        const map = new Map<string, string>();
        data.forEach((item) => map.set(item.uuid, item.label));
        return map;
    }, [data]);

    const value = labelMap.get(selectValue) ?? '';
    const hasValue = !!value;

    return (
        <Dropdown.Trigger disabled={rest.disabled}>
            <div className={styles.InputWrapper}>
                <RoundedInput {...rest} value={value} readOnly className={hasValue ? styles.Selected : undefined} />
                <BaseButton
                    radius={8}
                    padding={{ x: 17, y: 14 }}
                    fontSize={buttonFontSize}
                    textColor="var(--Primary1)"
                    bgColor="var(--Primary2)"
                >
                    {buttonLabel}
                </BaseButton>
            </div>
        </Dropdown.Trigger>
    );
};

export default Input;
