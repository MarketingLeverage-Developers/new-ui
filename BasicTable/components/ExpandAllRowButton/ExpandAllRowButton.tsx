// src/shared/primitives/BasicTable/components/ExpandAllRowsButton/ExpandAllRowsButton.tsx

import React, { useCallback } from 'react';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import { useAirTableContext } from '@/shared/headless/AirTable/AirTable';
import { HiOutlineSortAscending } from 'react-icons/hi';
import { HiOutlineSortDescending } from 'react-icons/hi';

/** ✅ 기능: 테이블 전체 열기/닫기 버튼 */
export const ExpandAllRowsButton = () => {
    /** ✅ AirTable Context에서 전체 열기/닫기 API 가져오기 */
    const { expandAllRows, collapseAllRows, isAllExpanded } = useAirTableContext<unknown>();

    /** ✅ 현재 상태 계산 */
    const allExpanded = isAllExpanded();

    /** ✅ 클릭 시 토글 */
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
            padding={{ x: 12, y: 8 }}
            radius={10}
            bgColor={getThemeColor('Gray6')}
            textColor={getThemeColor('Gray1')}
            onClick={handleClick}
            title={allExpanded ? '전체 닫기' : '전체 열기'}
            aria-label={allExpanded ? '전체 닫기' : '전체 열기'}
        >
            {/* ✅✅✅ 텍스트 대신 아이콘 */}
            {allExpanded ? <HiOutlineSortAscending /> : <HiOutlineSortDescending />}
        </BaseButton>
    );
};

export default ExpandAllRowsButton;
