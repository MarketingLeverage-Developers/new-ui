// src/shared/primitives/BasicTable/BasicTable.tsx

import React, { useState, useCallback } from 'react';
import AirTable from '@/shared/headless/AirTable/AirTable';
import styles from './BasicTable.module.scss';
import RowToggle from './components/RowToggle/RowToggle';
import classNames from 'classnames';

import { ColumnVisibilityControlsPanel } from './components/ColumnVisibilityControlsPanel/ColumnVisibilityControlsPanel';
import { Content } from './components/Content/Content';
import { TableSettingRail } from './components/TableSettingRail/TableSettingRail';
import { PinnedColumnControlsPanel } from './components/PinnedColumnControlsPanel/PinnedColumnControlsPanel';
import TableSettingTrigger from './components/TableSettingTrigger/TableSettingTrigger';
import { FilterControlsPanel } from './components/FilterControlsPanel/FilterControlsPanel';

import Flex from '../Flex/Flex';
import ExpandAllRowsButton from './components/ExpandAllRowButton/ExpandAllRowButton';

export type TableFilterItem = {
    label: string;
    element: React.ReactNode;
};

type TabKey = 'columns' | 'pinned' | 'filters';

type BasicTableProps<T> = React.ComponentProps<typeof AirTable<T>> & {
    height?: number;
    showGhost?: boolean;
    showHeader?: boolean;
    defaultExpandedRowKeys?: string[];

    filterItems?: TableFilterItem[];
    actions?: React.ReactNode;
    showExpandAllRowsButton?: boolean;

    enableAnimation?: boolean;
};

export const BasicTable = <T,>({
    height,
    showGhost = true,
    showHeader = true,
    style,
    defaultExpandedRowKeys = [],
    filterItems = [],
    actions,
    showExpandAllRowsButton,
    enableAnimation = false,
    ...props
}: BasicTableProps<T>) => {
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsTab, setSettingsTab] = useState<TabKey>('columns');

    const handleToggleSettingsVisible = useCallback(() => {
        setSettingsVisible((prev) => {
            const next = !prev;

            if (next) {
                setSettingsTab('columns');
                setSettingsOpen(true);
            } else {
                setSettingsOpen(false);
            }

            return next;
        });
    }, []);

    const handleSelectTab = useCallback((tab: TabKey) => {
        setSettingsTab((prevTab) => {
            if (prevTab === tab) {
                setSettingsOpen((prevOpen) => !prevOpen);
                return prevTab;
            }

            setSettingsOpen(true);
            return tab;
        });
    }, []);

    return (
        <AirTable
            {...props}
            defaultExpandedRowKeys={defaultExpandedRowKeys}
            enableAnimation={enableAnimation}
            style={{
                ...(style ?? {}),
                width: '100%',
                height: height ? `${height}px` : '100%',
                minHeight: 0,
                minWidth: 0,
            }}
        >
            {/* ✅ AirTable 내부로 툴바를 넣어서 context를 공유 */}
            <Flex direction="column" height="100%" minHeight={0} minWidth={0}>
                {/* ✅ 툴바 */}
                <Flex justify="space-between" margin={{ b: 12 }}>
                    <Flex align="center" gap={8}>
                        {filterItems.map((item) => (
                            <React.Fragment key={item.label}>{item.element}</React.Fragment>
                        ))}
                    </Flex>

                    <Flex justify="end" gap={8}>
                        {actions}
                        {showExpandAllRowsButton && <ExpandAllRowsButton />}
                        <TableSettingTrigger open={settingsVisible} onToggle={handleToggleSettingsVisible} />
                    </Flex>
                </Flex>

                {/* ✅ 테이블 + 설정패널 영역 */}
                <div
                    className={classNames(styles.container)}
                    style={{
                        display: 'flex',
                        width: '100%',
                        flex: 1,
                        minHeight: 0,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
                        <AirTable.Container height="100%" className={classNames(styles.container)}>
                            {showHeader && (
                                <AirTable.Header className={styles.header} headerCellClassName={styles.headerCell} />
                            )}

                            <AirTable.Body
                                className={classNames(styles.body)}
                                rowClassName={styles.row}
                                cellClassName={styles.cell}
                                selectedCellClassName={styles.selected}
                                detailRowClassName={styles.detailRow}
                                detailCellClassName={styles.detailCell}
                            />

                            {showGhost && <AirTable.Ghost className={styles.ghost} />}
                        </AirTable.Container>
                    </div>

                    {settingsVisible && (
                        <>
                            {settingsOpen && (
                                <div
                                    style={{
                                        width: 260,
                                        flexShrink: 0,
                                        borderLeft: '1px solid var(--Gray5)',
                                        background: 'var(--White1)',
                                        overflow: 'auto',
                                    }}
                                >
                                    {settingsTab === 'columns' && <ColumnVisibilityControlsPanel<T> />}
                                    {settingsTab === 'pinned' && <PinnedColumnControlsPanel<T> />}
                                    {settingsTab === 'filters' && <FilterControlsPanel items={filterItems} />}
                                </div>
                            )}

                            <TableSettingRail open={settingsOpen} tab={settingsTab} onSelectTab={handleSelectTab} />
                        </>
                    )}
                </div>
            </Flex>
        </AirTable>
    );
};

BasicTable.RowToggle = RowToggle;
BasicTable.Content = Content;
