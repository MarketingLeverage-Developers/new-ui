// 기능: Tooltip으로 hover 시 label을 보여주는 래퍼 컴포넌트
import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';

type BaseTooltipProps = {
    /** Tooltip에 표시될 전체 텍스트 */
    label: string;
    /** Tooltip 트리거로 사용할 React 노드 */
    children: React.ReactNode;
    /** Tooltip 방향 (기본: top) */
    side?: 'top' | 'right' | 'bottom' | 'left';
};

export const BaseTooltip: React.FC<BaseTooltipProps> = ({ label, children, side = 'top' }) => (
    <Tooltip.Provider delayDuration={150} skipDelayDuration={300}>
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                <div>{children}</div>
            </Tooltip.Trigger>

            <Tooltip.Portal container={document.getElementById('root')!}>
                <Tooltip.Content
                    side={side}
                    sideOffset={6}
                    style={{
                        background: 'rgba(0, 0, 0, 0.85)',
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 13,
                        lineHeight: 1.2,
                        zIndex: 9999,
                        userSelect: 'none',
                    }}
                >
                    {label}
                    <Tooltip.Arrow />
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    </Tooltip.Provider>
);
