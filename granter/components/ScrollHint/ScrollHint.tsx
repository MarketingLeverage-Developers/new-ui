import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { FiChevronDown } from 'react-icons/fi';
import styles from './ScrollHint.module.scss';

type ScrollHintState = {
    isScrollable: boolean;
    canScrollForward: boolean;
};

export type ScrollHintProps = {
    targetRef: React.RefObject<HTMLElement | null>;
    observeRef?: React.RefObject<HTMLElement | null>;
    watchValue?: unknown;
    label?: React.ReactNode;
    className?: string;
    textClassName?: string;
    iconClassName?: string;
    iconSize?: number;
    threshold?: number;
};

const ScrollHint = ({
    targetRef,
    observeRef,
    watchValue,
    label,
    className,
    textClassName,
    iconClassName,
    iconSize = 14,
    threshold = 12,
}: ScrollHintProps) => {
    const [scrollState, setScrollState] = useState<ScrollHintState>({
        isScrollable: false,
        canScrollForward: false,
    });

    useEffect(() => {
        const node = targetRef.current;
        const observedNode = observeRef?.current;

        if (!node) return undefined;

        const syncScrollState = () => {
            const maxScrollTop = Math.max(0, node.scrollHeight - node.clientHeight);

            setScrollState({
                isScrollable: maxScrollTop > threshold,
                canScrollForward: maxScrollTop - node.scrollTop > threshold,
            });
        };

        const rafId = window.requestAnimationFrame(syncScrollState);
        node.addEventListener('scroll', syncScrollState, { passive: true });
        window.addEventListener('resize', syncScrollState);

        const resizeObserver =
            typeof ResizeObserver === 'undefined'
                ? null
                : new ResizeObserver(() => {
                      syncScrollState();
                  });

        resizeObserver?.observe(node);
        if (observedNode && observedNode !== node) resizeObserver?.observe(observedNode);

        return () => {
            window.cancelAnimationFrame(rafId);
            node.removeEventListener('scroll', syncScrollState);
            window.removeEventListener('resize', syncScrollState);
            resizeObserver?.disconnect();
        };
    }, [observeRef, targetRef, threshold, watchValue]);

    if (!(scrollState.isScrollable && scrollState.canScrollForward)) return null;

    return (
        <div className={classNames(styles.Root, className)} aria-hidden="true">
            {label ? <span className={classNames(styles.Text, textClassName)}>{label}</span> : null}
            <FiChevronDown className={classNames(styles.Icon, iconClassName)} size={iconSize} />
        </div>
    );
};

export default ScrollHint;
