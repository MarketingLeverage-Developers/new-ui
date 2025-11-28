// 줄무늬 스타일을 입힌 Table 스킨 컴포넌트
import React, { type JSX } from 'react';
import Table from '@/shared/headless/TableX/Table';
import {
    Body,
    BodyRows,
    Cell,
    ColGroup,
    Content,
    GroupHeader,
    Header,
    HeaderRows,
    Row,
    ScrollContainer,
    Toggle,
} from './components';
import styles from './StripedTable.module.scss';
import DetailsRows from './components/DetailsRows/DetailsRows';
import { ColumnSelectBox } from './components/ColumnSelectBox/ColumnSelectBox';
import { View } from './components/View/View';

type StripedTableComponent = {
    // 제네릭 Table 래퍼
    <T>(props: React.ComponentProps<typeof Table<T>>): JSX.Element;
    // 합성용 파츠들
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
    ScrollContainer: typeof ScrollContainer;
    ColumnSelectBox: typeof ColumnSelectBox;
    View: typeof View;
};

const StripedTable = (<T,>(props: React.ComponentProps<typeof Table<T>>) => (
    <Table<T> {...props} className={styles.StripedTable} />
)) as StripedTableComponent;

// 합성 컴포넌트 바인딩
StripedTable.ScrollContainer = ScrollContainer;
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
StripedTable.ColumnSelectBox = ColumnSelectBox;
StripedTable.View = View;

export default StripedTable;
