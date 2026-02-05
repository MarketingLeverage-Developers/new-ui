// src/shared/primitives/BasicTable/BasicTable.tsx

import React, { useState, useCallback, useMemo } from 'react';
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
import Text from '../Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import { FaFileAlt } from 'react-icons/fa';

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
    persistExpandedRowKeys?: boolean;

    filterItems?: TableFilterItem[];
    actions?: React.ReactNode;
    showExpandAllRowsButton?: boolean;

    enableAnimation?: boolean;
    onScrollElReady?: (el: HTMLDivElement | null) => void;
};

export const BasicTable = <T,>({
    height,
    showGhost = true,
    showHeader = true,
    style,
    defaultExpandedRowKeys = [],
    persistExpandedRowKeys = false,
    filterItems = [],
    actions,
    showExpandAllRowsButton,
    enableAnimation = false,
    onScrollElReady,
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

    // ✅ rail의 실제 폭을 모르니 일단 "레일이 차지할 폭"을 고정값으로 둠
    // 만약 TableSettingRail 실제 width가 다르면 이 값만 맞추면 됨
    const RAIL_WIDTH = 44;
    const PANEL_WIDTH = 260;

    const reservedRightSpace = useMemo(() => {
        if (!settingsVisible) return 0;
        if (!settingsOpen) return RAIL_WIDTH;
        return PANEL_WIDTH + RAIL_WIDTH;
    }, [settingsOpen, settingsVisible]);

    const data = props.data;

    return (
        <AirTable
            {...props}
            defaultExpandedRowKeys={defaultExpandedRowKeys}
            persistExpandedRowKeys={persistExpandedRowKeys}
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
                    {/* ✅ 테이블 영역 (오른쪽 패널 공간만큼 paddingRight로 확보해서 겹침 방지) */}
                    <div
                        style={{
                            flex: 1,
                            minWidth: 0,
                            height: '100%',
                            paddingRight: reservedRightSpace,
                            boxSizing: 'border-box',
                        }}
                    >
                        <AirTable.Container
                            height="100%"
                            className={classNames(styles.container)}
                            onScrollElReady={onScrollElReady}
                        >
                            {showHeader && (
                                <AirTable.Header className={styles.header} headerCellClassName={styles.headerCell} />
                            )}

                            {data.length ? (
                                <AirTable.Body
                                    className={classNames(styles.body)}
                                    rowClassName={styles.row}
                                    cellClassName={styles.cell}
                                    selectedCellClassName={styles.selected}
                                    detailRowClassName={styles.detailRow}
                                    detailCellClassName={styles.detailCell}
                                />
                            ) : (
                                // TODO : 임시 데이터 없음 UI
                                <Flex
                                    direction="column"
                                    height={'100%'}
                                    width={'100%'}
                                    justify="center"
                                    align="center"
                                    padding={24}
                                    gap={8}
                                >
                                    {/* <Image width={50} src={NoDataIcon} alt="" loading="lazy" /> */}
                                    <FaFileAlt fontSize={48} color={getThemeColor('Gray4')} />
                                    <Text fontSize={15} textColor={getThemeColor('Gray1')}>
                                        데이터가 없습니다.
                                    </Text>
                                </Flex>
                            )}

                            {showGhost && <AirTable.Ghost className={styles.ghost} />}
                        </AirTable.Container>
                    </div>

                    {/* ✅ 설정 패널: 테이블 영역 컨테이너를 기준으로 absolute 고정 => 높이 100% 확정 */}
                    {settingsVisible && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                display: 'flex',
                                height: '100%',
                                minHeight: 0,
                                overflow: 'hidden',
                                zIndex: 10,
                            }}
                        >
                            {settingsOpen && (
                                <div
                                    style={{
                                        width: PANEL_WIDTH,
                                        height: '100%',
                                        minHeight: 0,
                                        flexShrink: 0,
                                        borderLeft: '1px solid var(--Gray5)',
                                        background: 'var(--White1)',
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                    }}
                                >
                                    {settingsTab === 'columns' && <ColumnVisibilityControlsPanel<T> />}
                                    {settingsTab === 'pinned' && <PinnedColumnControlsPanel<T> />}
                                    {settingsTab === 'filters' && <FilterControlsPanel items={filterItems} />}
                                </div>
                            )}

                            <div
                                style={{
                                    width: RAIL_WIDTH,
                                    height: '100%',
                                    minHeight: 0,
                                    flexShrink: 0,
                                }}
                            >
                                <TableSettingRail open={settingsOpen} tab={settingsTab} onSelectTab={handleSelectTab} />
                            </div>
                        </div>
                    )}
                </div>
            </Flex>
        </AirTable>
    );
};

BasicTable.RowToggle = RowToggle;
BasicTable.Content = Content;
