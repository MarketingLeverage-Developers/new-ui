import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';

type ScrollDirection = 'prev' | 'next';

type LabeledPillTabsScrollState = {
    canScroll: boolean;
    canScrollPrev: boolean;
    canScrollNext: boolean;
};

type UseLabeledPillTabsScrollOptions = {
    disabled: boolean;
    refreshKey: unknown;
};

const HOLD_SCROLL_MAX_SPEED = 0.52;
const HOLD_SCROLL_ACCELERATION_DURATION = 220;

const emptyScrollState: LabeledPillTabsScrollState = {
    canScroll: false,
    canScrollPrev: false,
    canScrollNext: false,
};

export const useLabeledPillTabsScroll = ({ disabled, refreshKey }: UseLabeledPillTabsScrollOptions) => {
    const tabsRef = useRef<HTMLDivElement | null>(null);
    const scrollAnimationFrameRef = useRef<number | null>(null);
    const scrollDirectionRef = useRef<ScrollDirection | null>(null);
    const scrollStartedAtRef = useRef(0);
    const scrollLastTimeRef = useRef(0);
    const [scrollState, setScrollState] = useState<LabeledPillTabsScrollState>(emptyScrollState);

    const updateScrollState = useCallback(() => {
        const tabsElement = tabsRef.current;

        if (!tabsElement || disabled) {
            setScrollState(emptyScrollState);
            return;
        }

        const maxScrollLeft = tabsElement.scrollWidth - tabsElement.clientWidth;
        const canScroll = maxScrollLeft > 1;
        const scrollLeft = tabsElement.scrollLeft;
        const nextScrollState = {
            canScroll,
            canScrollPrev: canScroll && scrollLeft > 1,
            canScrollNext: canScroll && scrollLeft < maxScrollLeft - 1,
        };

        setScrollState((prevScrollState) =>
            prevScrollState.canScroll === nextScrollState.canScroll &&
            prevScrollState.canScrollPrev === nextScrollState.canScrollPrev &&
            prevScrollState.canScrollNext === nextScrollState.canScrollNext
                ? prevScrollState
                : nextScrollState
        );
    }, [disabled]);

    useEffect(() => {
        updateScrollState();
    }, [refreshKey, updateScrollState]);

    useEffect(() => {
        const tabsElement = tabsRef.current;

        if (!tabsElement || disabled) {
            return undefined;
        }

        const handleScroll = () => updateScrollState();
        const resizeObserver = new ResizeObserver(updateScrollState);

        tabsElement.addEventListener('scroll', handleScroll, { passive: true });
        resizeObserver.observe(tabsElement);

        return () => {
            tabsElement.removeEventListener('scroll', handleScroll);
            resizeObserver.disconnect();
        };
    }, [disabled, updateScrollState]);

    const cancelHoldScroll = useCallback(() => {
        if (scrollAnimationFrameRef.current !== null) {
            cancelAnimationFrame(scrollAnimationFrameRef.current);
            scrollAnimationFrameRef.current = null;
        }

        scrollDirectionRef.current = null;
    }, []);

    const stopHoldScroll = useCallback(() => {
        cancelHoldScroll();
        updateScrollState();
    }, [cancelHoldScroll, updateScrollState]);

    useEffect(
        () => () => {
            cancelHoldScroll();
        },
        [cancelHoldScroll]
    );

    const startHoldScroll = useCallback(
        (direction: ScrollDirection) => {
            const tabsElement = tabsRef.current;

            if (!tabsElement || disabled) {
                return;
            }

            cancelHoldScroll();

            scrollDirectionRef.current = direction;
            scrollStartedAtRef.current = performance.now();
            scrollLastTimeRef.current = scrollStartedAtRef.current;

            const animateScroll = (currentTime: number) => {
                const currentDirection = scrollDirectionRef.current;
                const currentTabsElement = tabsRef.current;

                if (!currentDirection || !currentTabsElement) {
                    scrollAnimationFrameRef.current = null;
                    return;
                }

                const maxScrollLeft = currentTabsElement.scrollWidth - currentTabsElement.clientWidth;
                const deltaTime = currentTime - scrollLastTimeRef.current;
                const accelerationProgress = Math.min(
                    (currentTime - scrollStartedAtRef.current) / HOLD_SCROLL_ACCELERATION_DURATION,
                    1
                );
                const easedAcceleration = 1 - Math.pow(1 - accelerationProgress, 2);
                const scrollDelta =
                    deltaTime *
                    HOLD_SCROLL_MAX_SPEED *
                    easedAcceleration *
                    (currentDirection === 'prev' ? -1 : 1);
                const nextScrollLeft = Math.min(
                    Math.max(currentTabsElement.scrollLeft + scrollDelta, 0),
                    maxScrollLeft
                );

                currentTabsElement.scrollLeft = nextScrollLeft;
                scrollLastTimeRef.current = currentTime;

                if (
                    (currentDirection === 'prev' && nextScrollLeft <= 0) ||
                    (currentDirection === 'next' && nextScrollLeft >= maxScrollLeft)
                ) {
                    stopHoldScroll();
                    return;
                }

                scrollAnimationFrameRef.current = requestAnimationFrame(animateScroll);
            };

            scrollAnimationFrameRef.current = requestAnimationFrame(animateScroll);
        },
        [cancelHoldScroll, disabled, stopHoldScroll]
    );

    const handleScrollPointerDown = useCallback(
        (event: PointerEvent<HTMLButtonElement>, direction: ScrollDirection) => {
            if (event.button !== 0) {
                return;
            }

            event.currentTarget.setPointerCapture(event.pointerId);
            startHoldScroll(direction);
        },
        [startHoldScroll]
    );

    const handleScrollKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>, direction: ScrollDirection) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
                return;
            }

            event.preventDefault();

            if (scrollDirectionRef.current === direction) {
                return;
            }

            startHoldScroll(direction);
        },
        [startHoldScroll]
    );

    const handleScrollKeyUp = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>) => {
            if (event.key !== 'Enter' && event.key !== ' ') {
                return;
            }

            event.preventDefault();
            stopHoldScroll();
        },
        [stopHoldScroll]
    );

    const getScrollButtonProps = useCallback(
        (direction: ScrollDirection) => ({
            onPointerDown: (event: PointerEvent<HTMLButtonElement>) => handleScrollPointerDown(event, direction),
            onPointerUp: stopHoldScroll,
            onPointerLeave: stopHoldScroll,
            onPointerCancel: stopHoldScroll,
            onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => handleScrollKeyDown(event, direction),
            onKeyUp: handleScrollKeyUp,
            onBlur: stopHoldScroll,
        }),
        [handleScrollKeyDown, handleScrollKeyUp, handleScrollPointerDown, stopHoldScroll]
    );

    return {
        tabsRef,
        scrollState,
        shouldShowScrollButtons: !disabled && scrollState.canScroll,
        getScrollButtonProps,
    };
};
