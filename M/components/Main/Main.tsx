// 기능: 모바일 메인 컨테이너 - 내부 스크롤과 오버레이 레이어 분리 + 정적 속성(FilterLine) 타입 안전 부여
import React, { useRef } from 'react';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import styles from './Main.module.scss';
import { FilterLine } from './components/FilterLine/FilterLine';
import { useMobileScrollReset } from '../../hooks/useMobileScrollReset';

type MainProps = {
    children?: React.ReactNode;
    bgColor?: HexColor | ThemeColorVar;
};

// Main에 정적 속성(FilterLine)을 추가할 것이므로 타입 확장
type MainComponent = React.FC<MainProps> & {
    FilterLine: typeof FilterLine;
};

// 내부 스크롤과 오버레이 레이어를 분리하는 본체 컴포넌트
const MainBase: React.FC<MainProps> = ({ children, bgColor }) => {
    // 배경 색상 변수
    const cssVariables: CSSVariables = {
        '--background-color': bgColor,
    };

    const scrollerRef = useRef<HTMLDivElement>(null);
    useMobileScrollReset(scrollerRef);

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
            <div className={styles.MainScroller} ref={scrollerRef}>
                {contentNodes}
            </div>

            {/* 오버레이는 .Main 바로 아래에 절대배치 → .Main 경계까지만 덮음 */}
            {overlayNodes}
        </main>
    );
};

// 정적 속성(FilterLine)을 타입 안전하게 결합
export const Main: MainComponent = Object.assign(MainBase, {
    FilterLine,
});
