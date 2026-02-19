// 역할: 서버 스키마 정의 & 동적 폼 타입

import type React from 'react';

export type ActionType =
    | 'POPUP'
    | 'INPUT'
    | 'IMAGE'
    | 'IMAGE_LIST'
    | 'EDITOR'
    | 'TEXTAREA'
    | 'SELECT'
    | 'CAR_IMAGES_EDITOR'
    | 'CAR_TRIMS_EDITOR';
export type ValueType = 'STRING' | 'NUMBER' | 'DATE' | 'IMAGE_ARRAY';

export interface ServerFormDef {
    key: string; // 폼 필드명
    label: string; // 라벨
    action: ActionType; // POPUP | INPUT | IMAGE
    valueType: ValueType; // STRING | NUMBER | DATE | IMAGE_ARRAY
    width?: number | string;
    placeholder?: string;
    isRequired: boolean;
}

// ZodFormApi는 그대로 사용
export type ZodFormApi<T extends Record<string, unknown>> = {
    register: <K extends Extract<keyof T, string>>(
        key: K,
        opts?: {
            map?: {
                toUi?: (v: unknown) => unknown;
                toField?: (v: unknown) => unknown;
            };
        }
    ) => { name: K; value: T[K]; onChange: (next: unknown) => void };

    isFieldValid: (key: Extract<keyof T, string>) => boolean;
    getFieldError: (key: Extract<keyof T, string>) => string | undefined;
    getValue: <K extends Extract<keyof T, string>>(key: K) => T[K];
};

export type Field<T extends Record<string, unknown>> = {
    key: string;
    render: () => React.ReactElement;
    width?: number | string;
};
