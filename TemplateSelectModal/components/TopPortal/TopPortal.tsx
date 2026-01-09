import { useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

type Props = {
    children: React.ReactNode;
    active?: boolean;
};

export const TopPortal = ({ children, active = true }: Props) => {
    const root = document.getElementById('root');
    const elRef = useRef<HTMLDivElement | null>(null);

    if (!elRef.current) elRef.current = document.createElement('div');

    useLayoutEffect(() => {
        if (!root) return;

        const el = elRef.current!;
        root.appendChild(el);

        let raf1 = 0;
        let raf2 = 0;

        if (active) {
            // 다른 포털들이 append한 뒤에도 이기려고 2프레임 뒤에 재-append
            raf1 = requestAnimationFrame(() => {
                root.appendChild(el);
                raf2 = requestAnimationFrame(() => {
                    root.appendChild(el);
                });
            });
        }

        return () => {
            if (raf1) cancelAnimationFrame(raf1);
            if (raf2) cancelAnimationFrame(raf2);

            try {
                root.removeChild(el);
            } catch {
                console.log();
            }
        };
    }, [active]); // root를 deps에 넣음 안됨. 매 렌더마다 다른 참조로 인식될 수도 있음

    return root ? ReactDOM.createPortal(children, elRef.current) : null;
};
