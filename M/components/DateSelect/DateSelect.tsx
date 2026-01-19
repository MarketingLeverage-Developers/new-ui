import RoundedDropDown from '@/shared/primitives/RoundedDropDown/RoundedDropDown';
import React from 'react';
import Flex from '@/shared/primitives/Flex/Flex';
import { MdCalendarToday } from 'react-icons/md';
import { formatDate } from '@/shared/utils/utils';
import type { DateRange } from 'react-day-picker';

const datePeriodMapper: Record<string, string> = {
    '1m': '최근 1개월',
    '3m': '최근 3개월',
    '6m': '최근 6개월',
};

type Props = {
    startDate: string | null;
    endDate: string | null;
    onClick: () => void;
};

export const DateSelect = ({ startDate, endDate, onClick }: Props) => {
    // const [period, setPeriod] = useState('1m');

    const dateRange: DateRange | undefined =
        startDate && endDate
            ? {
                  from: new Date(startDate),
                  to: new Date(endDate),
              }
            : undefined;

    // const selectHandler = (val: string) => {
    //     const today = new Date();
    //     let from: Date | undefined;

    //     if (val === '7d') {
    //         from = new Date(today);
    //         from.setDate(today.getDate() - 6);
    //     } else if (val.endsWith('m')) {
    //         const months = parseInt(val);
    //         from = new Date(today);
    //         from.setMonth(today.getMonth() - months);
    //     }

    //     const newRange = from ? { from, to: today } : undefined;
    //     onChange(newRange, val);
    //     if (val) setPeriod(val);
    // };

    // const handleDateRangeChange = (range: DateRange | undefined) => {
    //     onChange(range, 'custom');
    //     setPeriod('custom');
    // };

    // 초기설정: URL에 날짜가 없으면 1개월로 설정
    // useEffect(() => {
    //     if (!startDate || !endDate) {
    //         selectHandler('1m');
    //     }
    // }, []);

    return (
        <>
            <RoundedDropDown>
                <RoundedDropDown.Trigger onClick={() => onClick()}>
                    <Flex align="center" gap={4}>
                        <MdCalendarToday />
                        <span>
                            {`${formatDate(dateRange?.from, 'yyyy-mm-dd (dow)')} - ${formatDate(
                                dateRange?.to,
                                'yyyy-mm-dd (dow)'
                            )}`}
                        </span>
                    </Flex>
                </RoundedDropDown.Trigger>
            </RoundedDropDown>
        </>
    );
};
