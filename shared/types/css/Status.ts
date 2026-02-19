// enum 대신 union type + 상수 객체 권장
export type Status = 'default' | 'error' | 'success';

export const STATUS = {
    DEFAULT: 'default' as Status,
    ERROR: 'error' as Status,
    SUCCESS: 'success' as Status,
} as const;
