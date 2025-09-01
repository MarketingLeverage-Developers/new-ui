import React, { type JSX } from 'react';
import Table from '@/shared/headless/Table/Table';
import { Body, BodyRows, Cell, ColGroup, Content, GroupHeader, Header, HeaderRows, Row, Toggle } from './components';
import styles from './StripedTable.module.scss';
import DetailsRows from './components/DetailsRows/DetailsRows';

type StripedTableComponent = {
    <T>(props: React.ComponentProps<typeof Table<T>>): JSX.Element;
    Body: typeof Body;
    BodyRows: typeof BodyRows;
    Cell: typeof Cell;
    ColGroup: typeof ColGroup;
    GroupHeader: typeof GroupHeader;
    Header: typeof Header;
    HeaderRows: typeof HeaderRows;
    Row: typeof Row;
    Toggle: typeof Toggle;
    Details: typeof Table.Details;
    DetailsRows: typeof DetailsRows;
    Content: typeof Content;
};

const StripedTable = (<T,>(props: React.ComponentProps<typeof Table<T>>) => (
    <Table<T> {...props} className={styles.StripedTable} />
)) as StripedTableComponent;

StripedTable.Body = Body;
StripedTable.BodyRows = BodyRows;
StripedTable.Cell = Cell;
StripedTable.ColGroup = ColGroup;
StripedTable.GroupHeader = GroupHeader;
StripedTable.Header = Header;
StripedTable.HeaderRows = HeaderRows;
StripedTable.Row = Row;
StripedTable.Toggle = Toggle;
StripedTable.Details = Table.Details;
StripedTable.DetailsRows = DetailsRows;
StripedTable.Content = Content;

export default StripedTable;
