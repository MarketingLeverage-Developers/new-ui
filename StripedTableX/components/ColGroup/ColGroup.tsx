// StripedTable/components/ColGroup/ColGroup.tsx
// <colgroup> + 데이터 컬럼 <col> 정의 (토글 컬럼도 그냥 일반 컬럼으로 포함)
import type Table from '@/shared/headless/TableX/Table';
import React from 'react';
import { useTableContext } from '@/shared/headless/TableX/Table';

export const ColGroup = (props: React.ComponentProps<typeof Table.ColGroup>) => {
    const { state } = useTableContext();

    return (
        <colgroup>
            {state.columnRow.columns.map((_, i) => (
                <col key={`col-${i}`} style={state.getColStyle(i)} {...props} />
            ))}
        </colgroup>
    );
};
