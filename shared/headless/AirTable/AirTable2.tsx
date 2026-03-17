import React, { useLayoutEffect, useMemo, useState } from 'react';
import AirTable from './AirTable';
import { Body2 } from './components/Body2';

const buildRemountKey = (storageKey?: string, persistedStateSyncVersion?: number) =>
    `${storageKey ?? 'AirTable2'}::${String(persistedStateSyncVersion ?? '')}`;

const AirTable2Inner = <T,>(props: React.ComponentProps<typeof AirTable<T>>) => {
    const remountKey = useMemo(
        () => buildRemountKey(props.storageKey, props.persistedStateSyncVersion),
        [props.storageKey, props.persistedStateSyncVersion]
    );
    const [readyKey, setReadyKey] = useState<string | null>(null);

    useLayoutEffect(() => {
        setReadyKey(remountKey);
    }, [remountKey]);

    if (readyKey !== remountKey) return null;

    return <AirTable key={remountKey} {...props} />;
};

const AirTable2 = Object.assign(AirTable2Inner, {
    Container: AirTable.Container,
    Header: AirTable.Header,
    Body: Body2,
    Ghost: AirTable.Ghost,
    RowToggle: AirTable.RowToggle,
    ColumnSelectBoxPortal: AirTable.ColumnSelectBoxPortal,
    CellContextMenuPortal: AirTable.CellContextMenuPortal,
}) as typeof AirTable;

export default AirTable2;
