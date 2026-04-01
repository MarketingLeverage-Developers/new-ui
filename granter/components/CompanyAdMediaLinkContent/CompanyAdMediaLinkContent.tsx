import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { FiChevronDown } from 'react-icons/fi';
import AdMediaLinkUpdateModal from '@/components/feature/ad-media-link/AdMediaLinkUpdateModal';
import AdMediaLinkDeleteModal from '@/components/feature/ad-media-link/AdMediaLinkDeleteModal';
import AdMediaCampaignModal from '@/components/feature/campaign/AdMediaCampaignModal';
import { useAdMediaLinkCreateMutation } from '@/hooks/common/useAdMediaLinkCreateMutation';
import { adMediaLinkCreateSchema } from '@/validations/ad-media-link/adMediaLinkCreateValidation';
import type { AdMediaLinkCreateReq } from '@/types/ad-media-link/adMediaLinkCreateTypes';
import type { MediaListItem } from '@/types/ad-media-link/adMediaLinkMediaTypes';
import type {
    CompanyAdMediaLinkSettingActions,
    CompanyAdMediaLinkSettingState,
} from '@/hooks/feature/useCompanyAdMediaLinkSetting';
import RoundedTextInput from '../RoundedTextInput/RoundedTextInput';
import ButtonDropdown from '../ButtonDropdown/ButtonDropdown';
import { getMediaLogoSrc } from '../../assets';
import { MEDIA_FIELD_SPECS } from '../../constants/mediaFieldSpecs';
import { useToast } from '../../../shared/headless/ToastProvider/ToastProvider';
import { useZodForm } from '../../../shared/hooks/client/useZodForm';
import styles from './CompanyAdMediaLinkContent.module.scss';

export type CompanyAdMediaLinkContentProps = {
    state: CompanyAdMediaLinkSettingState;
    actions: CompanyAdMediaLinkSettingActions;
    className?: string;
};

type HomepageSelectProps = {
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (next: string) => void;
};

type InlineFieldKey =
    | 'customerId'
    | 'accountId'
    | 'accountPassword'
    | 'secretKey'
    | 'accessToken'
    | 'refreshToken'
    | 'monthBudget';

type InlineFieldSpec = {
    key: InlineFieldKey;
    label: string;
    placeholder?: string;
    inputType?: 'text' | 'password';
    required?: boolean;
};

const FIELD_SPEC_MAP = MEDIA_FIELD_SPECS as Record<string, InlineFieldSpec[]>;

const onlyDigits = (value: string) => value.replace(/[^\d]/g, '');

const formatCommaNumber = (digits: string) => {
    if (!digits) return '';
    const normalized = digits.replace(/^0+(?=\d)/, '');
    return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const HomepageSelect = ({ value, options, onChange }: HomepageSelectProps) => (
    <ButtonDropdown value={value} onChange={onChange} widthPreset="full">
        <ButtonDropdown.Trigger
            label={options.find((option) => option.value === value)?.label ?? '홈페이지 선택'}
            variant="outline"
            size="lg"
            dropdownIcon={<FiChevronDown size={14} />}
        />
        <ButtonDropdown.Content placement="bottom-start">
            {options.map((option) => (
                <ButtonDropdown.Item key={option.value} value={option.value}>
                    {option.label}
                </ButtonDropdown.Item>
            ))}
        </ButtonDropdown.Content>
    </ButtonDropdown>
);

const MediaWithIcon = ({ mediaName }: { mediaName: string }) => (
    <span className={styles.MediaName}>
        <img src={getMediaLogoSrc(mediaName)} alt={`${mediaName}-logo`} width={18} height={18} className={styles.MediaIcon} />
        <span>{mediaName}</span>
    </span>
);

type InlineCreateFormProps = {
    companyUuid: string;
    homepageUuid: string;
    mediaList: MediaListItem[];
    onCreated: () => Promise<void>;
    onRemove: () => void;
};

const InlineCreateForm = ({ companyUuid, homepageUuid, mediaList, onCreated, onRemove }: InlineCreateFormProps) => {
    const { addToast } = useToast();
    const { mutateAsync: adMediaCreate } = useAdMediaLinkCreateMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const emptyParam = useMemo<AdMediaLinkCreateReq>(
        () => ({
            mediaId: 0,
            companyUuid,
            homepageUuid,
            customerId: '',
            accountId: null,
            accountPassword: null,
            secretKey: null,
            accessToken: null,
            refreshToken: null,
            monthBudget: null,
        }),
        [companyUuid, homepageUuid]
    );

    const [param, setParam] = useState<AdMediaLinkCreateReq>(emptyParam);

    useEffect(() => {
        setParam(emptyParam);
    }, [emptyParam]);

    const form = useZodForm<AdMediaLinkCreateReq>({
        schema: adMediaLinkCreateSchema,
        value: param,
        onChange: setParam,
    });

    const mediaNameMap = useMemo(
        () => new Map<number, string>(mediaList.map((media) => [media.id, media.name])),
        [mediaList]
    );

    const mediaIdField = form.register('mediaId', {
        map: {
            toUi: (field) => String(field ?? 0),
            toField: (ui) => Number(ui ?? 0),
        },
    });

    const selectedMediaName = mediaNameMap.get(Number(mediaIdField.value ?? 0)) ?? '';
    const fieldSpecs = selectedMediaName ? FIELD_SPEC_MAP[selectedMediaName] ?? [] : [];

    type NullableFieldKey = 'accountId' | 'accountPassword' | 'secretKey' | 'accessToken' | 'refreshToken';
    const nullableField = <K extends NullableFieldKey>(name: K) =>
        form.register(name, {
            map: {
                toUi: (value) => (value ?? '') as string,
                toField: (value) => (value === '' ? null : value),
            },
        });

    const monthBudgetField = form.register('monthBudget', {
        map: {
            toUi: (value) => formatCommaNumber(String(value ?? '')),
            toField: (value) => {
                const digits = onlyDigits(String(value ?? ''));
                return digits === '' ? null : digits;
            },
        },
    });

    const isRequiredFieldFilled = (key: InlineFieldKey) => {
        const value = param[key];
        if (value == null) return false;
        return String(value).trim().length > 0;
    };

    const hasRequiredFields = fieldSpecs.every((field) => !field.required || isRequiredFieldFilled(field.key));
    const canSubmit = Number(param.mediaId) > 0 && hasRequiredFields && !isSubmitting;

    const onValid = async (data: AdMediaLinkCreateReq) => {
        if (!hasRequiredFields) {
            const firstRequiredField = fieldSpecs.find((field) => field.required && !isRequiredFieldFilled(field.key));
            if (firstRequiredField) {
                addToast({
                    icon: '⚠️',
                    message: `${firstRequiredField.label}을(를) 입력해주세요.`,
                    duration: 1800,
                    dismissible: true,
                });
            }
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await adMediaCreate(data);
            addToast({ icon: res.ok ? '😊' : '😫', message: res.message, duration: 2400, dismissible: true });
            if (!res.ok) return;
            await onCreated();
            onRemove();
        } finally {
            setIsSubmitting(false);
        }
    };

    const onInvalid = () => {
        const first =
            form.errors.companyUuid ||
            form.errors.homepageUuid ||
            form.errors.mediaId ||
            form.errors.customerId ||
            '입력값을 확인해주세요.';

        addToast({ icon: '⚠️', message: first, duration: 1800, dismissible: true });
    };

    return (
        <div className={styles.InlineCard}>
            <div className={styles.InlineFormRow}>
                <span className={styles.InlineLabel}>매체</span>
                <ButtonDropdown
                    value={String(mediaIdField.value ?? '0')}
                    onChange={(next) => mediaIdField.onChange(next)}
                    widthPreset="full"
                >
                    <ButtonDropdown.Trigger
                        label={
                            selectedMediaName ? (
                                <MediaWithIcon mediaName={selectedMediaName} />
                            ) : (
                                '매체 선택'
                            )
                        }
                        variant="outline"
                        size="lg"
                        dropdownIcon={<FiChevronDown size={14} />}
                    />
                    <ButtonDropdown.Content placement="bottom-start">
                        <ButtonDropdown.Item value="0">매체 선택</ButtonDropdown.Item>
                        {mediaList.map((media) => (
                            <ButtonDropdown.Item key={media.id} value={String(media.id)}>
                                <MediaWithIcon mediaName={media.name} />
                            </ButtonDropdown.Item>
                        ))}
                    </ButtonDropdown.Content>
                </ButtonDropdown>
            </div>

            {fieldSpecs.map((field) => {
                const bind =
                    field.key === 'monthBudget'
                        ? monthBudgetField
                        : field.key === 'customerId'
                          ? form.register('customerId', {
                                map: {
                                    toUi: (value) => String(value ?? ''),
                                    toField: (value) => String(value ?? ''),
                                },
                            })
                          : nullableField(field.key);

                return (
                    <div key={field.key} className={styles.InlineFormRow}>
                        <span className={styles.InlineLabel}>
                            {field.label}
                            {field.required ? ' *' : ''}
                        </span>
                        <RoundedTextInput
                            type={field.inputType ?? 'text'}
                            value={String(bind.value ?? '')}
                            onChange={bind.onChange}
                            placeholder={
                                field.placeholder ??
                                (field.key === 'monthBudget' ? '금액 입력해주세요.' : '값을 입력해주세요.')
                            }
                            inputMode={field.key === 'monthBudget' ? 'numeric' : undefined}
                        />
                    </div>
                );
            })}

            <div className={styles.InlineActions}>
                <button
                    type="button"
                    className={styles.PrimaryButton}
                    disabled={!canSubmit}
                    onClick={form.handleSubmit(onValid, onInvalid)}
                >
                    {isSubmitting ? '저장중...' : '저장하기'}
                </button>
                <button type="button" className={styles.SecondaryButton} onClick={onRemove}>
                    닫기
                </button>
            </div>
        </div>
    );
};

const CompanyAdMediaLinkContent = ({ state, actions, className }: CompanyAdMediaLinkContentProps) => {
    const createSeqRef = useRef(0);
    const [inlineCreateFormKeys, setInlineCreateFormKeys] = useState<number[]>([]);

    useEffect(() => {
        createSeqRef.current = 0;
        setInlineCreateFormKeys([]);
    }, [state.selectedHomepageUuid]);

    const addInlineCreateForm = () => {
        const nextKey = createSeqRef.current + 1;
        createSeqRef.current = nextKey;
        setInlineCreateFormKeys((prev) => [...prev, nextKey]);
    };

    const removeInlineCreateForm = (key: number) => {
        setInlineCreateFormKeys((prev) => prev.filter((item) => item !== key));
    };

    return (
        <>
            <section className={classNames(styles.Root, className)}>
                <div className={styles.FormRow}>
                    <span className={styles.Label}>홈페이지 선택</span>
                    <HomepageSelect
                        value={state.selectedHomepageUuid}
                        options={state.homepageOptions}
                        onChange={actions.changeHomepageUuid}
                    />
                </div>

                {!state.selectedHomepageUuid ? (
                    <p className={styles.PlaceholderText}>광고 매체 연동을 관리할 홈페이지를 선택해 주세요.</p>
                ) : (
                    <div className={styles.Section}>
                        <div className={styles.SectionHeader}>
                            <h4 className={styles.SectionTitle}>광고 매체 연동</h4>
                            <button type="button" className={styles.PrimaryButton} onClick={addInlineCreateForm}>
                                + 매체 추가하기
                            </button>
                        </div>

                        {inlineCreateFormKeys.length > 0 ? (
                            <div className={styles.InlineList}>
                                {inlineCreateFormKeys.map((key) => (
                                    <InlineCreateForm
                                        key={key}
                                        companyUuid={state.legacyState.companyUuid}
                                        homepageUuid={state.selectedHomepageUuid}
                                        mediaList={state.legacyState.mediaList}
                                        onCreated={actions.retry}
                                        onRemove={() => removeInlineCreateForm(key)}
                                    />
                                ))}
                            </div>
                        ) : null}

                        {state.isLoading || state.isFetching ? (
                            <p className={styles.HelperText}>광고 매체 목록을 불러오는 중입니다.</p>
                        ) : state.isError ? (
                            <div className={styles.ErrorRow}>
                                <p className={styles.HelperText}>광고 매체 목록을 불러오지 못했습니다.</p>
                                <button
                                    type="button"
                                    className={styles.SecondaryButton}
                                    onClick={() => {
                                        void actions.retry();
                                    }}
                                >
                                    다시 시도
                                </button>
                            </div>
                        ) : state.list.length === 0 ? (
                            <p className={styles.HelperText}>연동된 매체가 없습니다.</p>
                        ) : (
                            <>
                                <p className={styles.TotalText}>총 {state.list.length}개</p>
                                <ul className={styles.List}>
                                    {state.list.map((item) => (
                                        <li key={item.id} className={styles.Item}>
                                            <MediaWithIcon mediaName={item.adMediaName} />
                                            <div className={styles.Actions}>
                                                <button
                                                    type="button"
                                                    className={styles.SecondaryButton}
                                                    onClick={() => actions.openCampaignModal(item)}
                                                >
                                                    캠페인
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.SecondaryButton}
                                                    onClick={() => actions.openUpdateModal(item)}
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    type="button"
                                                    className={styles.SecondaryButton}
                                                    onClick={() => actions.openDeleteModal(item)}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </section>

            <AdMediaLinkUpdateModal
                state={state.legacyState}
                selectedItem={state.selectedItem}
                modalValue={state.linkUpdateModal}
                setModalValue={(open) => {
                    if (open) return;
                    actions.closeUpdateModal();
                }}
            />

            <AdMediaLinkDeleteModal
                state={state.legacyState}
                deleteId={state.deleteId}
                modalValue={state.linkDeleteModal}
                setModalValue={(open) => {
                    if (open) return;
                    actions.closeDeleteModal();
                }}
                deleteMutate={state.legacyActions.deleteMutate}
            />

            <AdMediaCampaignModal
                state={state.legacyState}
                actions={state.legacyActions}
                modalValue={state.campaignModal}
                setModalValue={(open) => {
                    if (open) return;
                    actions.closeCampaignModal();
                }}
            />
        </>
    );
};

export default CompanyAdMediaLinkContent;
