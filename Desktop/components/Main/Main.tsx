import React from 'react';
import styles from './Main.module.scss';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { FilterLine } from './components/FilterLine/FilterLine';

type MainProps = {
    children?: React.ReactNode;
    bgColor?: HexColor | ThemeColorVar;
};

type MainComponent = React.FC<MainProps> & {
    FilterLine: typeof FilterLine;
};

const MainBase: React.FC<MainProps> = ({ children, bgColor }) => {
    const cssVariables: CSSVariables = { '--background-color': bgColor };

    const childArray = React.Children.toArray(children);
    const overlayNodes = childArray.filter((n) => React.isValidElement(n) && !!(n.props as any)['data-overlay-root']);
    const contentNodes = childArray.filter((n) => !React.isValidElement(n) || !(n.props as any)['data-overlay-root']);

    return (
        <main className={styles.main} style={{ ...cssVariables }}>
            <div className={styles.mainScroller}>
                {/* ✅ FilterLine과 본문을 같은 폭 컨텍스트로 묶는 래퍼 */}
                <div className={styles.mainRow}>{contentNodes}</div>
            </div>
            {overlayNodes}
        </main>
    );
};

export const Main: MainComponent = Object.assign(MainBase, {
    FilterLine,
});
