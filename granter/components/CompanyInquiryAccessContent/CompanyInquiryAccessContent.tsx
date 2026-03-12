import React from 'react';
import classNames from 'classnames';
import { FiChevronDown } from 'react-icons/fi';
import type {
    CompanyInquiryAccessSettingActions,
    CompanyInquiryAccessSettingState,
} from '@/hooks/feature/useInquirySettingUpdate';
import BasicContent from '../BasicContent/BasicContent';
import RoundedSegmentTab from '../RoundedSegmentTab/RoundedSegmentTab';
import RoundedTextInput from '../RoundedTextInput/RoundedTextInput';
import ButtonDropdown from '../ButtonDropdown/ButtonDropdown';
import styles from './CompanyInquiryAccessContent.module.scss';

export type CompanyInquiryAccessContentProps = {
    state: CompanyInquiryAccessSettingState;
    actions: CompanyInquiryAccessSettingActions;
    className?: string;
};

type HomepageSelectProps = {
    value: string;
    options: Array<{ value: string; label: string }>;
    onChange: (next: string) => void;
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

const CompanyInquiryAccessContent = ({ state, actions, className }: CompanyInquiryAccessContentProps) => (
    <>
        <BasicContent.Body className={classNames(styles.Body, className)}>
            <BasicContent.List>
                <BasicContent.Item size="lg" label="회사명" value={state.companyName || '-'} />

                <BasicContent.Item
                    size="lg"
                    label="홈페이지 선택"
                    value={
                        <HomepageSelect
                            value={state.selectedHomepageUuid}
                            options={state.homepageOptions}
                            onChange={actions.changeHomepageUuid}
                        />
                    }
                />

                <BasicContent.Item
                    size="lg"
                    label="사이트 이름"
                    value={
                        <RoundedTextInput
                            value={state.form.name}
                            onChange={(event) => actions.changeField('name', event.target.value)}
                            placeholder="사이트 이름을 입력해주세요."
                        />
                    }
                />

                <BasicContent.Item
                    size="lg"
                    label="사이트 URL"
                    value={
                        <RoundedTextInput
                            value={state.form.url}
                            onChange={(event) => actions.changeField('url', event.target.value)}
                            placeholder="사이트 URL을 입력해주세요."
                        />
                    }
                />

                <BasicContent.Item
                    size="lg"
                    label="Git 저장소 URL"
                    value={
                        <RoundedTextInput
                            value={state.form.gitRepositoryUrl}
                            onChange={(event) => actions.changeField('gitRepositoryUrl', event.target.value)}
                            placeholder="Git 저장소 URL을 입력해주세요."
                        />
                    }
                />

                <BasicContent.Item
                    size="lg"
                    label="문의 알림 발송 방법"
                    value={
                        <RoundedSegmentTab
                            value={state.form.deliveryType}
                            onChange={(next) =>
                                actions.changeField('deliveryType', next as CompanyInquiryAccessSettingState['form']['deliveryType'])
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
                            value={state.form.deliveryMethod}
                            onChange={(next) =>
                                actions.changeField(
                                    'deliveryMethod',
                                    next as CompanyInquiryAccessSettingState['form']['deliveryMethod']
                                )
                            }
                        >
                            <RoundedSegmentTab.Item value="ALL">전체</RoundedSegmentTab.Item>
                            <RoundedSegmentTab.Item value="SEQUENCE">순번</RoundedSegmentTab.Item>
                            <RoundedSegmentTab.Item value="SEQUENCE_IGNORE_DUPLICATE">순번(중복무시)</RoundedSegmentTab.Item>
                            <RoundedSegmentTab.Item value="NONE">없음</RoundedSegmentTab.Item>
                        </RoundedSegmentTab>
                    }
                />

                <BasicContent.Item
                    size="lg"
                    label="고객 안내톡 수신 여부"
                    value={
                        <RoundedSegmentTab
                            value={state.form.clientDeliveryType}
                            onChange={(next) =>
                                actions.changeField(
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
                            value={state.form.kakaoInquiryTemplateId}
                            onChange={(event) => actions.changeField('kakaoInquiryTemplateId', event.target.value)}
                            placeholder="광고주용 카카오 템플릿 ID를 입력해주세요."
                        />
                    }
                />

                <BasicContent.Item
                    size="lg"
                    label="문의자용 카카오 템플릿 ID"
                    value={
                        <RoundedTextInput
                            value={state.form.kakaoClientTemplateId}
                            onChange={(event) => actions.changeField('kakaoClientTemplateId', event.target.value)}
                            placeholder="문의자용 카카오 템플릿 ID를 입력해주세요."
                        />
                    }
                />

                <BasicContent.Item
                    size="lg"
                    label="중복 문의 방지"
                    value={
                        <RoundedSegmentTab
                            value={state.form.preventDuplicateInquiry ? 'true' : 'false'}
                            onChange={(next) => actions.changeField('preventDuplicateInquiry', next === 'true')}
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
                            value={String(state.form.duplicateInquiryThresholdSecond)}
                            onChange={(event) =>
                                actions.changeIntegerField('duplicateInquiryThresholdSecond', event.target.value)
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
                            value={String(state.form.spamInquiryThresholdCount)}
                            onChange={(event) => actions.changeIntegerField('spamInquiryThresholdCount', event.target.value)}
                            placeholder="스팸 문의 기준 건수를 입력해주세요."
                        />
                    }
                />

                <BasicContent.Item
                    size="lg"
                    label="전 IP 스팸전화 차단"
                    value={
                        <RoundedSegmentTab
                            value={state.form.preventSpamPhoneAllIps ? 'true' : 'false'}
                            onChange={(next) => actions.changeField('preventSpamPhoneAllIps', next === 'true')}
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
                            value={String(state.form.naverVisitBlockThresholdCount)}
                            onChange={(event) =>
                                actions.changeIntegerField('naverVisitBlockThresholdCount', event.target.value)
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
                            value={state.form.status}
                            onChange={(next) =>
                                actions.changeField('status', next as CompanyInquiryAccessSettingState['form']['status'])
                            }
                        >
                            <RoundedSegmentTab.Item value="ACTIVE">활성화</RoundedSegmentTab.Item>
                            <RoundedSegmentTab.Item value="INACTIVE">비활성화</RoundedSegmentTab.Item>
                        </RoundedSegmentTab>
                    }
                />
            </BasicContent.List>

            {state.isFetching ? <p className={styles.FetchingText}>설정 정보를 불러오는 중입니다.</p> : null}
        </BasicContent.Body>

        <BasicContent.Footer className={styles.SingleActionFooter}>
            <BasicContent.ActionButton
                variant="primary"
                className={styles.SingleActionButton}
                disabled={state.isSaving || !state.selectedHomepageUuid}
                onClick={() => {
                    void actions.save();
                }}
            >
                저장하기
            </BasicContent.ActionButton>
        </BasicContent.Footer>
    </>
);

export default CompanyInquiryAccessContent;
