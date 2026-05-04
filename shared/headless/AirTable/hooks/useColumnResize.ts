import { useEffect } from 'react';
import { MIN_COL_WIDTH } from '../AirTable';

export const useColumnResize = ({
    resizeRef,
    getXInGrid,
    resizeColumn,
}: {
    resizeRef: React.MutableRefObject<{ key: string; startX: number; startWidth: number; minWidth?: number } | null>;
    getXInGrid: (clientX: number) => number;
    resizeColumn: (colKey: string, width: number) => void;
}) => {
    useEffect(() => {
        const handleMove = (ev: MouseEvent) => {
            const r = resizeRef.current;
            if (!r) return;

            const x = getXInGrid(ev.clientX);
            const diff = x - r.startX;
            const minWidth = Math.max(MIN_COL_WIDTH, r.minWidth ?? MIN_COL_WIDTH);
            const nextWidth = Math.max(minWidth, r.startWidth + diff);

            resizeColumn(r.key, nextWidth);
        };

        const handleUp = () => {
            if (!resizeRef.current) return;
            resizeRef.current = null;
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
        };
    }, [resizeRef, getXInGrid, resizeColumn]);
};
