import moment from 'moment';
import KakaoImg from '../../assets/images/kakao-social-login.png';
import GoogleImg from '../../assets/images/google-social-login.png';
import KarrotImg from '../../assets/images/karrot-icon.svg';
import MetaImg from '../../assets/images/meta-social-icon.svg';
import NaverImg from '../../assets/images/naver-social-login.png';
import type { DateRange } from 'react-day-picker';

export const extractISO = (period: string): { startISO: string; endISO: string } | null => {
    const m = String(period ?? '').match(/\((\d{4}-\d{2}-\d{2})\s*~\s*(\d{4}-\d{2}-\d{2})\)/);
    if (!m) return null;
    return { startISO: m[1], endISO: m[2] };
};

export const isOverlap = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
    Math.max(aStart.getTime(), bStart.getTime()) <= Math.min(aEnd.getTime(), bEnd.getTime());

export const toDate = (iso: string) => new Date(`${iso}T00:00:00`);
export const fmt = (d: Date) => moment(d).format('YYYY-MM-DD');
export const sameDay = (a?: string, b?: string) => a === b;

export const addMonths = (date: Date, delta: number) => {
    // "해당 월의 같은 일자"가 존재하지 않을 때(예: 1/31 + 1달) JS가 다음달로 튀는 문제 방지
    const d = new Date(date);
    const originalDay = d.getDate();

    // 1) 일단 1일로 맞추고 월을 이동
    d.setDate(1);
    d.setMonth(d.getMonth() + delta);

    // 2) 이동한 달의 마지막 날짜를 구한 뒤, originalDay와 비교해 clamp
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(originalDay, lastDay));

    return d;
};

export const startOfMonth = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(1);
    return d;
};

export const endOfMonth = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    // 다음 달 0일 = 이번 달 마지막 날
    return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
};

export const moveMonth = (base: Date, delta: number) => {
    const shifted = addMonths(base, delta);
    return { from: startOfMonth(shifted), to: endOfMonth(shifted) };
};

export const moveDayRange = (range: DateRange | undefined, diff: number): DateRange | undefined => {
    if (!range?.from || !range?.to) return undefined;

    const from = new Date(range.from);
    const to = new Date(range.to);

    from.setDate(from.getDate() + diff);
    to.setDate(to.getDate() + diff);

    return { from, to };
};

const pad2 = (n: number) => String(n).padStart(2, '0');

const toValidDate = (value?: string | Date | null): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getMeridiemAndHourMinute = (date: Date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    const period = h < 12 ? '오전' : '오후';
    const hh = pad2(h % 12 || 12);
    const mm = pad2(m);
    return { period, hh, mm };
};

export const formatMeridiemKoreanTime = (value?: string | Date | null): string => {
    const date = toValidDate(value);
    if (!date) return '-';

    const { period, hh, mm } = getMeridiemAndHourMinute(date);
    return `${period} ${hh}시 ${mm}분`;
};

export const formatKoreanTime = (value?: string | Date | null): string => {
    const date = toValidDate(value);
    if (!date) return '-';

    const { hh, mm } = getMeridiemAndHourMinute(date);
    return `${hh}시 ${mm}분`;
};

export const formatMeridiemKoreanTimeRange = (
    startValue?: string | Date | null,
    endValue?: string | Date | null
): string => {
    const start = toValidDate(startValue);
    const end = toValidDate(endValue);

    if (start && end) {
        const isSameDate =
            start.getFullYear() === end.getFullYear() &&
            start.getMonth() === end.getMonth() &&
            start.getDate() === end.getDate();

        if (!isSameDate) {
            const startDay = pad2(start.getDate());
            const endDay = pad2(end.getDate());
            const startFmt = formatMeridiemKoreanTime(start);
            const endFmt = formatMeridiemKoreanTime(end);
            return `${startDay}일 ${startFmt} ~ ${endDay}일 ${endFmt}`;
        }

        const startFmt = formatMeridiemKoreanTime(start);
        const startPeriod = start.getHours() < 12 ? '오전' : '오후';
        const endPeriod = end.getHours() < 12 ? '오전' : '오후';
        const endFmt = startPeriod === endPeriod ? formatKoreanTime(end) : formatMeridiemKoreanTime(end);
        return `${startFmt} ~ ${endFmt}`;
    }

    if (start) return formatMeridiemKoreanTime(start);
    if (end) return formatMeridiemKoreanTime(end);
    return '-';
};

export const MEDIA_ICONS: Record<string, string> = {
    naver: NaverImg,
    kakao: KakaoImg,
    google: GoogleImg,
    daangn: KarrotImg,
    meta: MetaImg,
};

export const MEDIA_MAPPER: Record<string, string> = {
    naver: '네이버',
    kakao: '카카오',
    google: '구글',
    daangn: '당근',
    meta: '메타',
};
