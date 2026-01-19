import React from 'react';
import styles from '../CheckboxGroup.module.scss';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import type { CSSLength } from '@/shared/types';
import { toCssUnit } from '@/shared/utils';
type ContentProps = {
    children: React.ReactNode;
    padding?: PaddingSize;
    gap?: CSSLength;
};
const Content: React.FC<ContentProps> = ({ children, padding, gap = 8 }) => {
    const cssVariables: CSSVariables = {
        '--padding': toCssPadding(padding),
        '--gap': toCssUnit(gap),
    };
    return (
        <div className={styles.Content} style={{ ...cssVariables }}>
            {children}
        </div>
    );
};

export default Content;
