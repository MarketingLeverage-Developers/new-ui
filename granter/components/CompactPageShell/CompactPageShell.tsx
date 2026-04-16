import MainOverlay from '../MainOverlay/MainOverlay';
import type { ReactNode } from 'react';
import styles from './CompactPageShell.module.scss';

export type CompactPageShellProps = {
    theme?: 'light' | 'dark' | 'darker' | 'system';
    headerTopLeft?: ReactNode;
    headerTopCenter?: ReactNode;
    headerTopRight?: ReactNode;
    headerMainLeft?: ReactNode;
    headerMainCenter?: ReactNode;
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
    theme = 'light',
    headerTopLeft,
    headerTopCenter,
    headerTopRight,
    headerMainLeft,
    headerMainCenter,
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
        <div className={styles.Root} data-theme={theme} data-has-footer={footer ? 'true' : 'false'}>
            <header className={styles.Header}>
                {headerTopLeft || headerTopCenter || headerTopRight ? (
                    <div className={styles.HeaderTopRow}>
                        <div className={styles.HeaderTopLeft}>{headerTopLeft}</div>
                        <div className={styles.HeaderTopCenter}>{headerTopCenter}</div>
                        <div className={styles.HeaderTopRight}>{headerTopRight}</div>
                    </div>
                ) : null}

                {headerMainLeft || headerMainCenter || headerMainRight ? (
                    <div className={styles.HeaderMainRow}>
                        <div className={styles.HeaderMainLeft}>{headerMainLeft}</div>
                        <div className={styles.HeaderMainCenter}>{headerMainCenter}</div>
                        <div className={styles.HeaderMainRight}>{headerMainRight}</div>
                    </div>
                ) : null}

                {headerFilters ? <div className={styles.Filters}>{headerFilters}</div> : null}
            </header>

            <main className={styles.Main}>
                <MainOverlay isFetching={isLoading} hasError={isError} isEmpty={isEmpty} errorMessage={errorMessage} onRetry={onRetry}>
                    <div className={styles.MainInner}>{main}</div>
                </MainOverlay>
            </main>

            {footer ? (
                <footer className={styles.Footer}>
                    <div className={styles.FooterInner}>{footer}</div>
                </footer>
            ) : null}
        </div>

        {overlays}
    </>
);

export default CompactPageShell;
