import React, { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import DeferredComponent from '@/components/feature/deferred/DeferredComponent';
import { toastBus } from '@/utils/toast/ToastUtils';
import styles from './MainOverlay.module.scss';

export type MainOverlayProps = {
    children: ReactNode;
    isFetching?: boolean;
    isEmpty?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    suspenseFallbackCenterNode?: ReactNode;
    fetchingOverlayCenterNode?: ReactNode;
    onRetry?: () => void | Promise<void>;
};

const normalizeErrorMessage = (error: unknown): string => {
    const defaultMessage = '일시적인 오류입니다. 잠시 후 다시 시도해 주세요.';
    if (!error) return defaultMessage;

    if (error instanceof Error) return error.message || defaultMessage;

    const anyObj = error as {
        response?: { data?: { message?: string; error?: { message?: string } } };
        message?: string;
    };

    const message = anyObj?.response?.data?.message ?? anyObj?.response?.data?.error?.message ?? anyObj?.message;

    return message || defaultMessage;
};

const ErrorToastOnce = ({ message }: { message: string }) => {
    const fired = useRef(false);

    useEffect(() => {
        if (fired.current) return;
        fired.current = true;
        toastBus.emit({ kind: 'error', text: message });
    }, [message]);

    return null;
};

type OverlayMode = 'none' | 'initial' | 'blur';

const LoadingFallback = ({ compact = false }: { compact?: boolean }) => (
    <div className={styles.LoadingCard} data-compact={compact ? 'true' : 'false'}>
        <span className={styles.Spinner} aria-hidden="true" />
        <p className={styles.LoadingTitle}>데이터를 불러오는 중입니다</p>
        <p className={styles.LoadingDescription}>잠시만 기다려 주세요.</p>
    </div>
);

const ErrorFallback = ({
    message,
    onRetry,
}: {
    message?: string;
    onRetry?: () => void | Promise<void>;
}) => (
    <div className={styles.ErrorCard} role="alert">
        <span className={styles.ErrorIcon} aria-hidden="true">
            <FiAlertTriangle size={18} />
        </span>
        <p className={styles.ErrorTitle}>오류가 발생했습니다</p>
        <p className={styles.ErrorDescription}>{message || '잠시 후에 다시 시도해 주세요.'}</p>
        {onRetry ? (
            <button
                type="button"
                className={styles.RetryButton}
                onClick={() => {
                    void onRetry();
                }}
            >
                다시 시도
            </button>
        ) : null}
    </div>
);

const MainOverlay = ({
    children,
    isFetching = false,
    isEmpty = false,
    hasError = false,
    errorMessage = '',
    suspenseFallbackCenterNode,
    fetchingOverlayCenterNode,
    onRetry,
}: MainOverlayProps) => {
    const normalizedErrorMessage = useMemo(() => errorMessage || normalizeErrorMessage(null), [errorMessage]);
    const fallbackMessage = useMemo(
        () => (errorMessage && errorMessage.trim().length > 0 ? errorMessage : undefined),
        [errorMessage]
    );

    const hasEverHadDataRef = useRef(false);

    useEffect(() => {
        if (!hasError && !isEmpty) {
            hasEverHadDataRef.current = true;
        }
    }, [hasError, isEmpty]);

    const mode: OverlayMode = useMemo(() => {
        if (hasError) return 'none';
        if (!isFetching) return 'none';

        if (isEmpty) {
            if (!hasEverHadDataRef.current) return 'initial';
            return 'blur';
        }

        return 'blur';
    }, [hasError, isEmpty, isFetching]);

    const deferredConfig = useMemo(() => {
        if (mode === 'initial') return { delay: 300, minVisibleMs: 1000 };
        if (mode === 'blur') return { delay: 300, minVisibleMs: 1000 };
        return { delay: 0, minVisibleMs: 0 };
    }, [mode]);

    const overlayNode = useMemo(() => {
        if (mode === 'initial') {
            return (
                <div className={styles.StaticOverlay}>
                    <div className={styles.Center}>{suspenseFallbackCenterNode ?? <LoadingFallback />}</div>
                </div>
            );
        }

        if (mode === 'blur') {
            return (
                <div className={styles.BlurOverlay}>
                    <div className={styles.Center}>
                        {fetchingOverlayCenterNode ?? <LoadingFallback compact />}
                    </div>
                </div>
            );
        }

        return null;
    }, [fetchingOverlayCenterNode, mode, suspenseFallbackCenterNode]);

    return (
        <>
            {children}
            {hasError ? (
                <>
                    <ErrorToastOnce message={normalizedErrorMessage} />
                    <div className={styles.StaticOverlay}>
                        <div className={styles.Center}>
                            <ErrorFallback message={fallbackMessage} onRetry={onRetry} />
                        </div>
                    </div>
                </>
            ) : null}

            {!hasError && overlayNode !== null ? (
                <DeferredComponent
                    active={mode !== 'none'}
                    delay={deferredConfig.delay}
                    minVisibleMs={deferredConfig.minVisibleMs}
                >
                    {overlayNode}
                </DeferredComponent>
            ) : null}
        </>
    );
};

export default MainOverlay;
