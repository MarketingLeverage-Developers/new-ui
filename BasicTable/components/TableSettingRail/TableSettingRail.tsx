// src/shared/primitives/BasicTable/components/TableSettings/TableSettingRail.tsx

import React from 'react';
import { FaColumns, FaThumbtack, FaFilter } from 'react-icons/fa'; // ✅✅✅ FaFilter 추가
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type TabKey = 'columns' | 'pinned' | 'filters'; // ✅✅✅ filters 탭 추가

type Props = {
    open: boolean; // ✅ 패널 열림 여부
    tab: TabKey; // ✅ 현재 선택 탭
    onSelectTab: (tab: TabKey) => void; // ✅ 탭 선택 시
};

export const TableSettingRail = ({ open, tab, onSelectTab }: Props) => (
    // ✅ TableSettingRail.tsx

    <div
        style={{
            width: 42,

            borderLeft: '1px solid var(--Gray5)', // ✅ 여기만 border 존재해야 한다
            background: 'var(--White1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 10,
            gap: 10,
            flexShrink: 0,
            overflow: 'auto',
        }}
    >
        {/* ✅ 노출 컬럼 */}
        <BaseButton
            type="button"
            padding={{ x: 0, y: 0 }} // ✅ 레일 버튼은 패딩 없음
            width={32}
            height={32}
            radius={8}
            bgColor={tab === 'columns' && open ? getThemeColor('Gray6') : getThemeColor('White1')}
            textColor={tab === 'columns' && open ? getThemeColor('Primary1') : getThemeColor('Gray2')}
            onClick={() => onSelectTab('columns')}
            title="노출 컬럼 설정"
            aria-label="노출 컬럼 설정"
        >
            <FaColumns />
        </BaseButton>

        {/* ✅ 고정 컬럼 */}
        <BaseButton
            type="button"
            padding={{ x: 0, y: 0 }}
            width={32}
            height={32}
            radius={8}
            bgColor={tab === 'pinned' && open ? getThemeColor('Gray6') : getThemeColor('White1')}
            textColor={tab === 'pinned' && open ? getThemeColor('Primary1') : getThemeColor('Gray2')}
            onClick={() => onSelectTab('pinned')}
            title="고정 컬럼 설정"
            aria-label="고정 컬럼 설정"
        >
            <FaThumbtack />
        </BaseButton>

        {/* ✅✅✅ 필터 설정 */}
        <BaseButton
            type="button"
            padding={{ x: 0, y: 0 }}
            width={32}
            height={32}
            radius={8}
            bgColor={tab === 'filters' && open ? getThemeColor('Gray6') : getThemeColor('White1')}
            textColor={tab === 'filters' && open ? getThemeColor('Primary1') : getThemeColor('Gray2')}
            onClick={() => onSelectTab('filters')}
            title="필터 설정"
            aria-label="필터 설정"
        >
            <FaFilter />
        </BaseButton>
    </div>
);
