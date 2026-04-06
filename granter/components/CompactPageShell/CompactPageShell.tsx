import MainOverlay from '../MainOverlay/MainOverlay';
import type { ReactNode } from 'react';
import styles from './CompactPageShell.module.scss';

export type CompactPageShellProps = {
    headerTopLeft?: ReactNode;
    headerTopRight?: ReactNode;
    headerMainLeft?: ReactNode;
    headerMainRight?: ReactNode;
    headerFilters?: ReactNode;
    main: ReactNode;
    footer?: ReactNode;
    overlays?: ReactNode;
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    errorMessage?: string;
    onRetry?: () => void | Promise<unknown>;
};

const CompactPageShell = ({
    headerTopLeft,
    headerTopRight,
    headerMainLeft,
    headerMainRight,
    headerFilters,
    main,
    footer,
    overlays,
    isLoading = false,
    isError = false,
    isEmpty = false,
    errorMessage,
    onRetry,
}: CompactPageShellProps) => (
    <>
        <div className={styles.Root}>
            <header className={styles.Header}>
                {headerTopLeft || headerTopRight ? (
                    <div className={styles.HeaderRow}>
                        <div className={styles.HeaderLeft}>{headerTopLeft}</div>
                        <div className={styles.HeaderRight}>{headerTopRight}</div>
                    </div>
                ) : null}

                {headerMainLeft || headerMainRight ? (
                    <div className={styles.HeaderRow}>
                        <div className={styles.HeaderLeft}>{headerMainLeft}</div>
                        <div className={styles.HeaderRight}>{headerMainRight}</div>
                    </div>
                ) : null}

                {headerFilters ? <div className={styles.Filters}>{headerFilters}</div> : null}
            </header>

            <main className={styles.Main}>
                <MainOverlay isFetching={isLoading} hasError={isError} isEmpty={isEmpty} errorMessage={errorMessage} onRetry={onRetry}>
                    <div className={styles.MainInner}>{main}</div>
                </MainOverlay>
            </main>

            {footer ? <footer className={styles.Footer}>{footer}</footer> : null}
        </div>

        {overlays}
    </>
);

export default CompactPageShell;
