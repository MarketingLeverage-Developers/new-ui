import React, { type JSX } from 'react';
import Table from '@/shared/headless/TableX/Table';
import {
    Body,
    BodyRows,
    Cell,
    ColGroup,
    ColumnSelectBoxPortal,
    Content,
    Header,
    HeaderRows,
    Row,
    ScrollContainer,
    Th,
    View,
} from './components';
import styles from './BasicTable.module.scss';
import DetailsRows from './components/DetailsRows/DetailsRows';
import { ColumnSelectBox } from './components/ColumnSelectBox/ColumnSelectBox';
import SearchColumnSelectBox from './components/SearchColumnSelectBox/SearchColumnSelectBox';

type BasicTableComponent = {
    // 제네릭 Table 래퍼
    <T>(props: React.ComponentProps<typeof Table<T>>): JSX.Element;

    // 합성용 파츠들
    Body: typeof Body;
    BodyRows: typeof BodyRows;
    Cell: typeof Cell;
    ColGroup: typeof ColGroup;
    Header: typeof Header;
    HeaderRows: typeof HeaderRows;
    Row: typeof Row;
    Th: typeof Th;
    Content: typeof Content;
    ScrollContainer: typeof ScrollContainer;

    // ✅ Details 기능 유지
    Details: typeof Table.Details;
    DetailsRows: typeof DetailsRows;

    ColumnSelectBox: typeof ColumnSelectBox;
    ColumnSelectBoxPortal: typeof ColumnSelectBoxPortal;
    SearchColumnSelectBox: typeof ColumnSelectBox;

    View: typeof View;
};

const BasicTable = (<T,>(props: React.ComponentProps<typeof Table<T>>) => (
    <Table<T> {...props} className={styles.BasicTable} />
)) as BasicTableComponent;

// 합성 컴포넌트 바인딩
BasicTable.ScrollContainer = ScrollContainer;
BasicTable.Body = Body;
BasicTable.BodyRows = BodyRows;
BasicTable.Cell = Cell;
BasicTable.ColGroup = ColGroup;
BasicTable.Header = Header;
BasicTable.HeaderRows = HeaderRows;
BasicTable.Row = Row;
BasicTable.Th = Th;
BasicTable.Content = Content;

// ✅ Details 기능 복구
BasicTable.Details = Table.Details;
BasicTable.DetailsRows = DetailsRows;

BasicTable.ColumnSelectBox = ColumnSelectBox;
BasicTable.ColumnSelectBoxPortal = ColumnSelectBoxPortal;
BasicTable.View = View;
BasicTable.SearchColumnSelectBox = SearchColumnSelectBox;

export default BasicTable;
