import React, { useEffect, useRef } from 'react';
import styles from './Main.module.scss';

export type MainProps = {
    children?: React.ReactNode;
    scrollable?: boolean;
    padding?: React.CSSProperties['padding'];
    onScrollElReady?: (el: HTMLDivElement | null) => void;
};

const Main = ({ children, scrollable = true, padding = 20, onScrollElReady }: MainProps) => {
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!onScrollElReady) return;
        onScrollElReady(scrollerRef.current);
        return () => onScrollElReady(null);
    }, [onScrollElReady]);

    return (
        <main className={styles.Main}>
            <div
                ref={scrollerRef}
                className={`${styles.MainScroller} ${scrollable ? '' : styles.NoScroll}`}
                style={{ padding }}
            >
                {children}
            </div>
        </main>
    );
};

export default Main;
