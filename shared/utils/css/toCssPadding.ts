import type { PaddingSize } from '../../types/css/PaddingSize';
import { toCssUnit } from './toCssUnit';

export const toCssPadding = (padding: PaddingSize | number = 0): string => {
    if (typeof padding === 'number' || typeof padding === 'string') {
        return toCssUnit(padding as number);
    }

    const px = padding.x != null ? toCssUnit(padding.x) : '0px';
    const py = padding.y != null ? toCssUnit(padding.y) : '0px';

    let top = py;
    let bottom = py;
    let left = px;
    let right = px;

    if (padding.t != null) top = toCssUnit(padding.t);
    if (padding.b != null) bottom = toCssUnit(padding.b);
    if (padding.l != null) left = toCssUnit(padding.l);
    if (padding.r != null) right = toCssUnit(padding.r);

    return `${top} ${right} ${bottom} ${left}`;
};
