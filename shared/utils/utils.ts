import type { Result } from '../types';

export const formatDate = (
    d?: Date,
    format: string = 'yy.mm.dd (dow)' // 기본 포맷
): string => {
    if (!d) return '';

    const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

    const yyyy = String(d.getFullYear());
    const yy = yyyy.slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dow = WEEKDAY_KO[d.getDay()];

    // 치환 규칙
    return format.replace(/yyyy/g, yyyy).replace(/yy/g, yy).replace(/mm/g, mm).replace(/dd/g, dd).replace(/dow/g, dow);
};

// 요일 출력
export const getDayOfWeek = (dateString: string | undefined) => {
    if (dateString === undefined || dateString === '') return '';
    const date = new Date(dateString);
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[date.getDay()];
};

// dday
export const getDDay = (dateString: string | undefined) => {
    if (dateString === undefined) return;
    const target = new Date(dateString);
    const today = new Date();
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days; // 양수 = 남은 날, 0 = 오늘, 음수 = 지난 날
};

export const formatKRW = (n: number | string) => `${Math.round(Number(n)).toLocaleString('ko-KR')}원`;

// export const formatManWon = (n: number | string) => `${Math.round(Number(n) / 10_000).toLocaleString('ko-KR')}만원`;

export const formatKRWMixed = (n: number | string) => {
    const v = Math.round(Number(n) || 0);
    const man = Math.floor(v / 10_000);
    const rest = v % 10_000;
    if (man > 0 && rest > 0) return `${man.toLocaleString('ko-KR')}만 ${rest.toLocaleString('ko-KR')}원`;
    if (man > 0) return `${man.toLocaleString('ko-KR')}만원`;
    return `${rest.toLocaleString('ko-KR')}원`;
};

export const calcDiscountPrice = (listPrice: number, percent: number) => Math.round(listPrice * (1 - percent / 100));

export const normalizeNumericInput = (raw: string): string => {
    if (!raw) return '';

    // 1️⃣ 숫자, 소수점만 허용
    let input = raw.replace(/[^\d.]/g, '');

    // 2️⃣ '.'이 여러 번 등장하면 첫 번째만 남기기
    const parts = input.split('.');
    if (parts.length > 2) {
        input = `${parts[0]}.${parts.slice(1).join('')}`;
    }

    // 3️⃣ 선행 0 제거 (단, "0." 형태는 유지)
    if (input.startsWith('0') && input.length > 1 && !input.startsWith('0.')) {
        input = input.replace(/^0+/, '');
        if (input === '') input = '0'; // 전체가 0이었던 경우 복구
    }

    return input;
};

export const calculateDiscountPrice = (originalPrice: number, discountPercentage: number) => {
    // 할인될 금액을 계산합니다.
    const discountAmount = originalPrice * (discountPercentage / 100);

    // 원가에서 할인 금액을 뺍니다.
    const discountedPrice = originalPrice - discountAmount;

    // 소수점 이하를 버리고 정수만 반환합니다.
    return Math.floor(discountedPrice);
};

export const capitalize = (str: string) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// useResultQuery를 위한 유틸 함수
export const unwrapResult = <T>(r: Result<T>): T => {
    if (!r?.ok || r.data == null) {
        const msg = r?.message ?? '요청을 처리하지 못했습니다.';
        throw new Error(msg);
    }
    return r.data;
};
