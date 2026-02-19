// src/shared/utils/form/transform.ts
// 역할:
// - dot-path 기반 템플릿을 위해
//   1) 서버 body(중첩 객체) -> 폼 value(flat) 로 변환
//   2) 폼 value(flat) -> 서버 body(중첩 객체) 로 변환

import type { ServerFormDef } from './types';

type AnyRecord = Record<string, unknown>;

const isObject = (v: unknown): v is AnyRecord => typeof v === 'object' && v !== null && !Array.isArray(v);

// a.b.c 형태 path로 값 꺼내기
export const getByPath = (obj: unknown, path: string): unknown => {
    if (!isObject(obj)) return undefined;
    if (!path) return undefined;

    const keys = path.split('.').filter(Boolean);
    let cur: unknown = obj;

    for (const key of keys) {
        if (!isObject(cur)) return undefined;
        cur = cur[key];
    }

    return cur;
};

// a.b.c 형태 path로 값 세팅하기 (없으면 중간 객체 생성)
export const setByPath = (obj: AnyRecord, path: string, value: unknown): AnyRecord => {
    if (!path) return obj;

    const keys = path.split('.').filter(Boolean);
    let cur: AnyRecord = obj;

    for (let i = 0; i < keys.length; i += 1) {
        const k = keys[i];
        const isLast = i === keys.length - 1;

        if (isLast) {
            cur[k] = value;
            return obj;
        }

        const next = cur[k];
        if (!isObject(next)) {
            cur[k] = {};
        }

        cur = cur[k] as AnyRecord;
    }

    return obj;
};

// ✅ 서버 body(중첩) -> 폼 value(flat)
// - 스키마의 def.key를 기준으로만 추출한다(불필요한 키는 포함 안 함)
// - def.key에 '.'이 있으면 getByPath로 꺼내서 flat key에 넣는다
// - def.key에 '.'이 없으면 body[def.key] 그대로 넣는다 (복합 위젯: images/trims 같은 덩어리)
export const buildFormValueFromBody = (
    schema: ReadonlyArray<ServerFormDef>,
    body: unknown
): Record<string, unknown> => {
    const next: Record<string, unknown> = {};

    schema.forEach((def) => {
        const key = def.key;

        if (!key) return;

        if (key.includes('.')) {
            next[key] = getByPath(body, key);
            return;
        }

        if (isObject(body)) {
            next[key] = body[key];
            return;
        }

        next[key] = undefined;
    });

    return next;
};

// ✅ 폼 value(flat) -> 서버 body(중첩)
// - 스키마 def.key 기준으로만 서버 body 구성
// - dot-path면 setByPath로 중첩 생성
// - dot이 아니면 그대로 할당 (복합 위젯 덩어리)
export const buildBodyFromFormValue = (
    schema: ReadonlyArray<ServerFormDef>,
    formValue: Record<string, unknown>
): Record<string, unknown> => {
    const body: Record<string, unknown> = {};

    schema.forEach((def) => {
        const key = def.key;
        if (!key) return;

        const v = formValue[key];

        if (key.includes('.')) {
            setByPath(body, key, v);
            return;
        }

        body[key] = v;
    });

    return body;
};
