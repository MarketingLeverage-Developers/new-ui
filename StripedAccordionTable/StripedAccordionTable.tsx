import React, { type JSX } from 'react';
import AccordionTable from '@/shared/headless/AccordionTable/AccordionTable';
import type Table from '@/shared/headless/AccordionTable/AccordionTable';
import { Body, BodyRows, Cell, ColGroup, Content, GroupHeader, Header, HeaderRows, Row, Toggle } from './components';
import styles from './StripedAccordionTable.module.scss';
import DetailsContent from './components/DetailsContent/DetailsContent';

type StripedAccordionTableComponent = {
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
    Details: typeof AccordionTable.Details;
    Content: typeof Content;
    DetailsContent: typeof DetailsContent;
};

const StripedAccordionTable = (<T,>(props: React.ComponentProps<typeof Table<T>>) => (
    <AccordionTable<T> {...props} className={styles.StripedAccordionTable} />
)) as StripedAccordionTableComponent;

StripedAccordionTable.Body = Body;
StripedAccordionTable.BodyRows = BodyRows;
StripedAccordionTable.Cell = Cell;
StripedAccordionTable.ColGroup = ColGroup;
StripedAccordionTable.GroupHeader = GroupHeader;
StripedAccordionTable.Header = Header;
StripedAccordionTable.HeaderRows = HeaderRows;
StripedAccordionTable.Row = Row;
StripedAccordionTable.Toggle = Toggle;
StripedAccordionTable.Details = AccordionTable.Details; // ✅ 컨텍스트 재사용
StripedAccordionTable.Content = Content;
StripedAccordionTable.DetailsContent = DetailsContent;

export default StripedAccordionTable;
