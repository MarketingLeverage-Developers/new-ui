import React from 'react';
import styles from '../CheckboxGroup.module.scss';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
type ContentProps = {
    children: React.ReactNode;
    padding?: PaddingSize;
};
const Content: React.FC<ContentProps> = ({ children, padding }) => {
    const cssVariables: CSSVariables = {
        '--padding': toCssPadding(padding),
    };
    return (
        <div className={styles.Content} style={{ ...cssVariables }}>
            {children}
        </div>
    );
};

export default Content;
