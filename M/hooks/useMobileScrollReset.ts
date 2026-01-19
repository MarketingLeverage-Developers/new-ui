import { useEffect, useRef } from 'react';
import { atom, useRecoilState } from 'recoil';

// Atom to signal scroll reset (increment to trigger)
export const mobileScrollResetState = atom<number>({
    key: 'mobileScrollResetState',
    default: 0,
});

// Hook for the generic container (e.g., Mobile.Main) to consume the signal
export const useMobileScrollReset = <T extends HTMLElement>(ref: React.RefObject<T | null>) => {
    const [resetCount] = useRecoilState(mobileScrollResetState);
    const lastCount = useRef(resetCount);

    useEffect(() => {
        if (resetCount !== lastCount.current) {
            lastCount.current = resetCount;
            if (ref.current) {
                // 내부 스크롤 위치 초기화
                ref.current.scrollTop = 0;
            }
        }
    }, [resetCount, ref]);
};

// Hook for pages to trigger the reset
export const useTriggerMobileScrollReset = () => {
    const [_, setResetCount] = useRecoilState(mobileScrollResetState);

    const triggerScrollReset = () => {
        setResetCount((prev) => prev + 1);
    };

    return triggerScrollReset;
};
