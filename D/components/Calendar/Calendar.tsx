import React from 'react';
import type { DayPickerProps } from 'react-day-picker';

import BaseCalendar, { type BaseCalendarExtraProps } from './components/BaseCalendar/BaseCalendar';

export type CalendarVariant = 'base';

/**
 * ✅ Input 패턴과 동일하게:
 * - 공통 props를 명시
 * - variant + common + extra 로 조합
 */
export type CalendarCommonProps = DayPickerProps;

export type CalendarProps = { variant: 'base' } & CalendarCommonProps & BaseCalendarExtraProps;

const Calendar: React.FC<CalendarProps> = (props) => {
    const { variant, ...rest } = props;

    if (variant === 'base') {
        return <BaseCalendar {...rest} />;
    }

    return <BaseCalendar {...rest} />;
};

export default Calendar;
