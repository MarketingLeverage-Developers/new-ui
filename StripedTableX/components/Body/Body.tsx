// StripedTable 전용 tbody 래퍼
import React from 'react';
import Table from '@/shared/headless/TableX/Table';

export const Body = (props: React.ComponentProps<typeof Table.Body>) => <Table.Body {...props} />;
