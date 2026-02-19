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
