import type Table from '@/shared/headless/Table/Table';
import React from 'react';
import { useTableContext } from '@/shared/headless/Table/Table';

const TOGGLE_COL_WIDTH = 40;

export const ColGroup = ({
    // [ADD]
    forceToggle = false,
    ...props
}: React.ComponentProps<typeof Table.ColGroup> & { forceToggle?: boolean }) => {
    const { state } = useTableContext();
    const expandable = state.hasHidden || state.rows.some((r) => r.hiddenCells.length > 0) || forceToggle;

    return (
        <colgroup>
            {expandable && <col style={{ width: `${TOGGLE_COL_WIDTH}px` }} />}
            {state.columnRow.columns.map((_, i) => (
                <col key={`col-${i}`} style={state.getColStyle(i)} {...props} />
            ))}
        </colgroup>
    );
};
