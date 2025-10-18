// 기능: 메인 컨테이너(.main) - 내부 스크롤과 오버레이 분리 + 정적 속성(FilterLine) 타입 안전 부여
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

// Main 컴포넌트에 정적 속성(FilterLine)을 붙일 것이므로 이를 포함한 타입을 선언
type MainComponent = React.FC<MainProps> & {
    FilterLine: typeof FilterLine;
};

const MainBase: React.FC<MainProps> = ({ children, bgColor }) => {
    // CSS 변수 주입
    const cssVariables: CSSVariables = {
        '--background-color': bgColor,
    };

    // 자식 중 data-overlay-root 가 있는 노드는 오버레이로 분리
    const childArray = React.Children.toArray(children);

    const overlayNodes = childArray.filter((node) => {
        if (!React.isValidElement(node)) return false;
        // BlurOverlay 루트에 data-overlay-root 가 달려있음
        return Boolean((node.props as Record<string, unknown>)['data-overlay-root']);
    });

    const contentNodes = childArray.filter((node) => {
        if (!React.isValidElement(node)) return true;
        return !(node.props as Record<string, unknown>)['data-overlay-root'];
    });

    return (
        <main className={styles.main} style={{ ...cssVariables }}>
            {/* 스크롤은 이 래퍼가 담당 */}
            <div className={styles.mainScroller}>{contentNodes}</div>

            {/* 오버레이는 .main 바로 아래에 절대배치 → .main 경계만 덮음 */}
            {overlayNodes}
        </main>
    );
};

// 정적 속성(FilterLine)을 타입 안전하게 합치기
export const Main: MainComponent = Object.assign(MainBase, {
    FilterLine,
});
