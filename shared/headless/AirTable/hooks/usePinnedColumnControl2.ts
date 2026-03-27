import { useCallback } from 'react';
import { useAirTableContext } from '../AirTable2';

export const usePinnedColumnControl2 = <T,>() => {
    const { state } = useAirTableContext<T>();
    const { allLeafColumns, allLeafKeys, pinnedColumnKeys, setPinnedColumnKeys } = state;

    const allOn = useCallback(() => {
        setPinnedColumnKeys(allLeafKeys);
    }, [setPinnedColumnKeys, allLeafKeys]);

    const allOff = useCallback(() => {
        setPinnedColumnKeys([]);
    }, [setPinnedColumnKeys]);

    return {
        allLeafColumns,
        allLeafKeys,
        pinnedColumnKeys,
        setPinnedColumnKeys,
        allOn,
        allOff,
    };
};
