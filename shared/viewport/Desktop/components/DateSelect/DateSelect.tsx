import DoubleDatePicker from '../../../../../DoubleDatePicker/DoubleDatePicker';
import RoundedSelect from '../../../../../RoundedSelect/RoundedSelect';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Flex from '../../../../../Flex/Flex';
import { formatDate } from '../../../../utils/utils';
import type { DateRange } from 'react-day-picker';
import RangeDatePicker from '../../../../../RangeDatePicker/RangeDatePicker';
import BasicDropDown from '../../../../../BasicDropDown/BasicDropDown';
import { BaseTooltip } from '../../../../../BaseTooltip/BaseTooltip';
import { useDropdown } from '../../../../headless/Dropdown/Dropdown';

const datePeriodMapper: Record<string, string> = {
    '1m': '최근 1개월',
    '3m': '최근 3개월',
    '6m': '최근 6개월',
};

type Props = {
    startDate: string | null;
    endDate: string | null;
    onChange: (range: DateRange | undefined, period?: string) => void;
    onClose?: (range: DateRange | undefined) => void;
    type?: 'basic' | 'preset';
};

type DateSelectDropdownCloseObserverProps = {
    onClose: ((range: DateRange | undefined) => void) | undefined;
    rangeRef: React.MutableRefObject<DateRange | undefined>;
};

const DateSelectDropdownCloseObserver = ({ onClose, rangeRef }: DateSelectDropdownCloseObserverProps) => {
    const { isOpen } = useDropdown();
    const prevIsOpenRef = useRef(false);

    useEffect(() => {
        if (prevIsOpenRef.current && !isOpen) {
            onClose?.(rangeRef.current);
        }
        prevIsOpenRef.current = isOpen;
    }, [isOpen, onClose, rangeRef]);

    return null;
};

export const DateSelect = ({ startDate, endDate, onChange, onClose, type = 'basic' }: Props) => {
    const [period, setPeriod] = useState('1m');
    const selectedRangeRef = useRef<DateRange | undefined>(undefined);

    const dateRange: DateRange | undefined = useMemo(
        () =>
            startDate && endDate
                ? {
                      from: new Date(startDate),
                      to: new Date(endDate),
                  }
                : undefined,
        [startDate, endDate]
    );

    useEffect(() => {
        selectedRangeRef.current = dateRange;
    }, [dateRange]);

    const updateSelectedRange = (range: DateRange | undefined) => {
        selectedRangeRef.current = range;
    };

    const selectHandler = (val: string) => {
        const today = new Date();
        let from: Date | undefined;

        if (val === '7d') {
            from = new Date(today);
            from.setDate(today.getDate() - 6);
        } else if (val.endsWith('m')) {
            const months = parseInt(val);
            from = new Date(today);
            from.setMonth(today.getMonth() - months);
        }

        const newRange = from ? { from, to: today } : undefined;
        updateSelectedRange(newRange);
        onChange(newRange, val);
        if (val) setPeriod(val);
    };

    const handleDateRangeChange = (range: DateRange | undefined) => {
        updateSelectedRange(range);
        onChange(range, 'custom');
        setPeriod('custom');
    };

    // ✅ day 단위 비교 (a가 b보다 미래 날짜면 true)
    const isAfterDay = (a: Date, b: Date) => {
        const da = new Date(a.getFullYear(), a.getMonth(), a.getDate());
        const db = new Date(b.getFullYear(), b.getMonth(), b.getDate());
        return da.getTime() > db.getTime();
    };

    // ✅ 같은 날짜인지
    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

    // ✅ range를 하루 단위로 이동
    const moveDayRange = (range: DateRange | undefined, diff: number): DateRange | undefined => {
        if (!range?.from || !range?.to) return undefined;

        const from = new Date(range.from);
        const to = new Date(range.to);

        from.setDate(from.getDate() + diff);
        to.setDate(to.getDate() + diff);

        return { from, to };
    };

    const handlePrevDay = () => {
        handleDateRangeChange(moveDayRange(dateRange, -1));
    };

    const handleNextDay = () => {
        if (!dateRange?.to) return;

        const today = new Date();
        const nextRange = moveDayRange(dateRange, +1);

        // ✅ 다음날 range의 to가 오늘 이후면 이동 금지
        if (nextRange?.to && isAfterDay(nextRange.to, today)) return;

        handleDateRangeChange(nextRange);
    };

    const today = new Date();

    // ✅ to가 오늘이면 next 막기
    const isNextDisabled = dateRange?.to ? isSameDay(dateRange.to, today) : true;

    return (
        <>
            {type === 'basic' && (
                <RoundedSelect defaultValue={period} onChange={selectHandler}>
                    <RoundedSelect.Display render={() => <>{datePeriodMapper[period] ?? '직접 선택'}</>} />
                    <RoundedSelect.Content>
                        <RoundedSelect.Item value="1m">최근 1개월</RoundedSelect.Item>
                        <RoundedSelect.Item value="3m">최근 3개월</RoundedSelect.Item>
                        <RoundedSelect.Item value="6m">최근 6개월</RoundedSelect.Item>
                    </RoundedSelect.Content>
                </RoundedSelect>
            )}
            <BasicDropDown>
                <BaseTooltip label="날짜 선택" side="bottom">
                    <BasicDropDown.Trigger onPrev={handlePrevDay} onNext={handleNextDay} disabledNext={isNextDisabled}>
                        <Flex align="center" gap={4}>
                            {/* <MdCalendarToday /> */}
                            <span>
                                {`${formatDate(dateRange?.from, 'yyyy.mm.dd (dow)')} - ${formatDate(
                                    dateRange?.to,
                                    'yyyy.mm.dd (dow)'
                                )}`}
                            </span>
                        </Flex>
                    </BasicDropDown.Trigger>
                </BaseTooltip>

                {/* ✅ Dropdown.Content 자체 box-shadow가 사각형으로 남아서 모서리에 "뒤에 뭐가 보이는" 현상이 생길 수 있음.
                   DatePicker(자식)에서 shadow/radius를 책임지도록 dropdown shadow는 끈다. */}
                <BasicDropDown.Content placement="bottom-center" style={{ boxShadow: 'none' }}>
                    <DateSelectDropdownCloseObserver onClose={onClose} rangeRef={selectedRangeRef} />
                    {type === 'basic' ? (
                        <DoubleDatePicker
                            range={dateRange ?? { from: new Date(), to: new Date() }}
                            onChange={handleDateRangeChange}
                        />
                    ) : (
                        <RangeDatePicker
                            range={dateRange ?? { from: new Date(), to: new Date() }}
                            onChange={handleDateRangeChange}
                        />
                    )}
                </BasicDropDown.Content>
            </BasicDropDown>
        </>
    );
};
