// 역할: TEXT/BUTTON 전용 UI 렌더러 (전역 핸들러만 호출)

import React from 'react';
import StripedTable from '../../../StripedTable/StripedTable';
import RoundedHoverButton from '../../../RoundedHoverButton/RoundedHoverButton';
import type { RowRecord, UIRenderer, UIType, ActionHandlers } from './types';

export const UI_RENDERERS = <T extends RowRecord>(handlers: ActionHandlers<T> = {}): Record<UIType, UIRenderer<T>> => ({
    INPUT: ({ value }) => (
        <StripedTable.Content>{value == null || value === '' ? '-' : String(value)}</StripedTable.Content>
    ),

    POPUP: ({ row, value, label, columnKey }) => {
        const handler = handlers['OPEN_DETAIL'];
        return (
            <StripedTable.Content>
                <RoundedHoverButton
                    width={60}
                    padding={{ x: 10, y: 6 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (handler) {
                            handler({ row, value, columnKey, label });
                        }
                    }}
                >
                    {label}
                </RoundedHoverButton>
            </StripedTable.Content>
        );
    },
});
