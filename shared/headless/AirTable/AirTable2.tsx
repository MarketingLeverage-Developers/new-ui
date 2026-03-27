import React, { useLayoutEffect, useMemo, useState } from 'react';
import type { FilterState as ExternalFilterState } from '@/shared/headless/AirTable/AirTable';
import AirTable from './AirTable';
import { useAirTableContext } from './AirTable';
import { Body2 } from './components/Body2';
import { ColumnVisibilityControl } from './components/ColumnVisibilityControl';
import Header2 from './components/Header2';

type AirTable2Props<T> = Omit<
    React.ComponentProps<typeof AirTable<T>>,
    'filterState' | 'defaultFilterState' | 'onFilterChange'
> & {
    filterState?: ExternalFilterState;
    defaultFilterState?: ExternalFilterState;
    onFilterChange?: (next: ExternalFilterState) => void;
};

const AirTable2Scaffold = <T,>({ showColumnVisibilityControl }: { showColumnVisibilityControl?: boolean }) => {
    const { baseOrder, widthByKey } = useAirTableContext<T>();

    const tableMinWidthPx = useMemo(
        () => baseOrder.reduce((sum, key) => sum + (widthByKey[key] ?? 0), 0),
        [baseOrder, widthByKey]
    );

    return (
        <>
            {showColumnVisibilityControl ? <ColumnVisibilityControl portalId="column-select-box-portal" /> : null}
            <AirTable.Container>
                <div
                    style={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 30,
                        background: '#fff',
                        minWidth: `${tableMinWidthPx}px`,
                    }}
                >
                    <Header2 />
                </div>

                <Body2 />
                <AirTable.Ghost />
            </AirTable.Container>
        </>
    );
};

const buildRemountKey = (storageKey?: string, persistedStateSyncVersion?: number) =>
    `${storageKey ?? 'AirTable2'}::${String(persistedStateSyncVersion ?? '')}`;

const AirTable2Inner = <T,>(props: AirTable2Props<T>) => {
    const remountKey = useMemo(
        () => buildRemountKey(props.storageKey, props.persistedStateSyncVersion),
        [props.storageKey, props.persistedStateSyncVersion]
    );
    const [readyKey, setReadyKey] = useState<string | null>(null);

    useLayoutEffect(() => {
        setReadyKey(remountKey);
    }, [remountKey]);

    if (readyKey !== remountKey) return null;
    if (props.children) {
        return <AirTable key={remountKey} {...(props as React.ComponentProps<typeof AirTable<T>>)} gridMetaVariant="spread" />;
    }

    return (
        <AirTable key={remountKey} {...(props as React.ComponentProps<typeof AirTable<T>>)} gridMetaVariant="spread">
            <AirTable2Scaffold showColumnVisibilityControl={props.showColumnVisibilityControl} />
        </AirTable>
    );
};

type AirTable2Component = (<T,>(props: AirTable2Props<T>) => React.ReactElement | null) & {
    Container: typeof AirTable.Container;
    Header: typeof Header2;
    Body: typeof Body2;
    Ghost: typeof AirTable.Ghost;
    RowToggle: typeof AirTable.RowToggle;
    ColumnSelectBoxPortal: typeof AirTable.ColumnSelectBoxPortal;
    CellContextMenuPortal: typeof AirTable.CellContextMenuPortal;
};

const AirTable2 = Object.assign(AirTable2Inner, {
    Container: AirTable.Container,
    Header: Header2,
    Body: Body2,
    Ghost: AirTable.Ghost,
    RowToggle: AirTable.RowToggle,
    ColumnSelectBoxPortal: AirTable.ColumnSelectBoxPortal,
    CellContextMenuPortal: AirTable.CellContextMenuPortal,
}) as AirTable2Component;

export default AirTable2;
