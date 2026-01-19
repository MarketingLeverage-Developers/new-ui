import RoundedSelect from '@/shared/primitives/RoundedSelect/RoundedSelect';
import React from 'react';

type IsDeleteSelectProps = {
    isDelete: string | null;
    onClick: () => void;
};

export const IsDeleteSelect = ({ isDelete, onClick }: IsDeleteSelectProps) => (
    <RoundedSelect value={isDelete ?? 'false'}>
        <RoundedSelect.Display
            render={(value) => <>{value === 'true' ? '삭제내역' : '문의내역'}</>}
            onClick={onClick}
        />
        {/* <RoundedSelect.Content matchTriggerWidth>
            <RoundedSelect.Item value="false">문의내역</RoundedSelect.Item>
            <RoundedSelect.Item value="true">삭제내역</RoundedSelect.Item>
        </RoundedSelect.Content> */}
    </RoundedSelect>
);
