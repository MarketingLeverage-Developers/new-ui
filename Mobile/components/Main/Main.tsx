import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import React from 'react';
import styles from './Main.module.scss';

type MainProps = {
    children?: React.ReactNode;
    bgColor?: HexColor | ThemeColorVar;
};

export const Main = ({ children, bgColor }: MainProps) => {
    const cssVariables: CSSVariables = {
        '--background-color': bgColor,
    };
    return (
        <main className={styles.Main} style={{ ...cssVariables }}>
            {children}
        </main>
    );
};
