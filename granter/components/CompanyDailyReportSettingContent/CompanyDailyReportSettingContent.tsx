import React from 'react';
import classNames from 'classnames';
import { FiChevronDown } from 'react-icons/fi';
import type {
    CompanyDailyReportSettingActions,
    CompanyDailyReportSettingState,
} from '@/hooks/feature/useDailyReportUpdate';
import BasicContent from '../BasicContent/BasicContent';
import RoundedSegmentTab from '../RoundedSegmentTab/RoundedSegmentTab';
import RoundedTextInput from '../RoundedTextInput/RoundedTextInput';
import ButtonDropdown from '../ButtonDropdown/ButtonDropdown';
import styles from './CompanyDailyReportSettingContent.module.scss';

const HOURS = Array.from({ length: 24 }, (_, index) => index);

const formatHourLabel = (hour: number) => `${String(hour).padStart(2, '0')}시`;

export type CompanyDailyReportSettingContentProps = {
    state: CompanyDailyReportSettingState;
    actions: CompanyDailyReportSettingActions;
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

const CompanyDailyReportSettingContent = ({ state, actions, className }: CompanyDailyReportSettingContentProps) => (
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
                    label="자동보고 활성화"
                    value={
                        <RoundedSegmentTab
                            value={state.useStatus}
                            onChange={(next) =>
                                actions.changeUseStatus(next as CompanyDailyReportSettingState['useStatus'])
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
                            value={state.phoneNumber}
                            onChange={(event) => actions.changePhoneNumber(event.target.value)}
                            placeholder="010-0000-0000,010-0000-0000"
                        />
                    }
                />

                <BasicContent.Item
                    size="lg"
                    label="보고 시간대 설정"
                    value={
                        <div className={styles.HourSection}>
                            <p className={styles.HourGuide}>보고 받을 시간대를 선택해주세요.</p>

                            <div className={styles.HourGrid}>
                                {HOURS.map((hour) => {
                                    const hourValue = String(hour);
                                    const isActive = state.selectedHours.includes(hourValue);

                                    return (
                                        <button
                                            key={hourValue}
                                            type="button"
                                            className={styles.HourButton}
                                            data-active={isActive ? 'true' : 'false'}
                                            onClick={() => actions.toggleHour(hourValue)}
                                        >
                                            {formatHourLabel(hour)}
                                        </button>
                                    );
                                })}
                            </div>

                            <p className={styles.HourSummary}>{state.selectedHoursLabel}</p>
                        </div>
                    }
                />
            </BasicContent.List>
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

export default CompanyDailyReportSettingContent;
