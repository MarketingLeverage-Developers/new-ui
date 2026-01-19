import RoundedSelect from '@/shared/primitives/RoundedSelect/RoundedSelect';
import React from 'react';
type Props = {
    size: number;
    onChange: (size: number) => void;
};

export const PageSizeSelect = ({ size, onChange }: Props) => (
    <RoundedSelect value={String(size)} onChange={(value) => onChange(Number(value))}>
        <RoundedSelect.Display render={() => <>{size}개씩 보기</>} />
        <RoundedSelect.Content>
            <RoundedSelect.Item value="20">20개 씩 보기</RoundedSelect.Item>
            <RoundedSelect.Item value="50">50개 씩 보기</RoundedSelect.Item>
            <RoundedSelect.Item value="100">100개 씩 보기</RoundedSelect.Item>
        </RoundedSelect.Content>
    </RoundedSelect>
);
