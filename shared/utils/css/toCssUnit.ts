import type { CSSLength } from '../../types/css/CSSLength';

/**
 * 숫자는 'px' 붙이고, 문자열은 그대로 반환
 */
export const toCssUnit = (v?: CSSLength): string => {
    if (v == null) return 'auto';
    return typeof v === 'number' ? `${v}px` : v;
};
