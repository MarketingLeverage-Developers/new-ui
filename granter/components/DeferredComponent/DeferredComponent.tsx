import React, { useEffect, useRef, useState } from 'react';

type DeferredComponentProps = {
    delay?: number;
    minVisibleMs?: number;
    active: boolean;
    children: React.ReactNode;
};

const DeferredComponent: React.FC<DeferredComponentProps> = ({ delay = 200, minVisibleMs = 400, active, children }) => {
    const [visible, setVisible] = useState(false);

    const visibleRef = useRef<boolean>(false);
    const delayTimerRef = useRef<number | null>(null);
    const hideTimerRef = useRef<number | null>(null);
    const shownAtRef = useRef<number | null>(null);

    const clearDelay = () => {
        if (delayTimerRef.current != null) {
            window.clearTimeout(delayTimerRef.current);
            delayTimerRef.current = null;
        }
    };

    const clearHide = () => {
        if (hideTimerRef.current != null) {
            window.clearTimeout(hideTimerRef.current);
            hideTimerRef.current = null;
        }
    };

    const setVisibleSafe = (next: boolean) => {
        visibleRef.current = next;
        setVisible(next);
    };

    useEffect(
        () => () => {
            clearDelay();
            clearHide();
        },
        []
    );

    useEffect(() => {
        clearDelay();
        clearHide();

        if (active) {
            if (visibleRef.current) return;

            delayTimerRef.current = window.setTimeout(() => {
                if (!active) return;

                shownAtRef.current = performance.now();
                setVisibleSafe(true);
            }, Math.max(0, delay));

            return;
        }

        if (!visibleRef.current) return;

        const shownAt = shownAtRef.current;
        const elapsed = shownAt != null ? performance.now() - shownAt : minVisibleMs;
        const remain = Math.max(0, minVisibleMs - elapsed);

        hideTimerRef.current = window.setTimeout(() => {
            shownAtRef.current = null;
            setVisibleSafe(false);
        }, remain);
    }, [active, delay, minVisibleMs]);

    return visible ? <>{children}</> : null;
};

export default DeferredComponent;
