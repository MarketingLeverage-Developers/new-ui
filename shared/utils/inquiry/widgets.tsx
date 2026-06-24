// 역할: TEXT/BUTTON 전용 UI 렌더러 (전역 핸들러만 호출)

import React from 'react';
import StripedTable from '../../../StripedTable/StripedTable';
import RoundedHoverButton from '../../../RoundedHoverButton/RoundedHoverButton';
import type { RowRecord, UIRenderer, UIType, ActionHandlers } from './types';

const toPopupDisplayText = (value: unknown, fallback: string) => {
    if (value == null || value === '') return fallback;
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);

    try {
        return JSON.stringify(value);
    } catch {
        return fallback;
    }
};

export const UI_RENDERERS = <T extends RowRecord>(handlers: ActionHandlers<T> = {}): Record<UIType, UIRenderer<T>> => ({
    INPUT: ({ value }) => (
        <StripedTable.Content>{value == null || value === '' ? '-' : String(value)}</StripedTable.Content>
    ),

    POPUP: ({ row, value, label, columnKey }) => {
        const handler = handlers['OPEN_DETAIL'];
        const displayText = toPopupDisplayText(value, label);

        return (
            <StripedTable.Content title={displayText}>
                <RoundedHoverButton
                    width="100%"
                    padding={{ x: 10, y: 6 }}
                    style={{ justifyContent: 'flex-start' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (handler) {
                            handler({ row, value, columnKey, label });
                        }
                    }}
                >
                    {displayText}
                </RoundedHoverButton>
            </StripedTable.Content>
        );
    },
});
