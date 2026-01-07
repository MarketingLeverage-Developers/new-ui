// src/shared/primitives/BasicTable/components/TableSettings/TableSettingRail.tsx

import React from 'react';
import { FaColumns, FaThumbtack, FaFilter } from 'react-icons/fa';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import { BaseTooltip } from '@/shared/primitives/BaseTooltip/BaseTooltip'; // ✅✅✅ BaseTooltip import

type TabKey = 'columns' | 'pinned' | 'filters';

type Props = {
    open: boolean;
    tab: TabKey;
    onSelectTab: (tab: TabKey) => void;
};

export const TableSettingRail = ({ open, tab, onSelectTab }: Props) => (
    <div
        style={{
            width: 42,
            height: '100%',
            borderLeft: '1px solid var(--Gray5)',
            background: 'var(--White1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 10,
            gap: 10,
            flexShrink: 0,
            overflow: 'hidden', // ✅ rail 자체는 스크롤 금지 (border 끊김 방지)
        }}
    >
        {/* ✅ 노출 컬럼 */}
        <BaseTooltip label="노출 컬럼 설정" side="left">
            <span style={{ display: 'inline-flex' }}>
                <BaseButton
                    type="button"
                    padding={{ x: 0, y: 0 }}
                    width={32}
                    height={32}
                    radius={8}
                    bgColor={tab === 'columns' && open ? getThemeColor('Gray6') : getThemeColor('White1')}
                    textColor={tab === 'columns' && open ? getThemeColor('Primary1') : getThemeColor('Gray2')}
                    onClick={() => onSelectTab('columns')}
                    aria-label="노출 컬럼 설정"
                >
                    <FaColumns />
                </BaseButton>
            </span>
        </BaseTooltip>

        {/* ✅ 고정 컬럼 */}
        <BaseTooltip label="고정 컬럼 설정" side="left">
            <span style={{ display: 'inline-flex' }}>
                <BaseButton
                    type="button"
                    padding={{ x: 0, y: 0 }}
                    width={32}
                    height={32}
                    radius={8}
                    bgColor={tab === 'pinned' && open ? getThemeColor('Gray6') : getThemeColor('White1')}
                    textColor={tab === 'pinned' && open ? getThemeColor('Primary1') : getThemeColor('Gray2')}
                    onClick={() => onSelectTab('pinned')}
                    aria-label="고정 컬럼 설정"
                >
                    <FaThumbtack />
                </BaseButton>
            </span>
        </BaseTooltip>

        {/* ✅ 필터 설정 */}
        <BaseTooltip label="필터 설정" side="left">
            <span style={{ display: 'inline-flex' }}>
                <BaseButton
                    type="button"
                    padding={{ x: 0, y: 0 }}
                    width={32}
                    height={32}
                    radius={8}
                    bgColor={tab === 'filters' && open ? getThemeColor('Gray6') : getThemeColor('White1')}
                    textColor={tab === 'filters' && open ? getThemeColor('Primary1') : getThemeColor('Gray2')}
                    onClick={() => onSelectTab('filters')}
                    aria-label="필터 설정"
                >
                    <FaFilter />
                </BaseButton>
            </span>
        </BaseTooltip>
    </div>
);
