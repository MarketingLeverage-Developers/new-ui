import RoundedSelect from '@/shared/primitives/RoundedSelect/RoundedSelect';
import React from 'react';

type IsDeleteSelectProps = {
    isDelete: string | null;
    onChange: (value: string) => void;
};

export const IsDeleteSelect = ({ isDelete, onChange }: IsDeleteSelectProps) => (
    <RoundedSelect value={isDelete ?? 'false'} onChange={(value) => onChange(value)}>
        <RoundedSelect.Display render={(value) => <>{value === 'true' ? '삭제내역' : '문의내역'}</>} />
        <RoundedSelect.Content matchTriggerWidth>
            <RoundedSelect.Item value="false">문의내역</RoundedSelect.Item>
            <RoundedSelect.Item value="true">삭제내역</RoundedSelect.Item>
        </RoundedSelect.Content>
    </RoundedSelect>
);
