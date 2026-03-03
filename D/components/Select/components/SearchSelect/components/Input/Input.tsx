import React, { useMemo } from 'react';
import styles from './Input.module.scss';
import { useSelect } from '../../../../../../../shared/headless/Select/Select';
import Dropdown from '../../../../../../../shared/headless/Dropdown/Dropdown';
import BaseButton from '../../../../../Button/components/BaseButton/BaseButton';
import { useQuerySearch } from '../../../../../../../shared/headless/QuerySearch/QuerySearch';
import RoundedInput from '../../../../../../../RoundedInput/RoundedInput';
import type { CSSLength } from '../../../../../../../shared/types';

/** 기존 SearchSelect Input을 D 패턴에 맞춰 이동 */
type SearchSelectInputProps = Omit<React.ComponentProps<typeof RoundedInput>, 'value' | 'onChange' | 'placeholder'> & {
    width?: CSSLength;
    buttonLabel?: React.ReactNode;
    buttonWidth?: CSSLength;
    buttonHegiht?: CSSLength;
    buttonHeight?: CSSLength;
    inputWrapperStyle?: React.CSSProperties;
};

const SearchSelectInput: React.FC<SearchSelectInputProps> = ({
    width,
    buttonLabel = '업체 검색',
    buttonWidth,
    buttonHegiht,
    buttonHeight,
    inputWrapperStyle,
    wrapperStyle,
    className,
    ...rest
}) => {
    const { data } = useQuerySearch<any>();
    const { selectValue } = useSelect();
    const roundedInputWrapperStyle: React.CSSProperties = {
        ...(width == null ? { flex: 1, minWidth: 0 } : {}),
        ...wrapperStyle,
        ...(width != null ? { width } : {}),
    };

    const labelMap = useMemo(() => {
        const map = new Map<string, string>();
        data.forEach((i: any) => map.set(i.uuid, i.label));
        return map;
    }, [data]);

    const value = labelMap.get(selectValue) ?? '';
    const hasValue = !!value;

    return (
        <Dropdown.Trigger disabled={rest.disabled}>
            <div className={styles.InputWrapper} style={inputWrapperStyle}>
                <RoundedInput
                    {...rest}
                    value={value}
                    readOnly
                    wrapperStyle={roundedInputWrapperStyle}
                    className={[className, hasValue ? styles.Selected : undefined].filter(Boolean).join(' ')}
                />
                <BaseButton
                    radius={8}
                    width={buttonWidth}
                    height={buttonHegiht ?? buttonHeight ?? '100%'}
                    padding={{ x: 17, y: 14 }}
                    textColor="var(--Primary1)"
                    bgColor="var(--Primary2)"
                    style={buttonWidth == null ? { minWidth: 95 } : undefined}
                >
                    {buttonLabel}
                </BaseButton>
            </div>
        </Dropdown.Trigger>
    );
};

export type { SearchSelectInputProps };
export default SearchSelectInput;
