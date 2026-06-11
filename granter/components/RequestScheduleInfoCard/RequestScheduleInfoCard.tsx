import React from 'react';
import classNames from 'classnames';
import { FiMessageSquare } from 'react-icons/fi';
import RequestDescriptionBox from '../RequestDescriptionBox/RequestDescriptionBox';
import Text from '../Text/Text';
import styles from './RequestScheduleInfoCard.module.scss';

export type RequestScheduleInfoCardProps = {
    className?: string;
    title?: React.ReactNode;
    icon?: React.ReactNode;
    hideSchedule?: boolean;
    startDateTime?: string | Date | null;
    startLabel: React.ReactNode;
    startBadge?: React.ReactNode;
    startValue: React.ReactNode;
    endDateTime?: string | Date | null;
    endLabel: React.ReactNode;
    endBadge?: React.ReactNode;
    endValue: React.ReactNode;
    descriptionLabel?: React.ReactNode;
    descriptionIcon?: React.ReactNode;
    description: React.ReactNode;
    collapsibleDescription?: boolean;
    descriptionLineClamp?: number;
    moreLabel?: React.ReactNode;
    lessLabel?: React.ReactNode;
};

export type RequestScheduleTimelineProps = Pick<
    RequestScheduleInfoCardProps,
    | 'startDateTime'
    | 'startLabel'
    | 'startBadge'
    | 'startValue'
    | 'endDateTime'
    | 'endLabel'
    | 'endBadge'
    | 'endValue'
> & {
    className?: string;
};

const isEmpty = (value: React.ReactNode) => value === null || value === undefined || value === '';

const renderEmpty = (value: React.ReactNode) => (isEmpty(value) ? '-' : value);

const parseScheduleTime = (value?: string | Date | null) => {
    if (!value) return null;

    const date = value instanceof Date ? value : new Date(String(value).replace(' ', 'T'));
    const time = date.getTime();

    return Number.isFinite(time) ? time : null;
};

const getScheduleProgress = (startTime: number | null, endTime: number | null, nowTime: number) => {
    if (startTime === null || endTime === null || endTime <= startTime) {
        return { state: 'empty', ratio: 0 };
    }

    if (nowTime < startTime) {
        return { state: 'before', ratio: 0 };
    }

    if (nowTime >= endTime) {
        return { state: 'after', ratio: 1 };
    }

    return {
        state: 'active',
        ratio: Math.max(0, Math.min(1, (nowTime - startTime) / (endTime - startTime))),
    };
};

export const RequestScheduleTimeline = ({
    className,
    startDateTime,
    startLabel,
    startBadge,
    startValue,
    endDateTime,
    endLabel,
    endBadge,
    endValue,
}: RequestScheduleTimelineProps) => {
    const [nowTime, setNowTime] = React.useState(() => Date.now());
    const startTime = React.useMemo(() => parseScheduleTime(startDateTime), [startDateTime]);
    const endTime = React.useMemo(() => parseScheduleTime(endDateTime), [endDateTime]);
    const scheduleProgress = getScheduleProgress(startTime, endTime, nowTime);
    const timelineStyle = {
        '--request-schedule-progress-percent': `${Math.round(scheduleProgress.ratio * 10000) / 100}%`,
    } as React.CSSProperties;

    React.useEffect(() => {
        if (startTime === null || endTime === null) return undefined;

        const intervalId = window.setInterval(() => setNowTime(Date.now()), 60 * 1000);
        return () => window.clearInterval(intervalId);
    }, [endTime, startTime]);

    return (
        <div className={classNames(styles.ScheduleRow, className)}>
            <div className={styles.ScheduleEndpoint}>
                <div className={styles.ScheduleLabelLine}>
                    <span>{startLabel}</span>
                    {startBadge ? <em>{startBadge}</em> : null}
                </div>
                <strong>{renderEmpty(startValue)}</strong>
            </div>

            <div
                className={styles.Timeline}
                style={timelineStyle}
                data-state={scheduleProgress.state}
                aria-hidden="true"
            >
                <span className={styles.TimelineEndpoint} />
                <span className={styles.TimelineTrack}>
                    <i className={styles.TimelineFill} />
                    <i className={styles.TimelineRest} />
                    <i className={styles.TimelineCurrent} />
                </span>
                <span className={styles.TimelineEndpoint} />
            </div>

            <div className={classNames(styles.ScheduleEndpoint, styles.ScheduleEndpointEnd)}>
                <div className={styles.ScheduleLabelLine}>
                    <span>{endLabel}</span>
                    {endBadge ? <em>{endBadge}</em> : null}
                </div>
                <strong>{renderEmpty(endValue)}</strong>
            </div>
        </div>
    );
};

const RequestScheduleInfoCard = ({
    className,
    title = '요청 정보',
    icon,
    hideSchedule = false,
    startDateTime,
    startLabel,
    startBadge,
    startValue,
    endDateTime,
    endLabel,
    endBadge,
    endValue,
    descriptionLabel = '설명',
    descriptionIcon = <FiMessageSquare aria-hidden="true" />,
    description,
    collapsibleDescription = true,
    descriptionLineClamp = 3,
    moreLabel = '더보기',
    lessLabel = '접기',
}: RequestScheduleInfoCardProps) => (
    <section className={classNames(styles.Root, className)}>
        <div className={styles.Header}>
            {icon ? (
                <span className={styles.IconBox} aria-hidden="true">
                    {icon}
                </span>
            ) : null}
            <Text size="lg" weight="medium">
                {title}
            </Text>
        </div>

        {hideSchedule ? null : (
            <RequestScheduleTimeline
                startDateTime={startDateTime}
                startLabel={startLabel}
                startBadge={startBadge}
                startValue={startValue}
                endDateTime={endDateTime}
                endLabel={endLabel}
                endBadge={endBadge}
                endValue={endValue}
            />
        )}

        <RequestDescriptionBox
            label={descriptionLabel}
            icon={descriptionIcon}
            description={description}
            collapsible={collapsibleDescription}
            lineClamp={descriptionLineClamp}
            moreLabel={moreLabel}
            lessLabel={lessLabel}
        />
    </section>
);

export default RequestScheduleInfoCard;
