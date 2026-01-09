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

    /** ✅✅✅ 필터는 label+element 배열로 받는다 */
    filterItems?: TableFilterItem[];
    actions?: React.ReactNode;
    showExpandAllRowsButton?: boolean;

    /** ✅✅✅ 애니메이션 on/off */
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
    enableAnimation = false, // ✅✅✅ 기본 false
    ...props
}: BasicTableProps<T>) => {
    /** ✅✅✅ (1) 설정 UI 전체 표시 여부 */
    const [settingsVisible, setSettingsVisible] = useState(false);

    /** ✅✅✅ (2) 설정 패널 open 여부 */
    const [settingsOpen, setSettingsOpen] = useState(false);

    /** ✅✅✅ (3) 선택 탭 */
    const [settingsTab, setSettingsTab] = useState<TabKey>('columns');

    /** ✅✅✅ Trigger 클릭 -> 전체 UI 토글 */
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

    /** ✅✅✅ Rail 탭 클릭 */
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
            enableAnimation={enableAnimation} // ✅✅✅ 전달
        >
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

            <div
                className={classNames(styles.container)}
                style={{
                    display: 'flex',
                    width: '100%',
                    height: height ? `${height}px` : '100%',
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
        </AirTable>
    );
};

BasicTable.RowToggle = RowToggle;
BasicTable.Content = Content;
