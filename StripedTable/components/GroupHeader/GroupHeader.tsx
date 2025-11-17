// 그룹 헤더(tr)용 래퍼
import Table from '@/shared/headless/Table/Table';
import React from 'react';

export const GroupHeader = ({ ...props }: React.ComponentProps<typeof Table.GroupHeader>) => (
    <Table.GroupHeader {...props} />
);
