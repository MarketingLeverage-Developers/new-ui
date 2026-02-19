// src/shared/utils/error/errorHandler.ts
// 기능: AxiosError, BusinessError, unknown 에서 메시지 추출

import axios from 'axios';
import { MESSAGES } from '../../constants';
import { BusinessError, type ApiEnvelope } from '../../infras/axios';

const isBusinessError = (err: unknown): err is BusinessError<unknown> => {
    if (!err || typeof err !== 'object') return false;
    const anyErr = err as { name?: string };
    return err instanceof BusinessError || anyErr.name === 'BusinessError';
};

export const extractApiErrorMessage = (error: unknown, defaultMessage?: string): string => {
    // BusinessError (HTTP 200 + success=false)
    if (isBusinessError(error)) {
        // 디버그 로그가 필요하면 아래 주석 해제
        console.log('[errorHandler] BusinessError caught:', error);
        const be = error as BusinessError<ApiEnvelope<unknown>>;
        const payload = be.payload as ApiEnvelope<unknown> | undefined;

        const msgFromBody = (payload as unknown as { body?: unknown })?.body;
        if (typeof msgFromBody === 'string' && msgFromBody.trim()) return msgFromBody;

        const msgFromResult = payload?.result?.message;
        if (typeof msgFromResult === 'string' && msgFromResult.trim()) return msgFromResult;

        const msgFromTop = (payload as unknown as { message?: string })?.message;
        if (typeof msgFromTop === 'string' && msgFromTop.trim()) return msgFromTop;

        if (typeof be.message === 'string' && be.message.trim()) return be.message;

        return defaultMessage ?? MESSAGES.UNKNOWN_ERROR;
    }

    // AxiosError (HTTP !2xx, 네트워크 등)
    if (axios.isAxiosError(error)) {
        // console.log('[errorHandler] AxiosError caught:', error);
        const data = error.response?.data as ApiEnvelope<unknown> | undefined;

        const msgFromBody = (data as unknown as { body?: unknown })?.body;
        if (typeof msgFromBody === 'string' && msgFromBody.trim()) return msgFromBody;

        const msgFromResult = data?.result?.message;
        if (typeof msgFromResult === 'string' && msgFromResult.trim()) return msgFromResult;

        const msgFromTop = (data as unknown as { message?: string })?.message;
        if (typeof msgFromTop === 'string' && msgFromTop.trim()) return msgFromTop;

        if (typeof error.message === 'string' && error.message.trim()) return error.message;

        return defaultMessage ?? MESSAGES.UNKNOWN_ERROR;
    }

    // Unknown
    // console.log('[errorHandler] Unknown error caught:', error);
    return defaultMessage ?? MESSAGES.UNKNOWN_ERROR;
};
