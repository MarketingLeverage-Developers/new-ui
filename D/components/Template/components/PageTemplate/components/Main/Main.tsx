import React from 'react';
import styles from './Main.module.scss';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { FilterLine } from './components/FilterLine/FilterLine';

type MainProps = {
    children?: React.ReactNode;
    bgColor?: HexColor | ThemeColorVar;
    scrollable?: boolean;
};

type MainComponent = React.FC<MainProps> & {
    FilterLine: typeof FilterLine;
};

const MainBase: React.FC<MainProps> = ({ children, bgColor, scrollable = true }) => {
    const cssVariables: CSSVariables = { '--background-color': bgColor };

    const childArray = React.Children.toArray(children);

    const overlayNodes = childArray.filter(
        (n) => React.isValidElement(n) && !!(n.props as { ['data-overlay-root']?: boolean })['data-overlay-root']
    );

    const contentNodes = childArray.filter(
        (n) => !React.isValidElement(n) || !(n.props as { ['data-overlay-root']?: boolean })['data-overlay-root']
    );

    const hasOverlay = overlayNodes.length > 0;

    return (
        <main className={styles.main} style={{ ...cssVariables }}>
            <div
                className={`${styles.mainScroller} ${hasOverlay ? styles.isOverlayOpen : ''} ${
                    scrollable ? '' : styles.noScroll
                }`}
            >
                <div className={styles.mainRow}>{contentNodes}</div>
            </div>

            {/* ✅ 오버레이는 scroller 밖(형제)에서 main을 기준으로 덮어야 스크롤과 무관해짐 */}
            <div className={styles.mainOverlayLayer}>{overlayNodes}</div>
        </main>
    );
};

export const Main: MainComponent = Object.assign(MainBase, {
    FilterLine,
});
