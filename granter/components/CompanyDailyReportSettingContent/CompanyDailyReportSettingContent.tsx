import React from 'react';
import classNames from 'classnames';
import type {
    CompanyDailyReportSettingActions,
    CompanyDailyReportSettingState,
} from '@/hooks/feature/useDailyReportUpdate';
import BasicContent from '../BasicContent/BasicContent';
import RoundedSegmentTab from '../RoundedSegmentTab/RoundedSegmentTab';
import RoundedTextInput from '../RoundedTextInput/RoundedTextInput';
import TimeSlotSelector from '../TimeSlotSelector/TimeSlotSelector';
import styles from './CompanyDailyReportSettingContent.module.scss';

const HOURS = Array.from({ length: 24 }, (_, index) => index);

const formatHourLabel = (hour: number) => `${String(hour).padStart(2, '0')}시`;
const HOUR_OPTIONS = HOURS.map((hour) => ({ value: String(hour), label: formatHourLabel(hour) }));

export type CompanyDailyReportSettingContentProps = {
    state: CompanyDailyReportSettingState;
    actions: CompanyDailyReportSettingActions;
    className?: string;
};

const CompanyDailyReportSettingContent = ({ state, actions, className }: CompanyDailyReportSettingContentProps) => (
    <>
        <BasicContent.Body className={classNames(styles.Body, className)}>
            <BasicContent.List>
                <BasicContent.Item size="lg" label="회사명" value={state.companyName || '-'} />
                <BasicContent.Item size="lg" label="설정 기준" value="업체 기준" />

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
                        <TimeSlotSelector
                            options={HOUR_OPTIONS}
                            selectedValues={state.selectedHours}
                            onToggle={actions.toggleHour}
                            guide="보고 받을 시간대를 선택해주세요."
                            summary={state.selectedHoursLabel}
                        />
                    }
                />
            </BasicContent.List>
        </BasicContent.Body>

        <BasicContent.Footer className={styles.SingleActionFooter}>
            <BasicContent.ActionButton
                variant="primary"
                className={styles.SingleActionButton}
                disabled={state.isSaving || !state.companyUuid}
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
