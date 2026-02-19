import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import type { EventContentArg } from '@fullcalendar/core/index.js';
import { CiCalendarDate, CiClock2, CiUser } from 'react-icons/ci';

import Text from '../../../Text/Text';
import { formatMeridiemKoreanTimeRange } from '../../../shared/utils/dateFilter/dateFilter';
import styles from './CalendarTooltip.module.scss';

type CalendarTooltipProps = {
    arg?: EventContentArg;
    children: React.ReactNode;
};

type EventExtendedProps = {
    category?: string;
    status?: string;
    marketerName?: string;
    designerName?: string;
    requestDateTime?: string;
    startLineDateTime?: string;
    finishLineDateTime?: string | null;
};

const CalendarTooltip = ({ arg, children }: CalendarTooltipProps) => {
    const ext = (arg?.event.extendedProps ?? {}) as EventExtendedProps;
    const title = arg?.event.title ?? '-';
    const category = ext.category ?? '';
    const status = ext.status ?? '';
    const marketerName = ext.marketerName ?? '-';
    const designerName = ext.designerName ?? '-';
    const startValue = ext.startLineDateTime ?? ext.requestDateTime ?? arg?.event.start;
    const endValue = ext.finishLineDateTime ?? arg?.event.end;
    const timeRange = formatMeridiemKoreanTimeRange(startValue, endValue);

    return (
        <Tooltip.Provider delayDuration={100} skipDelayDuration={200}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>

                <Tooltip.Portal>
                    <Tooltip.Content
                        className={styles.tooltip}
                        side="top"
                        align="start"
                        sideOffset={8}
                        collisionPadding={12}
                    >
                        <div className={styles.title}>{title}</div>

                        {/* <div className={styles.badgeRow}>
                            {category ? (
                                <BaseChip radius={4} padding={{ x: 6, y: 2 }} bgColor="#F0F2F5">
                                    {category}
                                </BaseChip>
                            ) : null}
                            {status ? (
                                <BaseChip radius={4} padding={{ x: 6, y: 2 }} bgColor="#FFEFD5">
                                    {status}
                                </BaseChip>
                            ) : null}
                        </div> */}

                        <div className={styles.row}>
                            <CiClock2 size={16} className={styles.icon} />
                            <Text className={styles.text}>{timeRange}</Text>
                        </div>

                        <div className={styles.row}>
                            <CiUser size={16} className={styles.icon} />
                            <Text className={styles.text}>담당 마케터: {marketerName}</Text>
                        </div>

                        <div className={styles.row}>
                            <CiCalendarDate size={16} className={styles.icon} />
                            <Text className={styles.text}>담당 디자이너: {designerName}</Text>
                        </div>

                        <Tooltip.Arrow className={styles.arrow} />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};

export default CalendarTooltip;
