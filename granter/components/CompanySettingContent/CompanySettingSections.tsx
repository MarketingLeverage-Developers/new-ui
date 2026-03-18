import {
    BasicConfirm,
    BasicContent,
    BasicModal,
    UI,
} from '@/components/common/granter';
import type {
    CompanyAdMediaLinkSettingActions,
    CompanyAdMediaLinkSettingState,
    CompanySettingInlineFieldKey,
    CompanySettingInlineFieldSpec,
} from '@/hooks/feature/useCompanyAdMediaLinkSetting';
import type {
    CompanyAdMediaInlineCreateFormsActions,
    CompanyAdMediaInlineCreateFormsState,
} from '@/hooks/feature/useAdMediaSetting';
import type {
    CompanyDailyReportSettingActions,
    CompanyDailyReportSettingState,
} from '@/hooks/feature/useDailyReportUpdate';
import type {
    CompanyInquiryAccessSettingActions,
    CompanyInquiryAccessSettingState,
} from '@/hooks/feature/useInquirySettingUpdate';
import type { ReactNode } from 'react';
import naverLogo from '@/shared/assets/images/naver-social-icon.svg';
import googleLogo from '@/shared/assets/images/google-social-icon.svg';
import metaLogo from '@/shared/assets/images/meta-social-icon.svg';
import kakaoLogo from '@/shared/assets/images/kakao-social-login.svg';
import danngnLogo from '@/shared/assets/images/danngn-icon.svg';
import logo from '@/shared/assets/images/logo.svg';
import type { CampaignsItem } from '@/types/campaign/campaignListTypes';
import type { MediaListItem } from '@/types/ad-media-link/adMediaLinkMediaTypes';
import TimeSlotSelector from '../TimeSlotSelector/TimeSlotSelector';
import styles from './CompanySettingContent.module.scss';

const {
    BlackButton,
    Box,
    Flex,
    RoundedTextInput,
    SectionBlock,
    SectionFieldInput,
    SectionFieldRow,
    SectionFieldSelect,
    SectionFieldTab,
    Text,
    WhiteButton,
} = UI;

const EMBEDDED_FIELD_LABEL_WIDTH = 120;
const HOURS = Array.from({ length: 24 }, (_, index) => index);
const HOUR_OPTIONS = HOURS.map((hour) => ({ value: String(hour), label: `${String(hour).padStart(2, '0')}시` }));

const EMPTY_INLINE_UPDATE_FIELD_VALUES: Record<CompanySettingInlineFieldKey, string> = {
    customerId: '',
    accountId: '',
    accountPassword: '',
    secretKey: '',
    accessToken: '',
    refreshToken: '',
    monthBudget: '',
};

const INLINE_NOTICE_BY_MEDIA: Record<string, string> = {
    네이버: "'마케팅베버리지' 네이버 계정에 권한 부여 완료 여부",
    구글: '필수 MCC 계정 액세스 권한 승인 완료 여부',
    카카오: '비즈니스 채널 및 모먼트 관리자 권한 확인',
    메타: '앱 엑세스 토큰 및 파트너 권한 할당 확인',
    당근: '광고계정 권한 및 월 소진액 입력값을 확인해 주세요.',
};

const getMediaLogoSrc = (name: string) => {
    if (name === '네이버') return naverLogo;
    if (name === '구글') return googleLogo;
    if (name === '메타') return metaLogo;
    if (name === '카카오') return kakaoLogo;
    if (name === '당근') return danngnLogo;
    return logo;
};

const getOptionLabel = (label: ReactNode) => (
    <Text size="sm" weight="medium">
        {label}
    </Text>
);

const getMediaOptionLabel = (name: string) => (
    <Flex inline align="center" gap={8}>
        <img src={getMediaLogoSrc(name)} alt={`${name}-logo`} width={18} height={18} />
        <Text size="sm" weight="medium">
            {name}
        </Text>
    </Flex>
);

type InlineCreateFormProps = {
    form: CompanyAdMediaInlineCreateFormsState['forms'][number];
    mediaList: MediaListItem[];
    onChangeMediaId: (value: string) => void;
    onChangeField: (fieldKey: CompanySettingInlineFieldKey, value: string) => void;
    onSubmit: () => void;
    onRemove: () => void;
};

type InlineUpdateFormProps = {
    mediaName: string;
    isLoading: boolean;
    fieldSpecs: CompanySettingInlineFieldSpec[];
    fieldValues: Record<CompanySettingInlineFieldKey, string>;
    isSaving: boolean;
    canSave: boolean;
    onChangeField: (fieldKey: CompanySettingInlineFieldKey, value: string) => void;
    onSubmit: () => void;
    onOpenCampaign: () => void;
};

const InlineCreateForm = ({
    form,
    mediaList,
    onChangeMediaId,
    onChangeField,
    onSubmit,
    onRemove,
}: InlineCreateFormProps) => (
    <SectionBlock
        title={form.selectedMediaName ? `${form.selectedMediaName} 신규 연동` : '새 매체 연결'}
        description="연동할 매체를 선택하고 계정 정보를 입력합니다."
    >
        <Flex direction="column" gap={12}>
            <Flex direction="column">
                <SectionFieldRow label="매체" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}>
                    <SectionFieldSelect
                        value={form.mediaIdValue}
                        onChange={onChangeMediaId}
                        placeholder="매체 선택"
                        options={[
                            { value: '0', label: getOptionLabel('매체 선택') },
                            ...mediaList.map((media) => ({
                                value: String(media.id),
                                label: getMediaOptionLabel(media.name),
                            })),
                        ]}
                    />
                </SectionFieldRow>

                {form.fieldSpecs.map((field, index) => (
                    <SectionFieldRow
                        key={field.key}
                        label={field.required ? `${field.label} *` : field.label}
                        labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}
                        divider={index !== form.fieldSpecs.length - 1}
                    >
                        <SectionFieldInput
                            type={field.inputType ?? 'text'}
                            value={form.fieldValues[field.key]}
                            onChange={(event) => onChangeField(field.key, event.target.value)}
                            placeholder={field.placeholder ?? '값을 입력해주세요.'}
                            inputMode={field.key === 'monthBudget' ? 'numeric' : undefined}
                        />
                    </SectionFieldRow>
                ))}
            </Flex>

            <Flex justify="end" gap={8}>
                <WhiteButton size="sm" onClick={onRemove}>
                    닫기
                </WhiteButton>
                <BlackButton size="sm" disabled={!form.canSubmit} onClick={onSubmit}>
                    {form.isSubmitting ? '저장중...' : '저장하기'}
                </BlackButton>
            </Flex>

            {form.selectedMediaName && INLINE_NOTICE_BY_MEDIA[form.selectedMediaName] ? (
                <BasicContent.Alert tone="neutral" className={styles.InlineNotice}>
                    <BasicContent.AlertMain className={styles.InlineNoticeMain}>
                        <BasicContent.AlertText className={styles.InlineNoticeText}>
                            {INLINE_NOTICE_BY_MEDIA[form.selectedMediaName]}
                        </BasicContent.AlertText>
                    </BasicContent.AlertMain>
                </BasicContent.Alert>
            ) : null}
        </Flex>
    </SectionBlock>
);

const InlineUpdateForm = ({
    mediaName,
    isLoading,
    fieldSpecs,
    fieldValues,
    isSaving,
    canSave,
    onChangeField,
    onSubmit,
    onOpenCampaign,
}: InlineUpdateFormProps) => (
    <SectionBlock
        title={`${mediaName} 연동 정보`}
        description="계정 정보와 캠페인 연결 상태를 함께 관리합니다."
    >
        {isLoading ? (
            <Text as="p" size="sm" tone="muted">
                매체 상세 정보를 불러오는 중입니다.
            </Text>
        ) : fieldSpecs.length === 0 ? (
            <Text as="p" size="sm" tone="muted">
                수정 가능한 항목이 없습니다.
            </Text>
        ) : (
            <Flex direction="column" gap={12}>
                <Flex direction="column">
                    <SectionFieldRow label="매체" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}>
                        {getMediaOptionLabel(mediaName)}
                    </SectionFieldRow>

                    {fieldSpecs.map((field, index) => (
                        <SectionFieldRow
                            key={field.key}
                            label={field.required ? `${field.label} *` : field.label}
                            labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}
                            divider={index !== fieldSpecs.length - 1}
                        >
                            <SectionFieldInput
                                type={field.inputType ?? 'text'}
                                value={fieldValues[field.key]}
                                onChange={(event) => onChangeField(field.key, event.target.value)}
                                placeholder={field.placeholder ?? '값을 입력해주세요.'}
                                inputMode={field.key === 'monthBudget' ? 'numeric' : undefined}
                            />
                        </SectionFieldRow>
                    ))}
                </Flex>

                <Flex justify="end" gap={8}>
                    <WhiteButton size="sm" disabled={isLoading} onClick={onOpenCampaign}>
                        캠페인 연결
                    </WhiteButton>
                    <BlackButton size="sm" disabled={!canSave} onClick={onSubmit}>
                        {isSaving ? '저장중...' : '수정하기'}
                    </BlackButton>
                </Flex>
            </Flex>
        )}

        {!isLoading && INLINE_NOTICE_BY_MEDIA[mediaName] ? (
            <BasicContent.Alert tone="neutral" className={styles.InlineNotice}>
                <BasicContent.AlertMain className={styles.InlineNoticeMain}>
                    <BasicContent.AlertText className={styles.InlineNoticeText}>
                        {INLINE_NOTICE_BY_MEDIA[mediaName]}
                    </BasicContent.AlertText>
                </BasicContent.AlertMain>
            </BasicContent.Alert>
        ) : null}
    </SectionBlock>
);

export type CompanyAdMediaLinkSectionProps = {
    state: CompanyAdMediaLinkSettingState;
    actions: CompanyAdMediaLinkSettingActions;
    inlineCreateState: CompanyAdMediaInlineCreateFormsState;
    inlineCreateActions: CompanyAdMediaInlineCreateFormsActions;
};

export const CompanyAdMediaLinkSection = ({
    state,
    actions,
    inlineCreateState,
    inlineCreateActions,
}: CompanyAdMediaLinkSectionProps) => (
    <>
        <Flex direction="column" gap={16}>
            <SectionBlock title="연동 대상" description="광고 매체를 관리할 홈페이지를 먼저 선택합니다.">
                <Flex direction="column">
                    <SectionFieldRow label="홈페이지" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH} divider={false}>
                        <SectionFieldSelect
                            value={state.selectedHomepageUuid}
                            onChange={actions.changeHomepageUuid}
                            placeholder="홈페이지 선택"
                            options={state.homepageOptions.map((option) => ({
                                value: option.value,
                                label: getOptionLabel(option.label),
                            }))}
                        />
                    </SectionFieldRow>
                </Flex>
            </SectionBlock>

            {!state.selectedHomepageUuid ? (
                <SectionBlock title="연동 안내" description="설정을 시작하기 전에 대상 홈페이지를 지정합니다.">
                    <Text as="p" size="sm" tone="muted">
                        광고 매체 연동을 관리할 홈페이지를 선택해 주세요.
                    </Text>
                </SectionBlock>
            ) : (
                <>
                    <SectionBlock
                        title="새 매체 연결"
                        description="새로운 광고 매체 계정을 추가로 연결할 수 있습니다."
                        headerSide={
                            <WhiteButton size="sm" onClick={inlineCreateActions.add}>
                                + 매체 추가하기
                            </WhiteButton>
                        }
                    >
                        {inlineCreateState.forms.length === 0 ? (
                            <Text as="p" size="sm" tone="muted">
                                연결할 매체가 있다면 우측 상단 버튼으로 새 항목을 추가하세요.
                            </Text>
                        ) : (
                            <Flex direction="column" gap={12}>
                                {inlineCreateState.forms.map((formItem) => (
                                    <InlineCreateForm
                                        key={formItem.key}
                                        form={formItem}
                                        mediaList={state.legacyState.mediaList}
                                        onChangeMediaId={(value) => inlineCreateActions.changeMediaId(formItem.key, value)}
                                        onChangeField={(fieldKey, value) =>
                                            inlineCreateActions.changeField(formItem.key, fieldKey, value)
                                        }
                                        onSubmit={() => {
                                            void inlineCreateActions.submit(formItem.key);
                                        }}
                                        onRemove={() => inlineCreateActions.remove(formItem.key)}
                                    />
                                ))}
                            </Flex>
                        )}
                    </SectionBlock>

                    <SectionBlock title="연동된 매체" description="이미 연결된 매체 계정과 캠페인 연결을 관리합니다.">
                        {state.isLoading || state.isFetching ? (
                            <Text as="p" size="sm" tone="muted">
                                광고 매체 목록을 불러오는 중입니다.
                            </Text>
                        ) : state.isError ? (
                            <Flex align="center" justify="space-between" gap={8}>
                                <Text as="p" size="sm" tone="muted">
                                    광고 매체 목록을 불러오지 못했습니다.
                                </Text>
                                <WhiteButton
                                    size="sm"
                                    onClick={() => {
                                        void actions.retry();
                                    }}
                                >
                                    다시 시도
                                </WhiteButton>
                            </Flex>
                        ) : state.list.length === 0 ? (
                            <Text as="p" size="sm" tone="muted">
                                연동된 매체가 없습니다.
                            </Text>
                        ) : (
                            <Flex direction="column" gap={12}>
                                {state.list.map((item) => {
                                    const updateFormItem = state.adMediaInlineUpdateForms.find((form) => form.id === item.id);
                                    const inlineUpdateForm = updateFormItem ?? {
                                        id: item.id,
                                        mediaName: item.adMediaName,
                                        fieldSpecs: [],
                                        fieldValues: EMPTY_INLINE_UPDATE_FIELD_VALUES,
                                        canSave: false,
                                        isLoading: true,
                                        isSaving: false,
                                    };

                                    return (
                                        <InlineUpdateForm
                                            key={item.id}
                                            mediaName={inlineUpdateForm.mediaName}
                                            isLoading={inlineUpdateForm.isLoading}
                                            fieldSpecs={inlineUpdateForm.fieldSpecs}
                                            fieldValues={inlineUpdateForm.fieldValues}
                                            isSaving={inlineUpdateForm.isSaving}
                                            canSave={inlineUpdateForm.canSave}
                                            onChangeField={(fieldKey, value) =>
                                                actions.changeAdMediaInlineUpdateField(item.id, fieldKey, value)
                                            }
                                            onSubmit={() => {
                                                void actions.saveAdMediaInlineUpdate(item.id);
                                            }}
                                            onOpenCampaign={() => {
                                                actions.openCampaignModal(item);
                                            }}
                                        />
                                    );
                                })}
                            </Flex>
                        )}
                    </SectionBlock>
                </>
            )}
        </Flex>

        <BasicModal
            open={state.linkDeleteModal}
            onChange={actions.closeDeleteModal}
            width={360}
            content={
                <BasicConfirm
                    title={<>매체를 삭제하시겠습니까?</>}
                    description={<>삭제 후에는 복구할 수 없습니다.</>}
                    cancelText="취소"
                    confirmText={state.isAdMediaDeleteSaving ? '삭제중...' : '삭제'}
                    onCancel={actions.closeDeleteModal}
                    onConfirm={() => {
                        void actions.confirmAdMediaDelete();
                    }}
                />
            }
        />

        <BasicModal
            open={state.campaignModal}
            onChange={actions.closeCampaignModal}
            width={560}
            maxHeight="80vh"
            content={
                <BasicContent>
                    <BasicContent.Header>
                        <BasicContent.Title>캠페인 등록하기</BasicContent.Title>
                        <BasicContent.CloseButton onClick={actions.closeCampaignModal} />
                    </BasicContent.Header>

                    <BasicContent.Body>
                        <Flex direction="column" gap={12}>
                            <RoundedTextInput
                                value={state.campaignSearchQuery}
                                onChange={(event) => actions.changeCampaignSearchQuery(event.target.value)}
                                placeholder="캠페인명 또는 캠페인 ID 검색"
                            />

                            <Text as="p" size="sm" tone="muted">
                                선택 {state.campaignSelectedIds.length}개
                            </Text>

                            {state.isCampaignRemoteFetching ? (
                                <Text as="p" size="sm" tone="muted">
                                    캠페인 목록을 불러오는 중입니다.
                                </Text>
                            ) : state.isCampaignRemoteError ? (
                                <Flex align="center" justify="space-between" gap={8}>
                                    <Text as="p" size="sm" tone="muted">
                                        캠페인 목록을 불러오지 못했습니다.
                                    </Text>
                                    <WhiteButton
                                        size="sm"
                                        onClick={() => {
                                            void actions.retryCampaignRemote();
                                        }}
                                    >
                                        다시 시도
                                    </WhiteButton>
                                </Flex>
                            ) : state.filteredCampaignRemoteList.length === 0 ? (
                                <Text as="p" size="sm" tone="muted">
                                    {state.campaignSearchQuery.trim().length > 0
                                        ? '검색 결과가 없습니다.'
                                        : '조회 가능한 캠페인이 없습니다.'}
                                </Text>
                            ) : (
                                <Flex direction="column" gap={8}>
                                    {state.filteredCampaignRemoteList.map((campaign: CampaignsItem) => {
                                        const campaignId = String(campaign.campaignId);
                                        const isSelected = state.campaignSelectedIds.includes(campaignId);

                                        return (
                                            <Box
                                                key={campaignId}
                                                border="1px solid var(--granter-gray-200)"
                                                borderRadius={10}
                                                padding={10}
                                            >
                                                <Flex align="center" justify="space-between" gap={8}>
                                                    <Flex direction="column" gap={2}>
                                                        <Text size="sm" weight="medium">
                                                            {campaign.campaignName || campaignId}
                                                        </Text>
                                                        <Text size="xs" tone="muted">
                                                            {campaignId}
                                                        </Text>
                                                    </Flex>

                                                    <WhiteButton
                                                        size="sm"
                                                        onClick={() => {
                                                            actions.toggleCampaignSelection(campaign);
                                                        }}
                                                    >
                                                        {isSelected ? '선택됨' : '선택'}
                                                    </WhiteButton>
                                                </Flex>
                                            </Box>
                                        );
                                    })}
                                </Flex>
                            )}
                        </Flex>
                    </BasicContent.Body>

                    <BasicContent.Footer>
                        <BasicContent.ActionButton variant="secondary" onClick={actions.closeCampaignModal}>
                            취소
                        </BasicContent.ActionButton>
                        <BasicContent.ActionButton
                            variant="primary"
                            disabled={state.isCampaignUpdating}
                            onClick={() => {
                                void actions.saveCampaignSelection();
                            }}
                        >
                            저장하기
                        </BasicContent.ActionButton>
                    </BasicContent.Footer>
                </BasicContent>
            }
        />
    </>
);

export type CompanyInquiryAccessSectionProps = {
    state: CompanyInquiryAccessSettingState;
    actions: CompanyInquiryAccessSettingActions;
};

export const CompanyInquiryAccessSection = ({ state, actions }: CompanyInquiryAccessSectionProps) => (
    <Flex direction="column" gap={16}>
        <SectionBlock title="적용 대상" description="문의 · 접속 설정을 적용할 홈페이지를 선택합니다.">
            <Flex direction="column">
                <SectionFieldRow label="회사명" value={state.companyName || '-'} labelWidth={EMBEDDED_FIELD_LABEL_WIDTH} />
                <SectionFieldRow label="홈페이지" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH} divider={false}>
                    <SectionFieldSelect
                        value={state.selectedHomepageUuid}
                        onChange={actions.changeHomepageUuid}
                        placeholder="홈페이지 선택"
                        options={state.homepageOptions.map((option) => ({
                            value: option.value,
                            label: getOptionLabel(option.label),
                        }))}
                    />
                </SectionFieldRow>
            </Flex>
        </SectionBlock>

        <div className={styles.EmbeddedGrid}>
            <SectionBlock title="중복 문의 방지" description="중복 문의 판단 여부와 기준 시간을 설정합니다.">
                <Flex direction="column">
                    <SectionFieldRow label="중복 문의 방지" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}>
                        <SectionFieldTab
                            value={state.form.preventDuplicateInquiry ? 'true' : 'false'}
                            onChange={(next) => actions.changeField('preventDuplicateInquiry', next === 'true')}
                        >
                            <SectionFieldTab.Item value="true">사용</SectionFieldTab.Item>
                            <SectionFieldTab.Item value="false">미사용</SectionFieldTab.Item>
                        </SectionFieldTab>
                    </SectionFieldRow>
                    <SectionFieldRow label="중복 문의 기준 시간(초)" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}>
                        <SectionFieldInput
                            type="text"
                            inputMode="numeric"
                            value={String(state.form.duplicateInquiryThresholdSecond)}
                            onChange={(event) =>
                                actions.changeIntegerField('duplicateInquiryThresholdSecond', event.target.value)
                            }
                            placeholder="중복 문의 기준 시간을 입력해주세요."
                        />
                    </SectionFieldRow>
                    <SectionFieldRow label="스팸 문의 기준 건수" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}>
                        <SectionFieldInput
                            type="text"
                            inputMode="numeric"
                            value={String(state.form.spamInquiryThresholdCount)}
                            onChange={(event) => actions.changeIntegerField('spamInquiryThresholdCount', event.target.value)}
                            placeholder="스팸 문의 기준 건수를 입력해주세요."
                        />
                    </SectionFieldRow>
                    <SectionFieldRow label="전 IP 스팸전화 차단" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}>
                        <SectionFieldTab
                            value={state.form.preventSpamPhoneAllIps ? 'true' : 'false'}
                            onChange={(next) => actions.changeField('preventSpamPhoneAllIps', next === 'true')}
                        >
                            <SectionFieldTab.Item value="true">사용</SectionFieldTab.Item>
                            <SectionFieldTab.Item value="false">미사용</SectionFieldTab.Item>
                        </SectionFieldTab>
                    </SectionFieldRow>
                    <SectionFieldRow
                        label="네이버 방문 차단 기준 건수"
                        labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}
                        divider={false}
                    >
                        <SectionFieldInput
                            type="text"
                            inputMode="numeric"
                            value={String(state.form.naverVisitBlockThresholdCount)}
                            onChange={(event) =>
                                actions.changeIntegerField('naverVisitBlockThresholdCount', event.target.value)
                            }
                            placeholder="네이버 방문 차단 기준 건수를 입력해주세요."
                        />
                    </SectionFieldRow>
                </Flex>
            </SectionBlock>

            <SectionBlock title="발송 정책" description="문의 알림과 고객 안내 발송 방식을 조정합니다.">
                <Flex direction="column">
                    <SectionFieldRow label="문의 알림 발송 방법" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}>
                        <SectionFieldSelect
                            value={state.form.deliveryType}
                            placeholder="발송 방법 선택"
                            options={[
                                { value: 'SMS', label: getOptionLabel('SMS') },
                                { value: 'KAKAO', label: getOptionLabel('카카오톡') },
                                { value: 'NONE', label: getOptionLabel('보내지 않기') },
                            ]}
                            onChange={(next) => actions.changeField('deliveryType', next as typeof state.form.deliveryType)}
                        />
                    </SectionFieldRow>
                    <SectionFieldRow label="발송 방식" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}>
                        <SectionFieldSelect
                            value={state.form.deliveryMethod}
                            placeholder="발송 방식 선택"
                            options={[
                                { value: 'ALL', label: getOptionLabel('전체') },
                                { value: 'SEQUENCE', label: getOptionLabel('순번') },
                                { value: 'SEQUENCE_IGNORE_DUPLICATE', label: getOptionLabel('순번(중복무시)') },
                                { value: 'NONE', label: getOptionLabel('없음') },
                            ]}
                            onChange={(next) => actions.changeField('deliveryMethod', next as typeof state.form.deliveryMethod)}
                        />
                    </SectionFieldRow>
                    <SectionFieldRow label="고객 안내톡 수신 여부" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}>
                        <SectionFieldSelect
                            value={state.form.clientDeliveryType}
                            placeholder="수신 여부 선택"
                            options={[
                                { value: 'KAKAO', label: getOptionLabel('카카오톡') },
                                { value: 'NONE', label: getOptionLabel('미수신') },
                                { value: 'SMS', label: getOptionLabel('SMS') },
                            ]}
                            onChange={(next) =>
                                actions.changeField('clientDeliveryType', next as typeof state.form.clientDeliveryType)
                            }
                        />
                    </SectionFieldRow>
                    <SectionFieldRow label="상태" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH} divider={false}>
                        <SectionFieldTab
                            value={state.form.status}
                            onChange={(next) => actions.changeField('status', next as typeof state.form.status)}
                        >
                            <SectionFieldTab.Item value="ACTIVE">활성화</SectionFieldTab.Item>
                            <SectionFieldTab.Item value="INACTIVE">비활성화</SectionFieldTab.Item>
                        </SectionFieldTab>
                    </SectionFieldRow>
                </Flex>
            </SectionBlock>
        </div>

        {state.isFetching ? (
            <Text as="p" size="sm" tone="muted">
                설정 정보를 불러오는 중입니다.
            </Text>
        ) : null}
    </Flex>
);

export type CompanyDailyReportSectionProps = {
    state: CompanyDailyReportSettingState;
    actions: CompanyDailyReportSettingActions;
};

export const CompanyDailyReportSection = ({ state, actions }: CompanyDailyReportSectionProps) => (
    <Flex direction="column" gap={16}>
        <SectionBlock title="설정 기준" description="일일보고는 현재 업체 단위로 저장됩니다.">
            <Flex direction="column">
                <SectionFieldRow label="회사명" value={state.companyName || '-'} labelWidth={EMBEDDED_FIELD_LABEL_WIDTH} />
                <SectionFieldRow label="적용 범위" value="업체 기준" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH} divider={false} />
            </Flex>
        </SectionBlock>

        <div className={styles.EmbeddedGrid}>
            <SectionBlock title="수신 설정" description="활성화 상태와 카카오톡 수신번호를 관리합니다.">
                <Flex direction="column">
                    <SectionFieldRow label="자동보고 활성화" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH}>
                        <SectionFieldTab
                            value={state.useStatus}
                            onChange={(next) => actions.changeUseStatus(next as typeof state.useStatus)}
                        >
                            <SectionFieldTab.Item value="ACTIVE">활성화</SectionFieldTab.Item>
                            <SectionFieldTab.Item value="INACTIVE">비활성화</SectionFieldTab.Item>
                        </SectionFieldTab>
                    </SectionFieldRow>
                    <SectionFieldRow label="카카오톡 수신번호" labelWidth={EMBEDDED_FIELD_LABEL_WIDTH} divider={false}>
                        <SectionFieldInput
                            value={state.phoneNumber}
                            onChange={(event) => actions.changePhoneNumber(event.target.value)}
                            placeholder="010-0000-0000,010-0000-0000"
                        />
                    </SectionFieldRow>
                </Flex>
            </SectionBlock>

            <SectionBlock title="보고 시간대" description="복수 선택으로 자동 보고 시간대를 조정합니다.">
                <TimeSlotSelector
                    options={HOUR_OPTIONS}
                    selectedValues={state.selectedHours}
                    onToggle={actions.toggleHour}
                    guide="보고 받을 시간대를 선택해주세요."
                    summary={state.selectedHoursLabel}
                />
            </SectionBlock>
        </div>
    </Flex>
);
