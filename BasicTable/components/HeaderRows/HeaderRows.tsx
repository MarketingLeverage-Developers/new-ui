import React from 'react';
import HeadlessTable from '@/shared/headless/TableX/Table';
import { Row } from '../Row/Row';
import { Th } from '../Th/Th';
import type { CSSLength } from '@/shared/types';

type Props = React.ComponentProps<typeof HeadlessTable.HeaderRows> & {
    height?: CSSLength;
};

export const HeaderRows: React.FC<Props> = ({ height = 44, ...rest }) => (
    <HeadlessTable.HeaderRows {...rest} height={height} RowComponent={Row} ThComponent={Th} />
);
