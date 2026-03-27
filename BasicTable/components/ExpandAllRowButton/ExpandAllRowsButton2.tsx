import React, { useCallback } from 'react';
import { HiOutlineSortAscending, HiOutlineSortDescending } from 'react-icons/hi';
import BaseButton from '../../../BaseButton/BaseButton';
import { getThemeColor } from '../../../shared/utils/css/getThemeColor';
import { useAirTableContext } from '../../../shared/headless/AirTable/AirTable2';

export const ExpandAllRowsButton2 = () => {
    const { expandAllRows, collapseAllRows, isAllExpanded } = useAirTableContext<unknown>();
    const allExpanded = isAllExpanded();

    const handleClick = useCallback(() => {
        if (allExpanded) {
            collapseAllRows();
            return;
        }

        expandAllRows();
    }, [allExpanded, collapseAllRows, expandAllRows]);

    return (
        <BaseButton
            type="button"
            radius={8}
            height={40}
            bgColor={getThemeColor('White1')}
            textColor={getThemeColor('Gray1')}
            padding={{ y: 9.5, x: 11 }}
            style={{ border: `1px solid ${getThemeColor('Gray5')}` }}
            onClick={handleClick}
            title={allExpanded ? '전체 닫기' : '전체 열기'}
            aria-label={allExpanded ? '전체 닫기' : '전체 열기'}
        >
            {allExpanded ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />}
        </BaseButton>
    );
};

export default ExpandAllRowsButton2;
