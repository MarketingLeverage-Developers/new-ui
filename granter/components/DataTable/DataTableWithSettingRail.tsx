import React from 'react';
import classNames from 'classnames';
import AirTable from '../../../shared/headless/AirTable/AirTable';
import { useSuppressPostResizeHeaderClick } from '../../../shared/hooks/client/useSuppressPostResizeHeaderClick';
import { ColumnVisibilityControlsPanel } from '@/components/common/BasicTable/components/ColumnVisibilityControlsPanel/ColumnVisibilityControlsPanel';
import { ColumnVisibilityControlsPanel2 } from '@/components/common/BasicTable/components/ColumnVisibilityControlsPanel/ColumnVisibilityControlsPanel2';
import { FilterControlsPanel } from '@/components/common/BasicTable/components/FilterControlsPanel/FilterControlsPanel';
import { PinnedColumnControlsPanel } from '@/components/common/BasicTable/components/PinnedColumnControlsPanel/PinnedColumnControlsPanel';
import { PinnedColumnControlsPanel2 } from '@/components/common/BasicTable/components/PinnedColumnControlsPanel/PinnedColumnControlsPanel2';
import { TableSettingRail } from '@/components/common/BasicTable/components/TableSettingRail/TableSettingRail';
import type { AirTableComponentLike } from '@/components/common/BasicTable/BasicTable';
import type { DataTableProps } from './DataTable';
import Text from '../Text/Text';
import styles from './DataTable.module.scss';

export type DataTableWithSettingRailTab = 'columns' | 'pinned' | 'filters';

export type DataTableWithSettingRailFilterItem = {
    label: string;
    element: React.ReactNode;
};

export type DataTableWithSettingRailProps<T> = Omit<DataTableProps<T>, 'showColumnVisibilityControl'> & {
    isSettingOpen: boolean;
    settingTab: DataTableWithSettingRailTab;
    onSelectSettingTab: (tab: DataTableWithSettingRailTab) => void;
    filterItems?: DataTableWithSettingRailFilterItem[];
    panelWidth?: number;
    railWidth?: number;
};

const DataTableWithSettingRail = <T,>({
    airTableComponent: AirTableComponent = AirTable,
    data,
    columns,
    rowKeyField,
    height = 520,
    onScrollElReady,
    defaultColWidth = 120,
    storageKey,
    onPersistedStateChange,
    persistedStateSyncVersion,
    defaultSortState,
    sortState,
    onSortChange,
    sortMode = 'internal',
    filterState,
    onFilterChange,
    filterMode = 'internal',
    filterOptionsData,
    fillContainerWidth = true,
    enableVirtualization = false,
    virtualRowHeight,
    virtualOverscan,
    enableAnimation = false,
    animationRowLimit,
    detailRenderer,
    getRowCanExpand,
    getExpandedRows,
    getRowLevel,
    defaultExpandedRowKeys,
    persistExpandedRowKeys,
    pinnedColumnKeys,
    pinnedHeaderBgColor,
    pinnedHeaderTextColor,
    getRowStyle,
    emptyText = '조건에 맞는 내역이 없습니다.',
    className,
    headerClassName,
    headerCellClassName,
    bodyClassName,
    rowClassName,
    rowSelectedClassName,
    cellClassName,
    selectedCellClassName,
    activeCellClassName,
    ghostClassName,
    emptyStateClassName,
    isSettingOpen,
    settingTab,
    onSelectSettingTab,
    filterItems = [],
    panelWidth = 260,
    railWidth = 44,
}: DataTableWithSettingRailProps<T>) => {
    const resizeClickGuard = useSuppressPostResizeHeaderClick();
    const showFilterTab = filterItems.length > 0;
    const effectiveSettingTab = showFilterTab || settingTab !== 'filters' ? settingTab : 'columns';
    const reservedRightSpace = isSettingOpen ? panelWidth + railWidth : 0;
    const useOwnBasicTablePanels = Boolean((AirTableComponent as AirTableComponentLike).useOwnBasicTablePanels);

    return (
        <div
            className={classNames(styles.Shell, className)}
            onMouseDownCapture={resizeClickGuard.onMouseDownCapture}
            onClickCapture={resizeClickGuard.onClickCapture}
        >
            <AirTableComponent
                data={data}
                columns={columns}
                rowKeyField={rowKeyField}
                defaultColWidth={defaultColWidth}
                storageKey={storageKey}
                onPersistedStateChange={onPersistedStateChange}
                persistedStateSyncVersion={persistedStateSyncVersion}
                showColumnVisibilityControl={false}
                defaultSortState={defaultSortState}
                sortState={sortState}
                onSortChange={onSortChange}
                sortMode={sortMode}
                filterState={filterState}
                onFilterChange={onFilterChange}
                filterMode={filterMode}
                filterOptionsData={filterOptionsData}
                fillContainerWidth={fillContainerWidth}
                enableVirtualization={enableVirtualization}
                virtualRowHeight={virtualRowHeight}
                virtualOverscan={virtualOverscan}
                enableAnimation={enableAnimation}
                animationRowLimit={animationRowLimit}
                detailRenderer={detailRenderer}
                getRowCanExpand={getRowCanExpand}
                getExpandedRows={getExpandedRows}
                getRowLevel={getRowLevel}
                defaultExpandedRowKeys={defaultExpandedRowKeys}
                persistExpandedRowKeys={persistExpandedRowKeys}
                pinnedColumnKeys={pinnedColumnKeys}
                pinnedHeaderBgColor={pinnedHeaderBgColor}
                pinnedHeaderTextColor={pinnedHeaderTextColor}
                getRowStyle={getRowStyle}
            >
                <div style={{ position: 'relative', width: '100%', height: '100%', minWidth: 0, minHeight: 0 }}>
                    <div
                        style={{
                            minWidth: 0,
                            minHeight: 0,
                            height: '100%',
                            boxSizing: 'border-box',
                            paddingRight: reservedRightSpace,
                            transition: 'padding-right 0.18s ease',
                        }}
                    >
                        <AirTableComponent.Container
                            className={styles.Container}
                            height={height}
                            onScrollElReady={onScrollElReady}
                        >
                            <AirTableComponent.Header
                                className={classNames(styles.Header, headerClassName)}
                                headerCellClassName={classNames(styles.HeaderCell, headerCellClassName)}
                            />

                            {data.length > 0 ? (
                                <AirTableComponent.Body
                                    className={classNames(styles.Body, bodyClassName)}
                                    rowClassName={classNames(styles.Row, rowClassName)}
                                    rowSelectedClassName={classNames(styles.RowSelected, rowSelectedClassName)}
                                    cellClassName={classNames(styles.Cell, cellClassName)}
                                    selectedCellClassName={classNames(styles.CellSelected, selectedCellClassName)}
                                    activeCellClassName={classNames(styles.CellActive, activeCellClassName)}
                                />
                            ) : (
                                <div className={classNames(styles.EmptyState, emptyStateClassName)}>
                                    {typeof emptyText === 'string' ? (
                                        <Text size="md" tone="muted">
                                            {emptyText}
                                        </Text>
                                    ) : (
                                        emptyText
                                    )}
                                </div>
                            )}

                            <AirTableComponent.Ghost className={classNames(styles.Ghost, ghostClassName)} />
                        </AirTableComponent.Container>
                    </div>

                    {isSettingOpen ? (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                minHeight: 0,
                                zIndex: 10,
                                background: 'var(--granter-white)',
                            }}
                        >
                            <div
                                style={{
                                    width: panelWidth,
                                    minHeight: 0,
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    borderLeft: '1px solid var(--granter-gray-200)',
                                    background: 'var(--granter-white)',
                                }}
                            >
                                {effectiveSettingTab === 'columns' ? (
                                    useOwnBasicTablePanels ? (
                                        <ColumnVisibilityControlsPanel2<T> />
                                    ) : (
                                        <ColumnVisibilityControlsPanel<T> />
                                    )
                                ) : null}
                                {effectiveSettingTab === 'pinned' ? (
                                    useOwnBasicTablePanels ? (
                                        <PinnedColumnControlsPanel2<T> />
                                    ) : (
                                        <PinnedColumnControlsPanel<T> />
                                    )
                                ) : null}
                                {effectiveSettingTab === 'filters' && showFilterTab ? (
                                    <FilterControlsPanel items={filterItems} />
                                ) : null}
                            </div>

                            <div
                                style={{
                                    width: railWidth,
                                    minHeight: 0,
                                    borderLeft: '1px solid var(--granter-gray-200)',
                                    background: 'var(--granter-white)',
                                }}
                            >
                                <TableSettingRail
                                    open={isSettingOpen}
                                    tab={effectiveSettingTab}
                                    onSelectTab={onSelectSettingTab}
                                    showFilters={showFilterTab}
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            </AirTableComponent>
        </div>
    );
};

export default DataTableWithSettingRail;
