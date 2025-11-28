// ❗ 과거 hiddenCells 기반 디테일 행을 그리던 컴포넌트
// 지금은 viewport 숨김 기능을 제거했기 때문에,
// API만 유지하고 실제로는 비어있는 컨테이너만 렌더링 (사실상 deprecated)
import type { UseTableResult } from '@/shared/headless/TableX/Table';
import React from 'react';

export type RowType<T> = UseTableResult<T>['rows'][number];

export type DetailsRowsProps<T> = {
    row: RowType<T>;
    ri: number;
    className?: string;
    style?: React.CSSProperties;
};

const DetailsRows = <T,>({ className, style }: DetailsRowsProps<T>) => (
    <div className={className} style={{ backgroundColor: 'transparent', ...style }} />
);

export default DetailsRows;
