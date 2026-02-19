import React, { type ReactNode } from 'react';
import styles from '../Content/Content.module.scss';
import type { CSSVariables } from '../../../../types/css/CSSVariables';
import { toCssPadding } from '../../../../utils/css/toCssPadding';
import type { PaddingSize } from '../../../../types/css/PaddingSize';
type FooterProps = {
    children: ReactNode;
    padding?: PaddingSize;
};
const Footer = ({ children, padding = 16 }: FooterProps) => {
    const cssVariables: CSSVariables = {
        '--padding': toCssPadding(padding),
    };
    return (
        <div className={styles.Footer} style={{ ...cssVariables }}>
            {children}
        </div>
    );
};

export default Footer;
