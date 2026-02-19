// 역할: "미리 정의된 전역 핸들러" (페이지 주입/오버라이드 없음)

import type { GenericHandler, HandlerCtx, HandlerKey, RowRecord } from './types';

export const HANDLER_REGISTRY: Record<HandlerKey, GenericHandler> = {
    // DELETE: 확인 후 실제 삭제 API 자리(주석)
    DELETE: <T extends RowRecord>(ctx: HandlerCtx<T>): void => {
        const ok = typeof window !== 'undefined' ? window.confirm('정말 삭제할까요?') : true;
        if (!ok) return;

        console.log('[DELETE]', ctx.row);
    },
};
