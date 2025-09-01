import Table from '@/shared/headless/Table/Table';
import React from 'react';

export const GroupHeader = ({ ...props }: React.ComponentProps<typeof Table.GroupHeader>) => (
    <Table.GroupHeader {...props} />
);
