// 기능: 모바일 메인 컨테이너 - 내부 스크롤과 오버레이 레이어 분리
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import React from 'react';
import styles from './Main.module.scss';

type MainProps = {
    children?: React.ReactNode;
    bgColor?: HexColor | ThemeColorVar;
};

export const Main: React.FC<MainProps> = ({ children, bgColor }) => {
    // 배경 색상 변수
    const cssVariables: CSSVariables = {
        '--background-color': bgColor,
    };

    // 자식 중 data-overlay-root가 있는 노드를 오버레이로 분리
    const childArray = React.Children.toArray(children);

    const overlayNodes = childArray.filter((node) => {
        if (!React.isValidElement(node)) return false;
        return Boolean((node.props as Record<string, unknown>)['data-overlay-root']);
    });

    const contentNodes = childArray.filter((node) => {
        if (!React.isValidElement(node)) return true;
        return !(node.props as Record<string, unknown>)['data-overlay-root'];
    });

    return (
        <main className={styles.Main} style={{ ...cssVariables }}>
            {/* 스크롤 담당 래퍼 */}
            <div className={styles.MainScroller}>{contentNodes}</div>

            {/* 오버레이는 .Main 바로 아래에 절대배치 → .Main 경계까지만 덮음 */}
            {overlayNodes}
        </main>
    );
};
