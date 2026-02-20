// hooks/useZodForm.ts
// 목적: Zod 스키마 기반 폼 훅 (검증/에러/제출 + 필드 단위 헬퍼)
// 변경점: ChangeEvent를 모든 JSX 엘리먼트(Element)로 확장, 값/이벤트 겸용 onChange 지원, 안전한 value 추출

import { useCallback, useMemo } from 'react';
import type { z, ZodTypeAny } from 'zod';

type UiPrimitive = string | number | boolean | unknown[];
type InferUiValue<TField> = Extract<TField, string> extends never
    ? Extract<TField, number> extends never
        ? Extract<TField, boolean> extends never
            ? Extract<TField, unknown[]> extends never
                ? string
                : Extract<TField, unknown[]>
            : boolean
        : number
    : string;

type MapOption<TField, TUi extends UiPrimitive> = {
    toUi?: (field: TField) => TUi;
    toField?: (ui: TUi) => TField;
};

type UseZodFormOptions<T extends Record<string, unknown>> = {
    schema: z.ZodObject<any>;
    value: T;
    onChange: (next: T) => void;
};

/** 모든 JSX 엘리먼트의 change 이벤트를 지원하도록 Element로 확장 */
type ChangeArg = UiPrimitive | React.ChangeEvent<Element>;

export type FieldRegisterProps<TField = unknown, TUi extends UiPrimitive = InferUiValue<TField>> = {
    name: string;
    value: TUi;
    /** 값 또는 이벤트 모두 허용 */
    onChange: (arg: TUi | React.ChangeEvent<Element>) => void;
};

export type UseZodFormReturn<T extends Record<string, unknown>> = {
    register: {
        <K extends keyof T & string>(
            name: K,
            opts?: {
                schemaOverride?: ZodTypeAny;
                map?: undefined;
            }
        ): FieldRegisterProps<T[K], InferUiValue<T[K]>>;
        <K extends keyof T & string, TUi extends UiPrimitive>(
            name: K,
            opts: {
                schemaOverride?: ZodTypeAny;
                map: MapOption<T[K], TUi>;
            }
        ): FieldRegisterProps<T[K], TUi>;
    };
    isValid: boolean;
    errors: Partial<Record<keyof T & string, string>>;
    getValue: <K extends keyof T & string>(name: K) => T[K];
    getFieldError: <K extends keyof T & string>(name: K) => string | undefined;
    isFieldValid: <K extends keyof T & string>(name: K) => boolean;
    handleSubmit: (
        onValid: (data: T) => void | Promise<void>,
        onInvalid?: (errors: Partial<Record<keyof T & string, string>>) => void
    ) => (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => void;
};

/** ChangeEvent 타입가드 (모든 JSX 엘리먼트 대상) */
const isChangeEvent = (arg: unknown): arg is React.ChangeEvent<Element> =>
    typeof arg === 'object' && arg !== null && 'target' in (arg as Record<string, unknown>);

/** 이벤트/값에서 UI용 값을 일관되게 추출 */
const getUiNextFromChange = (arg: ChangeArg): UiPrimitive => {
    if (!isChangeEvent(arg)) return arg; // 이미 값인 경우 그대로

    const target = arg.target as Element;

    // 체크박스: checked
    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
        return target.checked;
    }

    // 멀티 셀렉트: 선택된 option.value[]
    if (target instanceof HTMLSelectElement && target.multiple) {
        return Array.from(target.selectedOptions).map((o) => o.value);
    }

    // 일반적인 value 보유 엘리먼트
    const ct = arg.currentTarget;
    if (ct instanceof HTMLInputElement || ct instanceof HTMLTextAreaElement || ct instanceof HTMLSelectElement) {
        return ct.value;
    }

    // contentEditable 등: textContent를 기본값으로
    return target.textContent ?? '';
};

export const useZodForm = <T extends Record<string, unknown>>({
    schema,
    value,
    onChange,
}: UseZodFormOptions<T>): UseZodFormReturn<T> => {
    // 전체 폼 단위 검증
    const parseResult = useMemo(() => schema.safeParse(value), [schema, value]);
    const isValid = parseResult.success;

    // 에러 맵 (필드 첫 에러 메시지)
    const errors: Partial<Record<string, string>> = useMemo(() => {
        if (parseResult.success) return {};
        const out: Partial<Record<string, string>> = {};
        for (const issue of parseResult.error.issues) {
            const key = issue.path[0] as string;
            if (!out[key]) out[key] = issue.message;
        }
        return out;
    }, [parseResult]);

    const register = useCallback(
        <K extends keyof T & string, TUi extends UiPrimitive = InferUiValue<T[K]>>(
            name: K,
            opts?: {
                schemaOverride?: ZodTypeAny; // 필요 시 개별 필드 스키마 대체(선택)
                map?: MapOption<T[K], TUi>;
            }
        ): FieldRegisterProps<T[K], TUi> => {
            const fieldValue = value?.[name] as T[K];

            const uiValue: TUi = (opts?.map?.toUi ? opts.map.toUi(fieldValue) : (fieldValue as unknown as TUi)) as TUi;

            const handleChange = (arg: TUi | React.ChangeEvent<Element>) => {
                const uiNext = getUiNextFromChange(arg as ChangeArg); // 이벤트/값 모두 처리
                const nextField = (
                    opts?.map?.toField ? opts.map.toField(uiNext as TUi) : (uiNext as unknown as T[K])
                ) as T[K];

                const next = { ...value, [name]: nextField } as T;
                onChange(next);
            };

            return {
                name,
                value: uiValue,
                onChange: handleChange,
            };
        },
        [onChange, value]
    );

    const getValue = useCallback(<K extends keyof T & string>(name: K): T[K] => value[name] as T[K], [value]);

    const getFieldError = useCallback(
        <K extends keyof T & string>(name: K) => errors[name as string] as string | undefined,
        [errors]
    );

    const isFieldValid = useCallback(<K extends keyof T & string>(name: K) => !errors[name as string], [errors]);

    const handleSubmit =
        (onValid: (data: T) => void | Promise<void>, onInvalid?: (errors: Partial<Record<string, string>>) => void) =>
        (e: React.FormEvent<HTMLFormElement | HTMLButtonElement>) => {
            e.preventDefault();
            const res = schema.safeParse(value);
            if (!res.success) {
                onInvalid?.(errors as Partial<Record<keyof T & string, string>>);
                return;
            }
            void onValid(res.data as T);
        };

    return {
        register,
        isValid,
        errors: errors as Partial<Record<keyof T & string, string>>,
        getValue,
        getFieldError,
        isFieldValid,
        handleSubmit,
    };
};
