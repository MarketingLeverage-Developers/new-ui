import { useEffect, useState } from 'react';

export const useContainerWidth = (wrapperRef: React.MutableRefObject<HTMLDivElement | null>) => {
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;

        const update = () => {
            const nextWidth = el.clientWidth;
            setContainerWidth((prev) => (prev === nextWidth ? prev : nextWidth));
        };
        update();

        const ro = new ResizeObserver(update);
        ro.observe(el);

        return () => ro.disconnect();
    }, [wrapperRef]);

    return containerWidth;
};
