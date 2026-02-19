// hangulSearch.ts
const CHOSEONG = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
] as const;
const JUNGSEONG = [
    'ㅏ',
    'ㅐ',
    'ㅑ',
    'ㅒ',
    'ㅓ',
    'ㅔ',
    'ㅕ',
    'ㅖ',
    'ㅗ',
    'ㅘ',
    'ㅙ',
    'ㅚ',
    'ㅛ',
    'ㅜ',
    'ㅝ',
    'ㅞ',
    'ㅟ',
    'ㅠ',
    'ㅡ',
    'ㅢ',
    'ㅣ',
] as const;
// 종성은 묶음(예: 'ㄱㅅ')일 수도 있으므로 문자열로 보관
const JONGSEONG = [
    '',
    'ㄱ',
    'ㄲ',
    'ㄱㅅ',
    'ㄴ',
    'ㄴㅈ',
    'ㄴㅎ',
    'ㄷ',
    'ㄹ',
    'ㄹㄱ',
    'ㄹㅁ',
    'ㄹㅂ',
    'ㄹㅅ',
    'ㄹㅌ',
    'ㄹㅍ',
    'ㄹㅎ',
    'ㅁ',
    'ㅂ',
    'ㅂㅅ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ',
] as const;

const HANGUL_BASE = 0xac00;
const HANGUL_END = 0xd7a3;
const N_JUNG = 21;
const N_JONG = 28;

const toNFC = (s: string) => (s ?? '').normalize('NFC');

const isHangulSyllable = (ch: string) => {
    if (!ch) return false;
    const code = ch.charCodeAt(0);
    return code >= HANGUL_BASE && code <= HANGUL_END;
};

// 문자열을 자모(ㄱ,ㅏ,ㄴ...)의 나열로 분해
export const disassembleHangul = (str: string): string => {
    const out: string[] = [];
    for (const ch of toNFC(str)) {
        if (isHangulSyllable(ch)) {
            const idx = ch.charCodeAt(0) - HANGUL_BASE;
            const ci = Math.floor(idx / (N_JUNG * N_JONG)); // 초성 index
            const ji = Math.floor((idx % (N_JUNG * N_JONG)) / N_JONG); // 중성 index
            const ti = idx % N_JONG; // 종성 index

            out.push(CHOSEONG[ci], JUNGSEONG[ji]);
            const jong = JONGSEONG[ti];
            if (jong) out.push(...jong.split('')); // 겹받침 분해
        } else {
            // 이미 자음/모음(ㄱ-ㅎ, ㅏ-ㅣ) 또는 영문/숫자 등은 그대로 보관
            out.push(ch);
        }
    }
    return out.join('');
};

// 문자열의 "초성"만 추출 (예: '선택된' -> 'ㅅㅌㄷ', '암사슴' -> 'ㅇㅅㅅ')
export const choseongOnly = (str: string): string => {
    const out: string[] = [];
    for (const ch of toNFC(str)) {
        if (isHangulSyllable(ch)) {
            const idx = ch.charCodeAt(0) - HANGUL_BASE;
            const ci = Math.floor(idx / (N_JUNG * N_JONG));
            out.push(CHOSEONG[ci]);
        } else if (/[ㄱ-ㅎ]/.test(ch)) {
            // 사용자가 초성만 입력한 경우 등: 기존 자음도 포함
            out.push(ch);
        } else if (/\s/.test(ch)) {
            out.push(' ');
        }
    }
    return out.join('');
};

// 쿼리 특성 판별
export const isConsonantOnly = (s: string) => s !== '' && /^[ㄱ-ㅎ]+$/.test(s);
export const isJamoOnly = (s: string) => s !== '' && /^[ㄱ-ㅎㅏ-ㅣ]+$/.test(s);

// 매 항목 라벨에 대해 검색용 인덱스 생성
export const buildHangulIndex = (label: string) => {
    const norm = toNFC(label).toLowerCase();
    const jamo = disassembleHangul(label).toLowerCase();
    const cho = choseongOnly(label).replace(/\s+/g, ''); // 공백 제거해 연속 비교
    return { norm, jamo, cho };
};
