import React from 'react';
import styles from './Main.module.scss';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';

type MainProps = {
    children?: React.ReactNode;
    bgColor?: HexColor | ThemeColorVar;
};

export const Main = ({ children, bgColor }: MainProps) => {
    const cssVariables: CSSVariables = {
        '--background-color': bgColor,
    };

    return (
        <main className={styles.main} style={{ ...cssVariables }}>
            {children}
        </main>
    );
};
