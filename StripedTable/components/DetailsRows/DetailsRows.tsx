// DetailsRows.tsx
import type { UseTableResult } from '@/shared/headless/Table/Table';
import React from 'react';
import DetailsRow from '../DetailsRow/DetailsRow';

export type RowType<T> = UseTableResult<T>['rows'][number];
export type HiddenCell<T> = RowType<T>['hiddenCells'][number];

export type DetailsRowsProps<T> = {
    row: RowType<T>;
    ri: number;
    className?: string;
    style?: React.CSSProperties;
};

const DetailsRows = <T,>({ row, ri, className, style }: DetailsRowsProps<T>) => {
    const isBaseWhite = ri % 2 === 0;

    return (
        <div className={className} style={{ backgroundColor: 'transparent', ...style }}>
            {row.hiddenCells.map((hc: HiddenCell<T>, hi: number) => (
                <DetailsRow
                    key={`hidden-${hc.key}-${hi}`}
                    row={row}
                    hc={hc}
                    ri={ri}
                    hi={hi}
                    isBaseWhite={isBaseWhite}
                />
            ))}
        </div>
    );
};

export default DetailsRows;
