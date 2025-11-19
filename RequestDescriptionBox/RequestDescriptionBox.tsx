import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import React from 'react';
import styles from './RequestDescriptionBox.module.scss';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { CSSLength } from '@/shared/types';

type Props = {
    height?: CSSLength;
    bgColor?: HexColor | ThemeColorVar;
    text: string;
};
const RequestDescriptionBox = ({ height, bgColor, text }: Props) => {
    const cssVariables: CSSVariables = {
        '--height': toCssUnit(height),
        '--background-color': bgColor,
    };
    return (
        <div className={styles.DescriptionBox} style={{ ...cssVariables }}>
            {text}
        </div>
    );
};

export default RequestDescriptionBox;
