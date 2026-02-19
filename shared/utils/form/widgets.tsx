// widgets.tsx
// 역할: action → 실제 입력 컴포넌트 렌더러 맵 (INPUT / POPUP / IMAGE / IMAGE_LIST / TEXTAREA / EDITOR / SELECT / CAR_*_EDITOR)
// - SELECT: RoundedSelect 사용 + optionsKey(=type) + homepageUuid로 options 로딩(프로젝트 커스텀 훅 useContentListFetchQuery)
// - CAR_IMAGES_EDITOR: 내/외장 이미지 + 색상 정보 편집(복합 UI)
// - CAR_TRIMS_EDITOR: 트림/서브트림 편집(복합 UI)
// ✅ fetch/useQuery 직접 호출 금지 → 프로젝트의 커스텀 query 훅(useContentListFetchQuery) 사용

import React from 'react';

import Form from '../../../Form/Form';
import RoundedInput from '../../../RoundedInput/RoundedInput';
import BaseImageUploader from '../../../BaseImageUploader/BaseImageUploader';
import RoundedSelect from '../../../RoundedSelect/RoundedSelect';
import TextArea from '../../../TextArea/TextArea';
import RichTextEditor from '../../../RichTextEditor/RichTextEditor';
import type { ImageItem } from '../../headless/ImageUploader/ImageUploader';

import { requestImageUpload } from '@/services/image-upload/imageUploadService';
import { toImageItems, toImageUploadItems } from '@/utils/image-upload/ImageUploadUtils';
import type { ImageUploadItem, ImageUploadRes } from '@/types/image-upload/imageUploadTypes';

import type { ServerFormDef, ActionType, ZodFormApi } from './types';
import useContentListFetchQuery from '@/hooks/common/useContentListFetchQuery';

type InputStatus = 'default' | 'success' | 'error';

export type FormExternalContext = {
    homepageUuid: string;
};

// 값이 비어있는지 체크
const isFilled = (v: unknown): boolean =>
    v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : String(v).length > 0);

// INPUT/POPUP/TEXTAREA/EDITOR → string
const toInputValue = (raw: unknown): string => {
    if (raw == null) return '';
    if (typeof raw === 'string') return raw;
    if (typeof raw === 'number') return String(raw);
    return String(raw);
};

// map 시그니처 적합화 (이미지 전용)
export const toUiUnknown = (v: unknown): ImageItem[] => toImageItems(v as ImageUploadItem[] | null | undefined);
export const toFieldUnknown = (v: unknown): ImageUploadItem[] => toImageUploadItems(v as ImageItem[]);

// =========================
// SELECT 옵션 타입
// =========================
type SelectOption = {
    value: string;
    label: string;
};

type ContentsApiItem = {
    contentUuid: string;
    title: string;
};

// =========================
// ✅ SELECT 전용 컴포넌트 (RoundedSelect)
// =========================
type ServerFormDefWithOptionsKey = ServerFormDef & {
    optionsKey?: string;
};

type SelectFieldProps<T extends Record<string, unknown>> = {
    def: ServerFormDefWithOptionsKey;
    form: ZodFormApi<T>;
    external?: FormExternalContext;
};

const SelectField = <T extends Record<string, unknown>>({ def, form, external }: SelectFieldProps<T>) => {
    const name = def.key as Extract<keyof T, string>;
    const reg = form.register(name);
    const raw = form.getValue(name);
    const valueForSelect = toInputValue(raw);

    // ✅ 여기 homepageUuid/optionsType는 "정상 형태"이지만
    // ✅ (중요) 아래 useContentListFetchQuery 호출은 “잘 되는 상태”라고 한 테스트 형태를 유지 (건드리지 않음)
    const homepageUuid = external?.homepageUuid ?? '';
    const optionsType = def.optionsKey ?? '';

    // ✅ (중요) 지금 너가 “잘 되는 상태”라고 말한 테스트 훅 호출 형태 유지 (건드리지 않음)
    const { res: optionsRes } = useContentListFetchQuery({
        homepageUuid: '089f4859-ca63-11f0-a75d-0242ac140002',
        type: 'REVIEW',
        page: 1,
        size: 200,
        status: 'ACTIVE',
    });

    const options: SelectOption[] = React.useMemo(() => {
        const list = (optionsRes?.body ?? []) as ContentsApiItem[];
        return list.map((item) => ({ value: item.contentUuid, label: item.title }));
    }, [optionsRes]);

    const labelMap = React.useMemo(() => new Map(options.map((it) => [it.value, it.label] as const)), [options]);

    return (
        <Form.Label key={def.key} text={def.label}>
            <RoundedSelect defaultValue={valueForSelect ?? ''} onChange={reg.onChange}>
                <RoundedSelect.Display
                    render={() => labelMap.get(valueForSelect) ?? def.placeholder ?? `${def.label}을 선택해주세요.`}
                />
                <RoundedSelect.Content matchTriggerWidth>
                    {options.map((opt, index) => (
                        <RoundedSelect.Item key={`${opt.value}-${index}`} value={opt.value}>
                            {opt.label}
                        </RoundedSelect.Item>
                    ))}
                </RoundedSelect.Content>
            </RoundedSelect>
        </Form.Label>
    );
};

// =========================
// ✅ CAR_IMAGES_EDITOR 타입/유틸
// - (너가 올린 서버 구조에 맞춤) images.exteriors / images.interiors
// =========================
type CarImageColor = {
    uuid: string;
    colorType: 'ex' | 'in';
    name: string;
    path: string;
};

type CarImageItem = {
    uuid: string;
    category: 'ex' | 'in';
    path: string;
    color: CarImageColor;
};

type CarImagesValue = {
    exteriors: CarImageItem[];
    interiors: CarImageItem[];
};

const ensureCarImagesValue = (raw: unknown): CarImagesValue => {
    if (!raw || typeof raw !== 'object') {
        return { exteriors: [], interiors: [] };
    }

    const obj = raw as Partial<CarImagesValue>;

    return {
        exteriors: Array.isArray(obj.exteriors) ? (obj.exteriors as CarImageItem[]) : [],
        interiors: Array.isArray(obj.interiors) ? (obj.interiors as CarImageItem[]) : [],
    };
};

const toUploaderItemsFromCarImageItems = (items: CarImageItem[]): ImageItem[] =>
    (items ?? [])
        .filter((it) => Boolean(it?.path))
        .map((it, idx) => ({
            id: it.uuid || `${it.path}__${idx}`,
            url: it.path,
            name: it.color?.name ?? '',
            owned: false,
        }));

const buildCarImageItemsFromUploader = (params: {
    items: ImageItem[];
    category: 'ex' | 'in';
    prev: CarImageItem[];
}): CarImageItem[] => {
    const { items, category, prev } = params;

    const prevByUuid = new Map((prev ?? []).map((p) => [p.uuid, p]));

    return (items ?? []).map((it, idx) => {
        const uuid = it.id || `${it.url}__${idx}`;
        const prevItem = prevByUuid.get(uuid);

        return {
            uuid,
            category,
            path: it.url,
            color: {
                uuid: prevItem?.color?.uuid ?? `${uuid}__color`,
                colorType: category,
                name: prevItem?.color?.name ?? it.name ?? '',
                path: prevItem?.color?.path ?? '',
            },
        };
    });
};

// =========================
// ✅ CAR_IMAGES_EDITOR 컴포넌트
// - BaseImageUploader로 사진 올리고
// - 각 사진마다 "색상명/색상칩(이미지 URL)"를 input으로 편집
// =========================
type CarImagesEditorProps<T extends Record<string, unknown>> = {
    def: ServerFormDef;
    form: ZodFormApi<T>;
};

const CarImagesEditor = <T extends Record<string, unknown>>({ def, form }: CarImagesEditorProps<T>) => {
    const name = def.key as Extract<keyof T, string>;
    const reg = form.register(name);

    const raw = form.getValue(name);
    const value = ensureCarImagesValue(raw);

    const helper = form.getFieldError(name);

    const commit = (next: CarImagesValue) => {
        // ✅ ZodFormApi에 setValue가 없으니 register().onChange로 값 전달
        reg.onChange(next as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    const handleResolveFiles = async (files: File[]): Promise<ImageItem[]> => {
        const res = await requestImageUpload({
            files,
            meta: { category: 'string', referenceUUID: 'string' },
        });

        if (!res.ok) return [];

        const attachments = res.data?.body ?? [];
        return toImageItems(attachments);
    };

    const updateExteriorColor = (index: number, patch: Partial<CarImageColor>) => {
        const next: CarImagesValue = {
            ...value,
            exteriors: value.exteriors.map((it, i) => (i === index ? { ...it, color: { ...it.color, ...patch } } : it)),
        };
        commit(next);
    };

    const updateInteriorColor = (index: number, patch: Partial<CarImageColor>) => {
        const next: CarImagesValue = {
            ...value,
            interiors: value.interiors.map((it, i) => (i === index ? { ...it, color: { ...it.color, ...patch } } : it)),
        };
        commit(next);
    };

    return (
        <Form.Label key={def.key} text={def.label}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {/* 외장 */}
                <div style={{ padding: 12, border: '1px solid #e9ecef', borderRadius: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>외장 이미지</div>

                    <BaseImageUploader
                        multiple={true}
                        value={toUploaderItemsFromCarImageItems(value.exteriors)}
                        onChange={(nextItems) => {
                            const nextExteriors = buildCarImageItemsFromUploader({
                                items: nextItems,
                                category: 'ex',
                                prev: value.exteriors,
                            });
                            commit({ ...value, exteriors: nextExteriors });
                        }}
                        onResolveFiles={handleResolveFiles}
                    >
                        <BaseImageUploader.Dropzone />
                        <BaseImageUploader.FileList />
                        <BaseImageUploader.ImageList />
                    </BaseImageUploader>

                    {value.exteriors.length > 0 && (
                        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {value.exteriors.map((img, idx) => (
                                <div
                                    key={`${img.uuid}-${idx}`}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 10,
                                    }}
                                >
                                    <RoundedInput
                                        name={`${reg.name}.exteriors.${idx}.color.name`}
                                        value={img.color?.name ?? ''}
                                        onChange={(e) => updateExteriorColor(idx, { name: e.target.value })}
                                        placeholder="색상명 (예: 스노우 화이트)"
                                    />
                                    <RoundedInput
                                        name={`${reg.name}.exteriors.${idx}.color.path`}
                                        value={img.color?.path ?? ''}
                                        onChange={(e) => updateExteriorColor(idx, { path: e.target.value })}
                                        placeholder="색상칩 이미지 URL"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 내장 */}
                <div style={{ padding: 12, border: '1px solid #e9ecef', borderRadius: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>내장 이미지</div>

                    <BaseImageUploader
                        multiple={true}
                        value={toUploaderItemsFromCarImageItems(value.interiors)}
                        onChange={(nextItems) => {
                            const nextInteriors = buildCarImageItemsFromUploader({
                                items: nextItems,
                                category: 'in',
                                prev: value.interiors,
                            });
                            commit({ ...value, interiors: nextInteriors });
                        }}
                        onResolveFiles={handleResolveFiles}
                    >
                        <BaseImageUploader.Dropzone />
                        <BaseImageUploader.FileList />
                        <BaseImageUploader.ImageList />
                    </BaseImageUploader>

                    {value.interiors.length > 0 && (
                        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {value.interiors.map((img, idx) => (
                                <div
                                    key={`${img.uuid}-${idx}`}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: 10,
                                    }}
                                >
                                    <RoundedInput
                                        name={`${reg.name}.interiors.${idx}.color.name`}
                                        value={img.color?.name ?? ''}
                                        onChange={(e) => updateInteriorColor(idx, { name: e.target.value })}
                                        placeholder="색상명 (예: 블랙)"
                                    />
                                    <RoundedInput
                                        name={`${reg.name}.interiors.${idx}.color.path`}
                                        value={img.color?.path ?? ''}
                                        onChange={(e) => updateInteriorColor(idx, { path: e.target.value })}
                                        placeholder="색상칩 이미지 URL"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {helper && <p style={{ marginTop: 4, fontSize: 12, color: '#e03131' }}>{helper}</p>}
            </div>
        </Form.Label>
    );
};

// =========================
// ✅ CAR_TRIMS_EDITOR 타입/유틸
// =========================
type CarSubTrim = {
    subTrimId: string;
    subTrim: string;
    price: number;
};

type CarTrim = {
    mainTrimId: string;
    trim: string;
    subTrims: CarSubTrim[];
};

const ensureTrimsValue = (raw: unknown): CarTrim[] => {
    if (!Array.isArray(raw)) return [];
    return raw as CarTrim[];
};

const genId = () => `id-${Math.random().toString(36).slice(2, 10)}`;

// =========================
// ✅ CAR_TRIMS_EDITOR 컴포넌트
// - 트림 추가/삭제
// - 서브트림 추가/삭제
// =========================
type CarTrimsEditorProps<T extends Record<string, unknown>> = {
    def: ServerFormDef;
    form: ZodFormApi<T>;
};

const CarTrimsEditor = <T extends Record<string, unknown>>({ def, form }: CarTrimsEditorProps<T>) => {
    const name = def.key as Extract<keyof T, string>;
    const reg = form.register(name);

    const raw = form.getValue(name);
    const trims = ensureTrimsValue(raw);

    const helper = form.getFieldError(name);

    const commit = (next: CarTrim[]) => {
        reg.onChange(next as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    const addTrim = () => {
        const next: CarTrim[] = [
            ...trims,
            {
                mainTrimId: genId(),
                trim: '',
                subTrims: [{ subTrimId: genId(), subTrim: '', price: 0 }],
            },
        ];
        commit(next);
    };

    const removeTrim = (mainTrimId: string) => {
        commit(trims.filter((t) => t.mainTrimId !== mainTrimId));
    };

    const updateTrimName = (mainTrimId: string, nextName: string) => {
        commit(trims.map((t) => (t.mainTrimId === mainTrimId ? { ...t, trim: nextName } : t)));
    };

    const addSubTrim = (mainTrimId: string) => {
        commit(
            trims.map((t) =>
                t.mainTrimId === mainTrimId
                    ? {
                          ...t,
                          subTrims: [...t.subTrims, { subTrimId: genId(), subTrim: '', price: 0 }],
                      }
                    : t
            )
        );
    };

    const removeSubTrim = (mainTrimId: string, subTrimId: string) => {
        commit(
            trims.map((t) =>
                t.mainTrimId === mainTrimId
                    ? { ...t, subTrims: t.subTrims.filter((s) => s.subTrimId !== subTrimId) }
                    : t
            )
        );
    };

    const updateSubTrim = (mainTrimId: string, subTrimId: string, patch: Partial<CarSubTrim>) => {
        commit(
            trims.map((t) => {
                if (t.mainTrimId !== mainTrimId) return t;
                return {
                    ...t,
                    subTrims: t.subTrims.map((s) => (s.subTrimId === subTrimId ? { ...s, ...patch } : s)),
                };
            })
        );
    };

    return (
        <Form.Label key={def.key} text={def.label}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button
                    type="button"
                    onClick={addTrim}
                    style={{
                        height: 38,
                        borderRadius: 8,
                        border: '1px solid #ced4da',
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: 13,
                    }}
                >
                    + 트림 추가
                </button>

                {trims.map((t) => (
                    <div
                        key={t.mainTrimId}
                        style={{
                            border: '1px solid #e9ecef',
                            borderRadius: 10,
                            padding: 12,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                        }}
                    >
                        <div style={{ display: 'flex', gap: 10 }}>
                            <div style={{ flex: 1 }}>
                                <RoundedInput
                                    name={`${reg.name}.${t.mainTrimId}.trim`}
                                    value={t.trim}
                                    onChange={(e) => updateTrimName(t.mainTrimId, e.target.value)}
                                    placeholder="트림명 (예: 시그니처)"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => removeTrim(t.mainTrimId)}
                                style={{
                                    height: 44,
                                    padding: '0 12px',
                                    borderRadius: 8,
                                    border: '1px solid #e03131',
                                    background: '#fff',
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    color: '#e03131',
                                }}
                            >
                                삭제
                            </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>서브트림</div>
                            <button
                                type="button"
                                onClick={() => addSubTrim(t.mainTrimId)}
                                style={{
                                    height: 32,
                                    padding: '0 10px',
                                    borderRadius: 8,
                                    border: '1px solid #ced4da',
                                    background: '#fff',
                                    cursor: 'pointer',
                                    fontSize: 12,
                                }}
                            >
                                + 추가
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {t.subTrims.map((s) => (
                                <div
                                    key={s.subTrimId}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 160px 60px',
                                        gap: 10,
                                        alignItems: 'center',
                                    }}
                                >
                                    <RoundedInput
                                        name={`${reg.name}.${t.mainTrimId}.${s.subTrimId}.subTrim`}
                                        value={s.subTrim}
                                        onChange={(e) =>
                                            updateSubTrim(t.mainTrimId, s.subTrimId, { subTrim: e.target.value })
                                        }
                                        placeholder="서브트림명 (예: 기본)"
                                    />

                                    <RoundedInput
                                        name={`${reg.name}.${t.mainTrimId}.${s.subTrimId}.price`}
                                        value={String(s.price ?? 0)}
                                        onChange={(e) => {
                                            const n = Number(e.target.value);
                                            updateSubTrim(t.mainTrimId, s.subTrimId, {
                                                price: Number.isNaN(n) ? 0 : n,
                                            });
                                        }}
                                        placeholder="가격"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeSubTrim(t.mainTrimId, s.subTrimId)}
                                        style={{
                                            height: 44,
                                            borderRadius: 8,
                                            border: '1px solid #ced4da',
                                            background: '#fff',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {helper && <p style={{ marginTop: 4, fontSize: 12, color: '#e03131' }}>{helper}</p>}
            </div>
        </Form.Label>
    );
};

// =========================
// ✅ FORM_WIDGETS
// =========================
export const FORM_WIDGETS = <T extends Record<string, unknown>>(
    form: ZodFormApi<T>,
    external?: FormExternalContext
) => {
    const renderTextLike = (def: ServerFormDef) => {
        const name = def.key as Extract<keyof T, string>;
        const reg = form.register(name);
        const raw = form.getValue(name);
        const valueForInput = toInputValue(raw);

        const status: InputStatus = !isFilled(raw) ? 'default' : form.isFieldValid(name) ? 'success' : 'error';
        const helper = form.getFieldError(name);

        return (
            <Form.Label key={def.key} text={def.label}>
                <RoundedInput
                    name={reg.name}
                    value={valueForInput}
                    onChange={reg.onChange}
                    placeholder={def.placeholder ?? `${def.label}을 입력해주세요.`}
                    status={status}
                    helperText={helper}
                />
            </Form.Label>
        );
    };

    const renderTextareaLike = (def: ServerFormDef) => {
        const name = def.key as Extract<keyof T, string>;
        const reg = form.register(name);
        const raw = form.getValue(name);
        const valueForInput = toInputValue(raw);

        const helper = form.getFieldError(name);

        return (
            <Form.Label key={def.key} text={def.label}>
                <TextArea
                    name={reg.name}
                    value={valueForInput}
                    onChange={reg.onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
                    placeholder={def.placeholder ?? `${def.label}을 입력해주세요.`}
                    rows={4}
                    style={{ width: '100%', resize: 'vertical', height: '100%' }}
                />
                {helper && <p style={{ marginTop: 4, fontSize: 12, color: '#e03131' }}>{helper}</p>}
            </Form.Label>
        );
    };

    const WIDGETS: Record<ActionType, (def: ServerFormDef) => React.ReactElement> = {
        // ✅ (중요) 지금 너가 “잘 되는 상태”라고 말한 구조 유지 (건드리지 않음)
        INPUT: (def) => renderTextLike(def),
        POPUP: (def) => renderTextLike(def),
        TEXTAREA: (def) => renderTextareaLike(def),

        SELECT: (def) => <SelectField<T> def={def as ServerFormDefWithOptionsKey} form={form} external={external} />,

        CAR_IMAGES_EDITOR: (def) => <CarImagesEditor<T> def={def} form={form} />,
        CAR_TRIMS_EDITOR: (def) => <CarTrimsEditor<T> def={def} form={form} />,

        IMAGE: (def) => {
            const name = def.key as Extract<keyof T, string>;

            const reg = form.register(name, {
                map: { toUi: toUiUnknown, toField: toFieldUnknown },
            });

            const valueForUploader = (reg.value ?? []) as ImageItem[];

            return (
                <Form.Label key={def.key} text={def.label}>
                    <BaseImageUploader
                        multiple={false}
                        value={valueForUploader}
                        onChange={reg.onChange as (next: ImageItem[]) => void}
                        onResolveFiles={async (files): Promise<ImageItem[]> => {
                            const res = await requestImageUpload({
                                files,
                                meta: { category: 'string', referenceUUID: 'string' },
                            });
                            if (!res.ok) return [];
                            return toImageItems(res.data?.body ?? []);
                        }}
                    >
                        <BaseImageUploader.Dropzone />
                        <BaseImageUploader.FileList />
                        <BaseImageUploader.ImageList />
                    </BaseImageUploader>
                </Form.Label>
            );
        },

        IMAGE_LIST: (def) => {
            const name = def.key as Extract<keyof T, string>;

            const reg = form.register(name, {
                map: { toUi: toUiUnknown, toField: toFieldUnknown },
            });

            const valueForUploader = (reg.value ?? []) as ImageItem[];

            return (
                <Form.Label key={def.key} text={def.label}>
                    <BaseImageUploader
                        multiple={true}
                        value={valueForUploader}
                        onChange={reg.onChange as (next: ImageItem[]) => void}
                        onResolveFiles={async (files): Promise<ImageItem[]> => {
                            const res = await requestImageUpload({
                                files,
                                meta: { category: 'string', referenceUUID: 'string' },
                            });
                            if (!res.ok) return [];
                            return toImageItems(res.data?.body ?? []);
                        }}
                    >
                        <BaseImageUploader.Dropzone />
                        <BaseImageUploader.FileList />
                        <BaseImageUploader.ImageList />
                    </BaseImageUploader>
                </Form.Label>
            );
        },

        EDITOR: (def) => {
            const name = def.key as Extract<keyof T, string>;
            const reg = form.register(name, {
                map: {
                    toUi: (raw: unknown): string => toInputValue(raw),
                    toField: (uiValue: unknown): unknown => uiValue,
                },
            });

            const valueForEditor = (reg.value ?? '') as string;

            const handleUploadImages = async (files: File[]): Promise<{ src: string; alt?: string }[]> => {
                const res = await requestImageUpload({
                    files,
                    meta: { category: 'string', referenceUUID: 'string' },
                });

                if (!res.ok) return [];
                if (!res.data) return [];

                const data: ImageUploadRes = res.data;
                return data.body.map((item) => ({ src: item.filePath, alt: item.originalFileName }));
            };

            return (
                <Form.Label key={def.key} text={def.label}>
                    <RichTextEditor
                        value={valueForEditor}
                        onChange={reg.onChange as (next: string) => void}
                        placeholder={def.placeholder ?? `${def.label}을 입력해주세요.`}
                        onUploadImages={handleUploadImages}
                    />
                </Form.Label>
            );
        },
    };

    return WIDGETS;
};
