import React, { useCallback, useMemo, useState } from 'react';
import BlackButton from '../Button/BlackButton';
import WhiteButton from '../Button/WhiteButton';
import SectionFieldInput from '../SectionFieldInput/SectionFieldInput';
import Text from '../Text/Text';
import styles from './CommaSeparatedValueField.module.scss';
import { joinCommaSeparatedValues, parseCommaSeparatedValues } from './utils';

export type CommaSeparatedValueFieldProps = {
    value: string;
    onChange: (nextValue: string) => void;
    inputPlaceholder?: string;
    emptyText?: string;
    addButtonText?: string;
    removeButtonText?: string;
    disabled?: boolean;
};

const CommaSeparatedValueField = ({
    value,
    onChange,
    inputPlaceholder = '값을 입력하세요',
    emptyText = '추가된 항목이 없습니다.',
    addButtonText = '추가',
    removeButtonText = '제거',
    disabled = false,
}: CommaSeparatedValueFieldProps) => {
    const [pendingValue, setPendingValue] = useState('');
    const selectedValues = useMemo(() => parseCommaSeparatedValues(value), [value]);

    const addPendingValues = useCallback(() => {
        const nextCandidates = parseCommaSeparatedValues(pendingValue);

        if (nextCandidates.length === 0) return;

        const nextValues = [...selectedValues];

        nextCandidates.forEach((candidate) => {
            if (!nextValues.includes(candidate)) {
                nextValues.push(candidate);
            }
        });

        onChange(joinCommaSeparatedValues(nextValues));
        setPendingValue('');
    }, [onChange, pendingValue, selectedValues]);

    const removeValue = useCallback(
        (targetValue: string) => {
            onChange(joinCommaSeparatedValues(selectedValues.filter((item) => item !== targetValue)));
        },
        [onChange, selectedValues]
    );

    return (
        <div className={styles.Root}>
            <div className={styles.Form}>
                <SectionFieldInput
                    value={pendingValue}
                    onChange={(event) => setPendingValue(event.target.value)}
                    placeholder={inputPlaceholder}
                    disabled={disabled}
                    onKeyDown={(event) => {
                        if (event.key !== 'Enter' && event.key !== ',') return;

                        event.preventDefault();
                        addPendingValues();
                    }}
                />
                <BlackButton size="sm" disabled={disabled || pendingValue.trim().length === 0} onClick={addPendingValues}>
                    {addButtonText}
                </BlackButton>
            </div>

            {selectedValues.length === 0 ? (
                <Text size="sm" tone="muted">
                    {emptyText}
                </Text>
            ) : (
                <div className={styles.List}>
                    {selectedValues.map((item) => (
                        <div key={item} className={styles.Item}>
                            <Text size="sm" weight="medium" className={styles.ItemText}>
                                {item}
                            </Text>
                            <WhiteButton size="sm" disabled={disabled} onClick={() => removeValue(item)}>
                                {removeButtonText}
                            </WhiteButton>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommaSeparatedValueField;
