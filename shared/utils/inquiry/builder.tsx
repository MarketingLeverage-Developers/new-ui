// 역할: 서버 스키마 → Column[] 변환 (TEXT/BUTTON 전용)

import type { RowRecord, ServerColumnDef, ActionHandlers } from './types';
import { UI_RENDERERS } from './widgets';
import StripedTable from '../../../StripedTable/StripedTable';
import type { Column, SortValue } from '../../headless/AirTable/AirTable';

export const buildColumnsFromSchema = <T extends RowRecord>(opts: {
    schema: ReadonlyArray<ServerColumnDef>;
    handlers?: ActionHandlers<T>;
}): Column<T>[] => {
    const { schema, handlers } = opts;
    const renderers = UI_RENDERERS<T>(handlers);

    return schema.map((def): Column<T> => {
        const renderer = renderers[def.action] ?? renderers.INPUT;

        return {
            key: def.key,
            width: def.width ?? 160,
            label: def.label,
            // header 시그니처를 (key, data)로 맞춘다
            header: (_key: string, _data: T[]) => <StripedTable.Content>{def.label}</StripedTable.Content>,
            render: (row) =>
                renderer({
                    row,
                    value: (row as Record<string, unknown>)[def.key],
                    label: def.label,
                    handlerKey: def.handler,
                    columnKey: def.key,
                }),
            sortValue: (row) => (row as Record<string, unknown>)[def.key] as SortValue,
            // children 안 씀
        };
    });
};
