// src/shared/result/index.ts

// 성공이면 data + success 메시지
// 실패이면 error 메시지
export type Result<T> = {
    result: any;
    ok: boolean;
    data?: T;
    message: string;
};

// Ok 헬퍼: 데이터와 메시지를 같이 반환
export const Ok = <T>(data: T, msg = '성공'): Result<T> => ({
    result: (data as any)?.result ?? null,
    ok: true,
    data,
    message: msg,
});

// Err 헬퍼: 실패 메시지 반환
export const Err = (msg: string): Result<never> => ({
    result: null,
    ok: false,
    message: msg,
});
