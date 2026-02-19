// types.ts (발췌)
// ❌ 여기서 Column/ColumnType 재선언하지 마세요.

export type UIType = 'INPUT' | 'POPUP';
export type HandlerKey = 'DELETE' | 'NONE';

export interface ServerColumnDef {
    key: string;
    label: string;
    action: UIType;
    handler: HandlerKey | null;
    width?: number | string;
    // 삭제를 위해 id 필요- 묻기
    // id: string;
    uuid: string;
}

export type RowRecord = Record<string, unknown> & { id?: string | number };

export type HandlerCtx<T extends RowRecord> = {
    row: T;
    value: unknown;
    columnKey: string;
    label: string;
};

export type GenericHandler = <T extends RowRecord>(ctx: HandlerCtx<T>) => void;

// Handler injection types
export type ActionHandler<T> = (args: { row: T; value: unknown; columnKey: string; label?: string }) => void;

export type ActionHandlers<T> = Record<string, ActionHandler<T>>;

// UI Renderer props interface
export interface UIRendererProps<T> {
    row: T;
    value: unknown;
    label: string;
    handlerKey: HandlerKey | null;
    columnKey: string;
    handlers?: ActionHandlers<T>;
}

export type UIRenderer<T> = (props: UIRendererProps<T>) => React.ReactElement;
