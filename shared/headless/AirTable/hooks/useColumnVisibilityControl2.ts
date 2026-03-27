import { useCallback } from 'react';
import { useAirTableContext } from '../AirTable2';

export const useColumnVisibilityControl2 = <T,>() => {
    const { state } = useAirTableContext<T>();
    const { allLeafColumns, allLeafKeys, visibleColumnKeys, setVisibleColumnKeys } = state;

    const allOn = useCallback(() => {
        setVisibleColumnKeys(allLeafKeys);
    }, [setVisibleColumnKeys, allLeafKeys]);

    const allOff = useCallback(() => {
        if (allLeafKeys.length === 0) return;
        setVisibleColumnKeys([allLeafKeys[0]]);
    }, [setVisibleColumnKeys, allLeafKeys]);

    return {
        allLeafColumns,
        allLeafKeys,
        visibleColumnKeys,
        setVisibleColumnKeys,
        allOn,
        allOff,
    };
};
