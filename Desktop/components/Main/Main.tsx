// 기능: 메인 컨테이너(.main) - 내부 스크롤과 오버레이 분리
import React from 'react';
import styles from './Main.module.scss';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';

type MainProps = {
    children?: React.ReactNode;
    bgColor?: HexColor | ThemeColorVar;
};

export const Main: React.FC<MainProps> = ({ children, bgColor }) => {
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
