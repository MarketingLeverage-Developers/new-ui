// 역할: 서버 스키마 → Field<T>[] 변환 (분리 스타일)

import React from 'react';
import z from 'zod';
import type { Field, ServerFormDef, ZodFormApi } from './types';
import { FORM_WIDGETS } from './widgets';

// ✅ SELECT 옵션 로딩에 필요한 외부 컨텍스트(쿼리파라미터 등)
export type FormExternalContext = {
    homepageUuid: string;
};

export const buildFieldsFromSchema = <T extends Record<string, unknown>>(opts: {
    schema: ReadonlyArray<ServerFormDef>;
    form: ZodFormApi<T>;
    external?: FormExternalContext;
}): Field<T>[] => {
    const { schema, form, external } = opts;

    // ✅ widgets에도 external을 전달해서 SELECT 같은 위젯이 비동기 옵션 로딩 가능
    const widgets = FORM_WIDGETS<T>(form, external);

    return schema.map(
        (def): Field<T> => ({
            key: def.key,
            width: def.width,
            render: () => {
                const renderer = widgets[def.action];

                if (!renderer) {
                    // ✅ builder.ts에서 JSX를 쓰면(.ts 파일) 파서/린터가 깨질 수 있어서 createElement 사용
                    return React.createElement('div', null, `지원하지 않는 action: ${def.action}`);
                }

                return renderer(def);
            },
        })
    );
};

// 서버 스키마 → Zod 스키마
// ✅ validator(VALIDATION_BY_KIND) 완전히 제거한 버전
export const buildZodFromServerSchema = (schema: ReadonlyArray<ServerFormDef>, requiredKeys?: ReadonlySet<string>) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    schema.forEach((def) => {
        const requiredByOverride = requiredKeys?.has(def.key) ?? false;
        const requiredByServer = (def as any).isRequired ?? false;
        const required = requiredByOverride || requiredByServer;

        let fieldSchema: z.ZodTypeAny = z.any();

        if (!required) {
            fieldSchema = fieldSchema.optional();
        }

        shape[def.key] = fieldSchema;
    });

    return z.object(shape);
};

// 서버 스키마 → 초기값
export const buildInitialValue = (
    schema: ReadonlyArray<ServerFormDef>,
    prev?: Record<string, unknown>
): Record<string, unknown> => {
    const next: Record<string, unknown> = { ...(prev ?? {}) };

    schema.forEach((def) => {
        if (next[def.key] !== undefined) return;

        if (def.valueType === 'STRING') {
            next[def.key] = '';
            return;
        }

        if (def.valueType === 'NUMBER') {
            next[def.key] = 0;
            return;
        }

        if (def.valueType === 'DATE') {
            next[def.key] = '';
            return;
        }

        if (def.valueType === 'IMAGE_ARRAY') {
            next[def.key] = [];
            return;
        }

        // ✅ SELECT/기타 기본값
        next[def.key] = '';
    });

    return next;
};
