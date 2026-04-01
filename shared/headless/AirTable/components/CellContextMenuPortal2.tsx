import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getThemeColor } from '../../../utils/css/getThemeColor';
import { useAirTableContext } from '../AirTable2';
import { buildSelectionTsv2, copyTextToClipboard2 } from '../hooks/useCopySelection2';

const AIR_TABLE2_OPEN_CONTEXT_MENU_EVENT = 'AIR_TABLE2_OPEN_CONTEXT_MENU';

type ContextMenuDetail = {
    x: number;
    y: number;
    ri: number;
    ci: number;
    rowKey: string;
    colKey: string;
};

type MenuState = ContextMenuDetail & {
    open: boolean;
};

const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    background: 'transparent',
    padding: '10px 10px',
    textAlign: 'left',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    boxSizing: 'border-box',
    userSelect: 'none',
};

const MenuActionButton = ({
    children,
    onClick,
}: {
    children: React.ReactNode;
    onClick: () => void;
}) => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div
            role="button"
            tabIndex={0}
            style={{
                ...itemStyle,
                WebkitTapHighlightColor: 'transparent',
                color: isActive ? getThemeColor('Primary1') : getThemeColor('Black1'),
                boxShadow: 'none',
                transition: 'background-color 120ms ease, color 120ms ease',
            }}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key !== 'Enter' && e.key !== ' ') return;
                e.preventDefault();
                onClick();
            }}
        >
            {children}
        </div>
    );
};

export const CellContextMenuPortal2 = <T,>() => {
    const { state, baseOrder, getRange } = useAirTableContext<T>();

    const [menu, setMenu] = useState<MenuState | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);

    const close = useCallback(() => setMenu(null), []);

    const handleCopySelection = useCallback(
        async (includeHeaders: boolean) => {
            const range = getRange();
            if (!range) {
                close();
                return;
            }

            if (state.drag.draggingKey) {
                close();
                return;
            }

            const tsv = buildSelectionTsv2({
                stateRows: state.rows,
                baseOrder,
                range,
                includeHeaders,
            });

            await copyTextToClipboard2(tsv);
            close();
        },
        [baseOrder, close, getRange, state.drag.draggingKey, state.rows]
    );

    useEffect(() => {
        console.log('✅ CellContextMenuPortal mounted');

        const handler = (ev: Event) => {
            const e = ev as CustomEvent<ContextMenuDetail>;

            console.log('✅ 컨텍스트 메뉴 이벤트 수신', e.detail);

            if (!e.detail) return;

            setMenu({
                open: true,
                x: e.detail.x,
                y: e.detail.y,
                ri: e.detail.ri,
                ci: e.detail.ci,
                rowKey: e.detail.rowKey,
                colKey: e.detail.colKey,
            });
        };

        window.addEventListener(AIR_TABLE2_OPEN_CONTEXT_MENU_EVENT, handler);
        return () => window.removeEventListener(AIR_TABLE2_OPEN_CONTEXT_MENU_EVENT, handler);
    }, []);

    useEffect(() => {
        if (!menu?.open) return;

        const handleDown = (ev: MouseEvent) => {
            const el = ref.current;
            if (!el) return;
            if (el.contains(ev.target as Node)) return;
            close();
        };

        const handleEsc = (ev: KeyboardEvent) => {
            if (ev.key === 'Escape') close();
        };

        window.addEventListener('mousedown', handleDown);
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('mousedown', handleDown);
            window.removeEventListener('keydown', handleEsc);
        };
    }, [menu?.open, close]);

    if (!menu?.open) return null;
    if (typeof document === 'undefined') return null;

    // ✅ 화면 밖으로 안 나가게 clamp
    const MENU_W = 220;
    const MENU_H = 160;

    const x = Math.min(menu.x, window.innerWidth - MENU_W - 8);
    const y = Math.min(menu.y, window.innerHeight - MENU_H - 8);

    return createPortal(
        <>
            <div
                ref={ref}
                style={{
                    position: 'fixed',
                    top: y,
                    left: x,
                    width: MENU_W,
                    background: getThemeColor('White1'),
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 10,
                    boxShadow: '0 12px 24px rgba(0,0,0,0.14)',
                    zIndex: 2147483647,
                    padding: 6,
                    userSelect: 'none',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        width: '100%',
                        borderRadius: 8,
                        overflow: 'hidden',
                    }}
                >
                    <MenuActionButton onClick={() => void handleCopySelection(false)}>
                        복사
                    </MenuActionButton>

                    <MenuActionButton onClick={() => void handleCopySelection(true)}>
                        헤더 포함 복사
                    </MenuActionButton>
                </div>
            </div>
        </>,

        document.body
    );
};
