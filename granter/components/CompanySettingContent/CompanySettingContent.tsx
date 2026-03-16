import React from 'react';
import type { CompanyDailyReportSettingState } from '@/hooks/feature/useDailyReportUpdate';
import type { CompanyInquiryAccessSettingState } from '@/hooks/feature/useInquirySettingUpdate';
import type {
    CompanySettingContentActions,
    CompanySettingContentState,
} from '@/hooks/feature/useCompanySettingContent';
import type {
    CompanySettingAdMediaInlineCreateFormItem,
    CompanySettingInlineFieldKey,
} from '@/hooks/feature/useAdMediaSetting';
import naverLogo from '@/shared/assets/images/naver-social-icon.svg';
import googleLogo from '@/shared/assets/images/google-social-icon.svg';
import metaLogo from '@/shared/assets/images/meta-social-icon.svg';
import kakaoLogo from '@/shared/assets/images/kakao-social-login.svg';
import danngnLogo from '@/shared/assets/images/danngn-icon.svg';
import logo from '@/shared/assets/images/logo.svg';
import defaultProfile from '@/shared/assets/images/default-profile.png';
import type { MediaListItem } from '@/types/ad-media-link/adMediaLinkMediaTypes';
import { formatPhoneNumber } from '@/utils/inquiry-sequence/InquirySequenceUtils';
import BasicConfirm from '../BasicConfirm/BasicConfirm';
import BasicModal from '../BasicModal/BasicModal';
import BasicContent from '../BasicContent/BasicContent';
import BlackButton from '../Button/BlackButton';
import GrayButton from '../Button/GrayButton';
import WhiteButton from '../Button/WhiteButton';
import ButtonDropdown from '../ButtonDropdown/ButtonDropdown';
import Box from '../Box/Box';
import Flex from '../Flex/Flex';
import Grid from '../Grid/Grid';
import RoundedSegmentTab from '../RoundedSegmentTab/RoundedSegmentTab';
import RoundedTextInput from '../RoundedTextInput/RoundedTextInput';
import Text from '../Text/Text';
import UnderlineTab from '../UnderlineTab/UnderlineTab';

export type CompanySettingContentProps = {
    state: CompanySettingContentState;
    actions: CompanySettingContentActions;
    embedded?: boolean;
};

type InlineCreateFormProps = {
    form: CompanySettingAdMediaInlineCreateFormItem;
    mediaList: MediaListItem[];
    onChangeMediaId: (value: string) => void;
    onChangeField: (fieldKey: CompanySettingInlineFieldKey, value: string) => void;
    onSubmit: () => void;
    onRemove: () => void;
};

type InlineUpdateFormProps = {
    mediaName: string;
    isLoading: boolean;
    fieldSpecs: Array<{
        key: CompanySettingInlineFieldKey;
        label: string;
        required?: boolean;
        placeholder?: string;
        inputType?: 'text' | 'password';
    }>;
    fieldValues: Record<CompanySettingInlineFieldKey, string>;
    isSaving: boolean;
    canSave: boolean;
    onChangeField: (fieldKey: CompanySettingInlineFieldKey, value: string) => void;
    onSubmit: () => void;
    onOpenCampaign: () => void;
};

const HOURS = Array.from({ length: 24 }, (_, index) => index);

const formatHourLabel = (hour: number) => `${String(hour).padStart(2, '0')}시`;

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

const InlineCreateForm = ({
    form,
    mediaList,
    onChangeMediaId,
    onChangeField,
    onSubmit,
    onRemove,
}: InlineCreateFormProps) => (
    <Box border="1px solid var(--granter-gray-200)" borderRadius={10} padding={12}>
            <BasicContent.List>
                <BasicContent.Item
                    size="lg"
                    label="매체"
                    value={
                        <ButtonDropdown
                            value={form.mediaIdValue}
                            onChange={onChangeMediaId}
                            widthPreset="fit"
                        >
                            <ButtonDropdown.Trigger
                                label={
                                    form.selectedMediaName ? (
                                        <Flex inline align="center" gap={8}>
                                            <img
                                                src={getMediaLogoSrc(form.selectedMediaName)}
                                                alt={`${form.selectedMediaName}-logo`}
                                                width={18}
                                                height={18}
                                            />
                                            <Text size="sm" weight="medium">
                                                {form.selectedMediaName}
                                            </Text>
                                        </Flex>
                                    ) : (
                                        '매체 선택'
                                    )
                                }
                                variant="outline"
                                size="lg"
                                aria-label="매체 선택"
                            />
                            <ButtonDropdown.Content placement="bottom-start">
                                <ButtonDropdown.Item value="0">매체 선택</ButtonDropdown.Item>
                            {mediaList.map((media) => (
                                <ButtonDropdown.Item key={media.id} value={String(media.id)}>
                                    <Flex inline align="center" gap={8}>
                                        <img
                                            src={getMediaLogoSrc(media.name)}
                                            alt={`${media.name}-logo`}
                                            width={18}
                                            height={18}
                                        />
                                        <Text size="sm" weight="medium">
                                            {media.name}
                                        </Text>
                                    </Flex>
                                </ButtonDropdown.Item>
                            ))}
                            </ButtonDropdown.Content>
                        </ButtonDropdown>
                    }
                />

                {form.fieldSpecs.map((field) => (
                    <BasicContent.Item
                        key={field.key}
                        size="lg"
                        label={field.label}
                        required={field.required}
                        value={
                            <RoundedTextInput
                                type={field.inputType ?? 'text'}
                                value={form.fieldValues[field.key]}
                                onChange={(event) => onChangeField(field.key, event.target.value)}
                                placeholder={
                                    field.placeholder ??
                                    (field.key === 'monthBudget' ? '금액 입력해주세요.' : '값을 입력해주세요.')
                                }
                                inputMode={field.key === 'monthBudget' ? 'numeric' : undefined}
                            />
                        }
                    />
                ))}
            </BasicContent.List>

            <Flex justify="end" gap={8} marginTop={8}>
                <WhiteButton size="sm" onClick={onRemove}>
                    닫기
                </WhiteButton>
                <BlackButton size="sm" disabled={!form.canSubmit} onClick={onSubmit}>
                    {form.isSubmitting ? '저장중...' : '저장하기'}
                </BlackButton>
            </Flex>

            {form.selectedMediaName && INLINE_NOTICE_BY_MEDIA[form.selectedMediaName] ? (
                <BasicContent.Alert tone="neutral">
                    <BasicContent.AlertMain>
                        <BasicContent.AlertText>{INLINE_NOTICE_BY_MEDIA[form.selectedMediaName]}</BasicContent.AlertText>
                    </BasicContent.AlertMain>
                </BasicContent.Alert>
            ) : null}
    </Box>
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
    <Box border="1px solid var(--granter-gray-200)" borderRadius={10} padding={12}>
        {isLoading ? (
            <Text as="p" size="sm" tone="muted">
                매체 상세 정보를 불러오는 중입니다.
            </Text>
        ) : fieldSpecs.length === 0 ? (
            <Text as="p" size="sm" tone="muted">
                수정 가능한 항목이 없습니다.
            </Text>
        ) : (
            <BasicContent.List>
                <BasicContent.Item
                    size="lg"
                    label="매체"
                    value={
                        <Flex inline align="center" gap={8}>
                            <img src={getMediaLogoSrc(mediaName)} alt={`${mediaName}-logo`} width={18} height={18} />
                            <Text size="sm" weight="medium">
                                {mediaName}
                            </Text>
                        </Flex>
                    }
                />

                {fieldSpecs.map((field) => (
                    <BasicContent.Item
                        key={field.key}
                        size="lg"
                        label={field.label}
                        required={field.required}
                        value={
                            <RoundedTextInput
                                type={field.inputType ?? 'text'}
                                value={fieldValues[field.key]}
                                onChange={(event) => onChangeField(field.key, event.target.value)}
                                placeholder={
                                    field.placeholder ??
                                    (field.key === 'monthBudget' ? '금액 입력해주세요.' : '값을 입력해주세요.')
                                }
                                inputMode={field.key === 'monthBudget' ? 'numeric' : undefined}
                            />
                        }
                    />
                ))}

                <BasicContent.Item
                    size="lg"
                    label="연동하기"
                    value={
                        <Flex align="center" gap={8}>
                            <BlackButton size="sm" disabled={!canSave} onClick={onSubmit}>
                                {isSaving ? '저장중...' : '수정하기'}
                            </BlackButton>
                            <GrayButton size="sm" disabled={isLoading} onClick={onOpenCampaign}>
                                캠페인 연결
                            </GrayButton>
                        </Flex>
                    }
                />
            </BasicContent.List>
        )}

        {!isLoading && INLINE_NOTICE_BY_MEDIA[mediaName] ? (
            <BasicContent.Alert tone="neutral">
                <BasicContent.AlertMain>
                    <BasicContent.AlertText>{INLINE_NOTICE_BY_MEDIA[mediaName]}</BasicContent.AlertText>
                </BasicContent.AlertMain>
            </BasicContent.Alert>
        ) : null}
    </Box>
);

const CompanySettingContent = ({ state, actions, embedded = false }: CompanySettingContentProps) => {
    const { open, companyUuid, homepageUuid, updateModal } = state;
    const companyAdMediaLinkSetting = state.companyAdMediaLinkSetting;
    const companyAdMediaInlineCreateForms = state.companyAdMediaInlineCreateForms;
    const companyInquiryAccessSetting = state.companyInquiryAccessSetting;
    const companyDailyReportSetting = state.companyDailyReportSetting;
    const companyAdMediaLinkActions = actions.companyAdMediaLinkSetting;
    const companyAdMediaInlineCreateFormsActions = actions.companyAdMediaInlineCreateForms;
    const companyInquiryAccessActions = actions.companyInquiryAccessSetting;
    const companyDailyReportActions = actions.companyDailyReportSetting;

    const hasHomepageContext = Boolean(homepageUuid || updateModal.selectedHomepageUuid);

    if (!open || !companyUuid || (!embedded && !hasHomepageContext)) return null;

    const profileSrc = updateModal.selectedCompany?.profileImageUrl || defaultProfile;
    const selectedCompanyName = updateModal.selectedCompany?.name ?? '업체 설정';
    const selectedHomepageName = updateModal.selectedHomepage?.name ?? '홈페이지';

    const renderAdMediaSection = () => (
        <Flex direction="column" gap={12}>
            <BasicContent.List>
                <BasicContent.Item
                    size="lg"
                    label="홈페이지 선택"
                    value={
                        <ButtonDropdown
                            value={companyAdMediaLinkSetting.selectedHomepageUuid}
                            onChange={companyAdMediaLinkActions.changeHomepageUuid}
                            widthPreset="fit"
                        >
                            <ButtonDropdown.Trigger
                                label={
                                    companyAdMediaLinkSetting.homepageOptions.find(
                                        (option) => option.value === companyAdMediaLinkSetting.selectedHomepageUuid
                                    )?.label ?? '홈페이지 선택'
                                }
                                variant="outline"
                                size="lg"
                                aria-label="홈페이지 선택"
                            />
                            <ButtonDropdown.Content placement="bottom-start">
                            {companyAdMediaLinkSetting.homepageOptions.map((option) => (
                                <ButtonDropdown.Item key={option.value} value={option.value}>
                                    {option.label}
                                </ButtonDropdown.Item>
                            ))}
                            </ButtonDropdown.Content>
                        </ButtonDropdown>
                    }
                />
            </BasicContent.List>

            {!companyAdMediaLinkSetting.selectedHomepageUuid ? (
                <Text as="p" size="sm" tone="muted">
                    광고 매체 연동을 관리할 홈페이지를 선택해 주세요.
                </Text>
            ) : (
                <Flex direction="column" gap={10}>
                    <Flex align="center" justify="space-between" gap={10}>
                        <Text as="h4" size="md" weight="semibold">
                            광고 매체 연동
                        </Text>
                        <WhiteButton size="sm" onClick={companyAdMediaInlineCreateFormsActions.add}>
                            + 매체 추가하기
                        </WhiteButton>
                    </Flex>

                    {companyAdMediaInlineCreateForms.forms.map((formItem) => (
                        <InlineCreateForm
                            key={formItem.key}
                            form={formItem}
                            mediaList={companyAdMediaLinkSetting.legacyState.mediaList}
                            onChangeMediaId={(value) =>
                                companyAdMediaInlineCreateFormsActions.changeMediaId(formItem.key, value)
                            }
                            onChangeField={(fieldKey, value) =>
                                companyAdMediaInlineCreateFormsActions.changeField(formItem.key, fieldKey, value)
                            }
                            onSubmit={() => {
                                void companyAdMediaInlineCreateFormsActions.submit(formItem.key);
                            }}
                            onRemove={() => companyAdMediaInlineCreateFormsActions.remove(formItem.key)}
                        />
                    ))}

                    {companyAdMediaLinkSetting.isLoading || companyAdMediaLinkSetting.isFetching ? (
                        <Text as="p" size="sm" tone="muted">
                            광고 매체 목록을 불러오는 중입니다.
                        </Text>
                    ) : companyAdMediaLinkSetting.isError ? (
                        <Flex align="center" justify="space-between" gap={8}>
                            <Text as="p" size="sm" tone="muted">
                                광고 매체 목록을 불러오지 못했습니다.
                            </Text>
                            <WhiteButton
                                size="sm"
                                onClick={() => {
                                    void companyAdMediaLinkActions.retry();
                                }}
                            >
                                다시 시도
                            </WhiteButton>
                        </Flex>
                    ) : companyAdMediaLinkSetting.list.length === 0 ? (
                        <Text as="p" size="sm" tone="muted">
                            연동된 매체가 없습니다.
                        </Text>
                    ) : (
                        <Flex direction="column" gap={8}>
                            {companyAdMediaLinkSetting.list.map((item) => {
                                const updateFormItem = companyAdMediaLinkSetting.adMediaInlineUpdateForms.find(
                                    (form) => form.id === item.id
                                );
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
                                    <Flex key={item.id} direction="column" gap={8}>
                                        <InlineUpdateForm
                                            mediaName={inlineUpdateForm.mediaName}
                                            isLoading={inlineUpdateForm.isLoading}
                                            fieldSpecs={inlineUpdateForm.fieldSpecs}
                                            fieldValues={inlineUpdateForm.fieldValues}
                                            isSaving={inlineUpdateForm.isSaving}
                                            canSave={inlineUpdateForm.canSave}
                                            onChangeField={(fieldKey, value) =>
                                                companyAdMediaLinkActions.changeAdMediaInlineUpdateField(
                                                    item.id,
                                                    fieldKey,
                                                    value
                                                )
                                            }
                                            onSubmit={() => {
                                                void companyAdMediaLinkActions.saveAdMediaInlineUpdate(item.id);
                                            }}
                                            onOpenCampaign={() => {
                                                companyAdMediaLinkActions.openCampaignModal(item);
                                            }}
                                        />
                                    </Flex>
                                );
                            })}
                        </Flex>
                    )}
                </Flex>
            )}
        </Flex>
    );

    const renderCompanyInfoPanel = () => (
        <>
            <BasicContent.Body>
                <BasicContent.Hero>
                    <BasicContent.HeroMeta>
                        <BasicContent.HeroIcon src={profileSrc} alt={selectedCompanyName} />
                        <BasicContent.HeroTitle>{selectedCompanyName}</BasicContent.HeroTitle>
                    </BasicContent.HeroMeta>
                    <BasicContent.HeroSuffix>{selectedHomepageName}</BasicContent.HeroSuffix>
                </BasicContent.Hero>

                <BasicContent.List>
                    <BasicContent.Item
                        size="lg"
                        label="업체명"
                        required
                        value={
                            <RoundedTextInput
                                {...updateModal.form.register('companyName')}
                                placeholder="업체명을 입력해주세요."
                            />
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="업종"
                        value={
                            <RoundedTextInput
                                {...updateModal.form.register('businessType')}
                                placeholder="업종을 입력해주세요."
                            />
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="업태"
                        value={
                            <RoundedTextInput
                                {...updateModal.form.register('businessItem')}
                                placeholder="업태를 입력해주세요."
                            />
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="대표명"
                        required
                        value={
                            <RoundedTextInput
                                {...updateModal.form.register('ceoName')}
                                placeholder="대표명을 입력해주세요."
                            />
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="업체 연락처"
                        required
                        value={
                            <RoundedTextInput
                                {...updateModal.phoneNumber}
                                onChange={(event) => {
                                    updateModal.phoneNumber.onChange(formatPhoneNumber(event.target.value));
                                }}
                                placeholder="업체 연락처를 입력해주세요."
                            />
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="업체 이메일"
                        required
                        value={
                            <RoundedTextInput
                                {...updateModal.form.register('email')}
                                placeholder="업체 이메일을 입력해주세요."
                            />
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="담당자명"
                        value={
                            <RoundedTextInput
                                {...updateModal.form.register('managerName')}
                                placeholder="담당자명을 입력해주세요."
                            />
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="담당자 연락처"
                        value={
                            <RoundedTextInput
                                {...updateModal.managerPhoneNumber}
                                onChange={(event) => {
                                    updateModal.managerPhoneNumber.onChange(formatPhoneNumber(event.target.value));
                                }}
                                placeholder="담당자 연락처를 입력해주세요."
                            />
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="담당자 이메일"
                        value={
                            <RoundedTextInput
                                {...updateModal.form.register('managerEmail')}
                                placeholder="담당자 이메일을 입력해주세요."
                            />
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="사업자등록번호"
                        value={
                            <RoundedTextInput
                                {...updateModal.businessNumber}
                                placeholder="사업자등록번호를 입력해주세요."
                            />
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="우편번호"
                        value={<RoundedTextInput {...updateModal.zipCode} placeholder="우편번호를 입력해주세요." />}
                    />
                    <BasicContent.Item
                        size="lg"
                        label="주소"
                        value={<RoundedTextInput {...updateModal.address} placeholder="주소를 입력해주세요." />}
                    />
                    <BasicContent.Item
                        size="lg"
                        label="라이브 여부"
                        value={
                            <RoundedSegmentTab
                                value={updateModal.isLive.value ? 'true' : 'false'}
                                onChange={(value) => updateModal.isLive.onChange(value === 'true')}
                            >
                                <RoundedSegmentTab.Item value="true">라이브</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="false">중단</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="마레 솔루션"
                        value={
                            <RoundedSegmentTab
                                value={updateModal.isMlSolution.value ? 'true' : 'false'}
                                onChange={(value) => updateModal.isMlSolution.onChange(value === 'true')}
                            >
                                <RoundedSegmentTab.Item value="true">활성화</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="false">비활성화</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="자동 보고"
                        value={
                            <RoundedSegmentTab
                                value={updateModal.isReportAuto.value ? 'true' : 'false'}
                                onChange={(value) => updateModal.isReportAuto.onChange(value === 'true')}
                            >
                                <RoundedSegmentTab.Item value="true">활성화</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="false">비활성화</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />
                    <BasicContent.Item
                        size="lg"
                        label="주간 자동 보고"
                        value={
                            <RoundedSegmentTab
                                value={updateModal.isWeeklyReportAuto.value ? 'true' : 'false'}
                                onChange={(value) => updateModal.isWeeklyReportAuto.onChange(value === 'true')}
                            >
                                <RoundedSegmentTab.Item value="true">활성화</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="false">비활성화</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />
                </BasicContent.List>
            </BasicContent.Body>

            <BasicContent.Footer>
                {!embedded ? (
                    <BasicContent.ActionButton variant="secondary" onClick={actions.close}>
                        닫기
                    </BasicContent.ActionButton>
                ) : null}
                <BasicContent.ActionButton
                    variant="primary"
                    disabled={updateModal.isCompanyDetailFetching || !updateModal.companyUpdateParam.uuid}
                    onClick={updateModal.form.handleSubmit(
                        updateModal.onSaveCompanyInfo,
                        updateModal.onInvalidCompanyInfo
                    )}
                >
                    저장하기
                </BasicContent.ActionButton>
            </BasicContent.Footer>
        </>
    );

    const renderInquiryAccessPanel = () => (
        <>
            <BasicContent.Body>
                <BasicContent.List>
                    <BasicContent.Item size="lg" label="회사명" value={companyInquiryAccessSetting.companyName || '-'} />

                    <BasicContent.Item
                        size="lg"
                        label="홈페이지 선택"
                        value={
                            <ButtonDropdown
                                value={companyInquiryAccessSetting.selectedHomepageUuid}
                                onChange={companyInquiryAccessActions.changeHomepageUuid}
                                widthPreset="fit"
                            >
                                <ButtonDropdown.Trigger
                                    label={
                                        companyInquiryAccessSetting.homepageOptions.find(
                                            (option) => option.value === companyInquiryAccessSetting.selectedHomepageUuid
                                        )?.label ?? '홈페이지 선택'
                                    }
                                    variant="outline"
                                    size="lg"
                                    aria-label="홈페이지 선택"
                                />
                                <ButtonDropdown.Content placement="bottom-start">
                                {companyInquiryAccessSetting.homepageOptions.map((option) => (
                                    <ButtonDropdown.Item key={option.value} value={option.value}>
                                        {option.label}
                                    </ButtonDropdown.Item>
                                ))}
                                </ButtonDropdown.Content>
                            </ButtonDropdown>
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="사이트 이름"
                        value={
                            <RoundedTextInput
                                value={companyInquiryAccessSetting.form.name}
                                onChange={(event) => companyInquiryAccessActions.changeField('name', event.target.value)}
                                placeholder="사이트 이름을 입력해주세요."
                            />
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="사이트 URL"
                        value={
                            <RoundedTextInput
                                value={companyInquiryAccessSetting.form.url}
                                onChange={(event) => companyInquiryAccessActions.changeField('url', event.target.value)}
                                placeholder="사이트 URL을 입력해주세요."
                            />
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="Git 저장소 URL"
                        value={
                            <RoundedTextInput
                                value={companyInquiryAccessSetting.form.gitRepositoryUrl}
                                onChange={(event) =>
                                    companyInquiryAccessActions.changeField('gitRepositoryUrl', event.target.value)
                                }
                                placeholder="Git 저장소 URL을 입력해주세요."
                            />
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="문의 알림 발송 방법"
                        value={
                            <RoundedSegmentTab
                                value={companyInquiryAccessSetting.form.deliveryType}
                                onChange={(next) =>
                                    companyInquiryAccessActions.changeField(
                                        'deliveryType',
                                        next as CompanyInquiryAccessSettingState['form']['deliveryType']
                                    )
                                }
                            >
                                <RoundedSegmentTab.Item value="SMS">SMS</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="KAKAO">카카오톡</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="NONE">보내지않기</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="발송 방식"
                        value={
                            <RoundedSegmentTab
                                value={companyInquiryAccessSetting.form.deliveryMethod}
                                onChange={(next) =>
                                    companyInquiryAccessActions.changeField(
                                        'deliveryMethod',
                                        next as CompanyInquiryAccessSettingState['form']['deliveryMethod']
                                    )
                                }
                            >
                                <RoundedSegmentTab.Item value="ALL">전체</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="SEQUENCE">순번</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="SEQUENCE_IGNORE_DUPLICATE">
                                    순번(중복무시)
                                </RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="NONE">없음</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="고객 안내톡 수신 여부"
                        value={
                            <RoundedSegmentTab
                                value={companyInquiryAccessSetting.form.clientDeliveryType}
                                onChange={(next) =>
                                    companyInquiryAccessActions.changeField(
                                        'clientDeliveryType',
                                        next as CompanyInquiryAccessSettingState['form']['clientDeliveryType']
                                    )
                                }
                            >
                                <RoundedSegmentTab.Item value="KAKAO">카카오톡</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="NONE">미수신</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="SMS">SMS</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="광고주용 카카오 템플릿 ID"
                        value={
                            <RoundedTextInput
                                value={companyInquiryAccessSetting.form.kakaoInquiryTemplateId}
                                onChange={(event) =>
                                    companyInquiryAccessActions.changeField('kakaoInquiryTemplateId', event.target.value)
                                }
                                placeholder="광고주용 카카오 템플릿 ID를 입력해주세요."
                            />
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="문의자용 카카오 템플릿 ID"
                        value={
                            <RoundedTextInput
                                value={companyInquiryAccessSetting.form.kakaoClientTemplateId}
                                onChange={(event) =>
                                    companyInquiryAccessActions.changeField('kakaoClientTemplateId', event.target.value)
                                }
                                placeholder="문의자용 카카오 템플릿 ID를 입력해주세요."
                            />
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="중복 문의 방지"
                        value={
                            <RoundedSegmentTab
                                value={companyInquiryAccessSetting.form.preventDuplicateInquiry ? 'true' : 'false'}
                                onChange={(next) =>
                                    companyInquiryAccessActions.changeField('preventDuplicateInquiry', next === 'true')
                                }
                            >
                                <RoundedSegmentTab.Item value="true">사용</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="false">미사용</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="중복 문의 기준 시간(초)"
                        value={
                            <RoundedTextInput
                                type="text"
                                inputMode="numeric"
                                value={String(companyInquiryAccessSetting.form.duplicateInquiryThresholdSecond)}
                                onChange={(event) =>
                                    companyInquiryAccessActions.changeIntegerField(
                                        'duplicateInquiryThresholdSecond',
                                        event.target.value
                                    )
                                }
                                placeholder="중복 문의 기준 시간을 입력해주세요."
                            />
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="스팸 문의 기준 건수"
                        value={
                            <RoundedTextInput
                                type="text"
                                inputMode="numeric"
                                value={String(companyInquiryAccessSetting.form.spamInquiryThresholdCount)}
                                onChange={(event) =>
                                    companyInquiryAccessActions.changeIntegerField(
                                        'spamInquiryThresholdCount',
                                        event.target.value
                                    )
                                }
                                placeholder="스팸 문의 기준 건수를 입력해주세요."
                            />
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="전 IP 스팸전화 차단"
                        value={
                            <RoundedSegmentTab
                                value={companyInquiryAccessSetting.form.preventSpamPhoneAllIps ? 'true' : 'false'}
                                onChange={(next) =>
                                    companyInquiryAccessActions.changeField('preventSpamPhoneAllIps', next === 'true')
                                }
                            >
                                <RoundedSegmentTab.Item value="true">사용</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="false">미사용</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="네이버 방문 차단 기준 건수"
                        value={
                            <RoundedTextInput
                                type="text"
                                inputMode="numeric"
                                value={String(companyInquiryAccessSetting.form.naverVisitBlockThresholdCount)}
                                onChange={(event) =>
                                    companyInquiryAccessActions.changeIntegerField(
                                        'naverVisitBlockThresholdCount',
                                        event.target.value
                                    )
                                }
                                placeholder="네이버 방문 차단 기준 건수를 입력해주세요."
                            />
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="상태"
                        value={
                            <RoundedSegmentTab
                                value={companyInquiryAccessSetting.form.status}
                                onChange={(next) =>
                                    companyInquiryAccessActions.changeField(
                                        'status',
                                        next as CompanyInquiryAccessSettingState['form']['status']
                                    )
                                }
                            >
                                <RoundedSegmentTab.Item value="ACTIVE">활성화</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="INACTIVE">비활성화</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />
                </BasicContent.List>

                {companyInquiryAccessSetting.isFetching ? (
                    <Text as="p" size="sm" tone="muted">
                        설정 정보를 불러오는 중입니다.
                    </Text>
                ) : null}
            </BasicContent.Body>

            <BasicContent.Footer>
                {!embedded ? (
                    <BasicContent.ActionButton variant="secondary" onClick={actions.close}>
                        닫기
                    </BasicContent.ActionButton>
                ) : null}
                <BasicContent.ActionButton
                    variant="primary"
                    disabled={companyInquiryAccessSetting.isSaving || !companyInquiryAccessSetting.selectedHomepageUuid}
                    onClick={() => {
                        void companyInquiryAccessActions.save();
                    }}
                >
                    저장하기
                </BasicContent.ActionButton>
            </BasicContent.Footer>
        </>
    );

    const renderDailyReportPanel = () => (
        <>
            <BasicContent.Body>
                <BasicContent.List>
                    <BasicContent.Item size="lg" label="회사명" value={companyDailyReportSetting.companyName || '-'} />

                    <BasicContent.Item
                        size="lg"
                        label="홈페이지 선택"
                        value={
                            <ButtonDropdown
                                value={companyDailyReportSetting.selectedHomepageUuid}
                                onChange={companyDailyReportActions.changeHomepageUuid}
                                widthPreset="fit"
                            >
                                <ButtonDropdown.Trigger
                                    label={
                                        companyDailyReportSetting.homepageOptions.find(
                                            (option) => option.value === companyDailyReportSetting.selectedHomepageUuid
                                        )?.label ?? '홈페이지 선택'
                                    }
                                    variant="outline"
                                    size="lg"
                                    aria-label="홈페이지 선택"
                                />
                                <ButtonDropdown.Content placement="bottom-start">
                                {companyDailyReportSetting.homepageOptions.map((option) => (
                                    <ButtonDropdown.Item key={option.value} value={option.value}>
                                        {option.label}
                                    </ButtonDropdown.Item>
                                ))}
                                </ButtonDropdown.Content>
                            </ButtonDropdown>
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="자동보고 활성화"
                        value={
                            <RoundedSegmentTab
                                value={companyDailyReportSetting.useStatus}
                                onChange={(next) =>
                                    companyDailyReportActions.changeUseStatus(
                                        next as CompanyDailyReportSettingState['useStatus']
                                    )
                                }
                            >
                                <RoundedSegmentTab.Item value="ACTIVE">활성화</RoundedSegmentTab.Item>
                                <RoundedSegmentTab.Item value="INACTIVE">비활성화</RoundedSegmentTab.Item>
                            </RoundedSegmentTab>
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="카카오톡 수신번호"
                        value={
                            <RoundedTextInput
                                value={companyDailyReportSetting.phoneNumber}
                                onChange={(event) => companyDailyReportActions.changePhoneNumber(event.target.value)}
                                placeholder="010-0000-0000,010-0000-0000"
                            />
                        }
                    />

                    <BasicContent.Item
                        size="lg"
                        label="보고 시간대 설정"
                        value={
                            <Flex direction="column" gap={10}>
                                <Text as="p" size="sm" tone="muted">
                                    보고 받을 시간대를 선택해주세요.
                                </Text>

                                <Grid columns={4} gap={8}>
                                    {HOURS.map((hour) => {
                                        const hourValue = String(hour);
                                        const isActive = companyDailyReportSetting.selectedHours.includes(hourValue);
                                        const Label = formatHourLabel(hour);

                                        if (isActive) {
                                            return (
                                                <BlackButton
                                                    key={hourValue}
                                                    size="sm"
                                                    onClick={() => companyDailyReportActions.toggleHour(hourValue)}
                                                >
                                                    {Label}
                                                </BlackButton>
                                            );
                                        }

                                        return (
                                            <WhiteButton
                                                key={hourValue}
                                                size="sm"
                                                onClick={() => companyDailyReportActions.toggleHour(hourValue)}
                                            >
                                                {Label}
                                            </WhiteButton>
                                        );
                                    })}
                                </Grid>

                                <Text as="p" size="sm" tone="muted">
                                    {companyDailyReportSetting.selectedHoursLabel}
                                </Text>
                            </Flex>
                        }
                    />
                </BasicContent.List>
            </BasicContent.Body>

            <BasicContent.Footer>
                {!embedded ? (
                    <BasicContent.ActionButton variant="secondary" onClick={actions.close}>
                        닫기
                    </BasicContent.ActionButton>
                ) : null}
                <BasicContent.ActionButton
                    variant="primary"
                    disabled={companyDailyReportSetting.isSaving || !companyDailyReportSetting.selectedHomepageUuid}
                    onClick={() => {
                        void companyDailyReportActions.save();
                    }}
                >
                    저장하기
                </BasicContent.ActionButton>
            </BasicContent.Footer>
        </>
    );

    const renderAdMediaModals = () => (
        <>
            <BasicModal
                open={companyAdMediaLinkSetting.linkDeleteModal}
                onChange={companyAdMediaLinkActions.closeDeleteModal}
                width={360}
                content={
                    <BasicConfirm
                        title={
                            <>
                                매체를 삭제하시겠습니까?
                            </>
                        }
                        description={<>삭제 후에는 복구할 수 없습니다.</>}
                        cancelText="취소"
                        confirmText={companyAdMediaLinkSetting.isAdMediaDeleteSaving ? '삭제중...' : '삭제'}
                        onCancel={companyAdMediaLinkActions.closeDeleteModal}
                        onConfirm={companyAdMediaLinkActions.confirmAdMediaDelete}
                    />
                }
            />

            <BasicModal
                open={companyAdMediaLinkSetting.campaignModal}
                onChange={companyAdMediaLinkActions.closeCampaignModal}
                width={560}
                maxHeight="80vh"
                content={
                    <BasicContent>
                        <BasicContent.Header>
                            <BasicContent.Title>캠페인 등록하기</BasicContent.Title>
                            <BasicContent.CloseButton onClick={companyAdMediaLinkActions.closeCampaignModal} />
                        </BasicContent.Header>

                        <BasicContent.Body>
                            <Flex direction="column" gap={12}>
                                <RoundedTextInput
                                    value={companyAdMediaLinkSetting.campaignSearchQuery}
                                    onChange={(event) =>
                                        companyAdMediaLinkActions.changeCampaignSearchQuery(event.target.value)
                                    }
                                    placeholder="캠페인명 또는 캠페인 ID 검색"
                                />

                                <Text as="p" size="sm" tone="muted">
                                    선택 {companyAdMediaLinkSetting.campaignSelectedIds.length}개
                                </Text>

                                {companyAdMediaLinkSetting.isCampaignRemoteFetching ? (
                                    <Text as="p" size="sm" tone="muted">
                                        캠페인 목록을 불러오는 중입니다.
                                    </Text>
                                ) : companyAdMediaLinkSetting.isCampaignRemoteError ? (
                                    <Flex align="center" justify="space-between" gap={8}>
                                        <Text as="p" size="sm" tone="muted">
                                            캠페인 목록을 불러오지 못했습니다.
                                        </Text>
                                        <WhiteButton
                                            size="sm"
                                            onClick={() => {
                                                void companyAdMediaLinkActions.retryCampaignRemote();
                                            }}
                                        >
                                            다시 시도
                                        </WhiteButton>
                                    </Flex>
                                ) : companyAdMediaLinkSetting.filteredCampaignRemoteList.length === 0 ? (
                                    <Text as="p" size="sm" tone="muted">
                                        {companyAdMediaLinkSetting.campaignSearchQuery.trim().length > 0
                                            ? '검색 결과가 없습니다.'
                                            : '조회 가능한 캠페인이 없습니다.'}
                                    </Text>
                                ) : (
                                    <Flex direction="column" gap={8}>
                                        {companyAdMediaLinkSetting.filteredCampaignRemoteList.map((campaign) => {
                                            const campaignId = String(campaign.campaignId);
                                            const isSelected =
                                                companyAdMediaLinkSetting.campaignSelectedIds.includes(campaignId);

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

                                                        {isSelected ? (
                                                            <BlackButton
                                                                size="sm"
                                                                onClick={() =>
                                                                    companyAdMediaLinkActions.toggleCampaignSelection(
                                                                        campaign
                                                                    )
                                                                }
                                                            >
                                                                선택됨
                                                            </BlackButton>
                                                        ) : (
                                                            <WhiteButton
                                                                size="sm"
                                                                onClick={() =>
                                                                    companyAdMediaLinkActions.toggleCampaignSelection(
                                                                        campaign
                                                                    )
                                                                }
                                                            >
                                                                선택
                                                            </WhiteButton>
                                                        )}
                                                    </Flex>
                                                </Box>
                                            );
                                        })}
                                    </Flex>
                                )}
                            </Flex>
                        </BasicContent.Body>

                        <BasicContent.Footer>
                            <BasicContent.ActionButton
                                variant="secondary"
                                onClick={companyAdMediaLinkActions.closeCampaignModal}
                            >
                                취소
                            </BasicContent.ActionButton>
                            <BasicContent.ActionButton
                                variant="primary"
                                disabled={companyAdMediaLinkSetting.isCampaignUpdating}
                                onClick={() => {
                                    void companyAdMediaLinkActions.saveCampaignSelection();
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

    const renderTabPanel = () => {
        if (updateModal.tabValue === 'company_info') {
            return renderCompanyInfoPanel();
        }

        if (updateModal.tabValue === 'ad_media_link') {
            return (
                <BasicContent.Body>
                    {renderAdMediaSection()}
                </BasicContent.Body>
            );
        }

        if (updateModal.tabValue === 'inquiry_access') {
            return renderInquiryAccessPanel();
        }

        if (updateModal.tabValue === 'report') {
            return renderDailyReportPanel();
        }

        return (
            <Box border="1px dashed var(--granter-gray-300)" borderRadius={12} minHeight={220}>
                <Flex align="center" justify="center" height="100%">
                    <Text size="sm" tone="muted">
                        해당 탭 UI 없음
                    </Text>
                </Flex>
            </Box>
        );
    };

    return (
        <BasicContent>
            {!embedded ? (
                <BasicContent.Header>
                    <BasicContent.Title>업체 설정</BasicContent.Title>
                    <BasicContent.CloseButton onClick={actions.close} />
                </BasicContent.Header>
            ) : null}

            {updateModal.isCheckingAdMediaLink ? (
                <BasicContent.Body>
                    <Flex direction="column" gap={8} minHeight={240}>
                        <Text as="p" size="lg" weight="semibold">
                            광고 매체 연동 여부를 확인하고 있습니다.
                        </Text>
                        <Text as="p" size="sm" tone="muted">
                            최초 1회만 점검하며, 완료 후 바로 설정 화면으로 이동합니다.
                        </Text>
                    </Flex>
                </BasicContent.Body>
            ) : updateModal.requiresAdMediaStepper ? (
                <>
                    <BasicContent.Body>
                        <BasicContent.Alert tone="neutral">
                            <BasicContent.AlertMain>
                                <BasicContent.AlertText>
                                    광고 매체가 아직 연동되지 않았습니다. 먼저 광고 매체를 1개 이상 연동하세요.
                                </BasicContent.AlertText>
                            </BasicContent.AlertMain>
                        </BasicContent.Alert>

                        {renderAdMediaSection()}
                    </BasicContent.Body>

                    <BasicContent.Footer>
                        {!embedded ? (
                            <BasicContent.ActionButton variant="secondary" onClick={actions.close}>
                                닫기
                            </BasicContent.ActionButton>
                        ) : null}
                        <BasicContent.ActionButton
                            variant="primary"
                            disabled={
                                !updateModal.selectedHomepageUuid ||
                                updateModal.isSelectedHomepageAdMediaFetching ||
                                !updateModal.canContinueAfterStepper
                            }
                            onClick={updateModal.onStepperDone}
                        >
                            연동 완료 후 설정 계속
                        </BasicContent.ActionButton>
                    </BasicContent.Footer>
                </>
            ) : (
                <>
                    {!embedded ? (
                        <Flex justify="center">
                            <UnderlineTab
                                value={updateModal.tabValue}
                                scrollable
                                onChange={(value) =>
                                    updateModal.setTabValue(
                                        value as 'company_info' | 'ad_media_link' | 'inquiry_access' | 'report' | 'alarm'
                                    )
                                }
                            >
                                <UnderlineTab.Item value="company_info">업체 설정</UnderlineTab.Item>
                                <UnderlineTab.Item value="ad_media_link">광고 매체 연동</UnderlineTab.Item>
                                <UnderlineTab.Item value="inquiry_access">문의 · 접속 설정</UnderlineTab.Item>
                                <UnderlineTab.Item value="report">일일보고 설정</UnderlineTab.Item>
                                <UnderlineTab.Item value="alarm">알림 설정</UnderlineTab.Item>
                            </UnderlineTab>
                        </Flex>
                    ) : null}

                    {renderTabPanel()}
                </>
            )}

            {updateModal.requiresAdMediaStepper || updateModal.tabValue === 'ad_media_link' ? renderAdMediaModals() : null}
        </BasicContent>
    );
};

export default CompanySettingContent;
