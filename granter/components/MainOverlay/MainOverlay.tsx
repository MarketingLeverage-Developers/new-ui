import type { ReactNode } from 'react';
import React, { useEffect, useMemo, useRef } from 'react';
import StaticOverlay from '../../../StaticOverlay/StaticOverlay';
import LogoLottie from '../../../LogoLottie/LogoLottie';
import BlurOverlay from '../../../BlurOverlay/BlurOverlay';
import ErrorFallback from '../../../ErrorFallback/ErrorFallback';
import DeferredComponent from '@/components/feature/deferred/DeferredComponent';
import styles from './MainOverlay.module.scss';

export type MainOverlayState = {
    isFetching?: boolean;
    isEmpty?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    suspenseFallbackCenterNode?: ReactNode;
    fetchingOverlayCenterNode?: ReactNode;
};

export type MainOverlayActions = {
    onRetry?: () => void | Promise<unknown>;
};

export type MainOverlayProps = {
    children?: ReactNode;
    state?: MainOverlayState;
    actions?: MainOverlayActions;
    // -- Legacy Props --
    isFetching?: boolean;
    isEmpty?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    suspenseFallbackCenterNode?: ReactNode;
    fetchingOverlayCenterNode?: ReactNode;
    onRetry?: () => void | Promise<unknown>;
};

type OverlayMode = 'none' | 'initial' | 'blur';

const MainOverlay: React.FC<MainOverlayProps> = ({
    children,
    state,
    actions,
    isFetching: _isFetching,
    isEmpty: _isEmpty,
    hasError: _hasError,
    errorMessage: _errorMessage,
    suspenseFallbackCenterNode: _suspenseFallbackCenterNode,
    fetchingOverlayCenterNode: _fetchingOverlayCenterNode,
    onRetry: _onRetry,
}) => {
    const isFetching = _isFetching ?? state?.isFetching ?? false;
    const isEmpty = _isEmpty ?? state?.isEmpty ?? false;
    const hasError = _hasError ?? state?.hasError ?? false;
    const errorMessage = _errorMessage ?? state?.errorMessage;
    const suspenseFallbackCenterNode = _suspenseFallbackCenterNode ?? state?.suspenseFallbackCenterNode;
    const fetchingOverlayCenterNode = _fetchingOverlayCenterNode ?? state?.fetchingOverlayCenterNode;
    const onRetry = _onRetry ?? actions?.onRetry;
    const hasStartedFirstFetchRef = useRef(false);
    const hasCompletedFirstFetchRef = useRef(false);

    useEffect(() => {
        if (isFetching) {
            hasStartedFirstFetchRef.current = true;
            return;
        }

        if (hasStartedFirstFetchRef.current) {
            hasCompletedFirstFetchRef.current = true;
        }
    }, [isFetching]);

    useEffect(() => {
        // 페이지 진입 시 이미 데이터가 있는 경우, 첫 fetch를 initial로 취급하지 않는다.
        if (!isFetching && !isEmpty) {
            hasCompletedFirstFetchRef.current = true;
        }
    }, [isFetching, isEmpty]);

    const mode: OverlayMode = useMemo(() => {
        if (hasError || !isFetching) return 'none';
        if (!hasCompletedFirstFetchRef.current) return 'initial';
        return 'blur';
    }, [hasError, isFetching]);

    const deferredConfig = useMemo(() => {
        if (mode === 'initial' || mode === 'blur') {
            return { delay: 300, minVisibleMs: 1000 };
        }
        return { delay: 0, minVisibleMs: 0 };
    }, [mode]);

    const overlayNode = useMemo(() => {
        if (mode === 'initial') {
            return (
                <StaticOverlay
                    centerNode={
                        suspenseFallbackCenterNode ?? (
                            <div className={styles.LoadingLogoSmall}>
                                <LogoLottie />
                            </div>
                        )
                    }
                />
            );
        }
        if (mode === 'blur') {
            return (
                <BlurOverlay
                    centerNode={
                        fetchingOverlayCenterNode ?? (
                            <div className={styles.LoadingLogoSmall}>
                                <LogoLottie />
                            </div>
                        )
                    }
                />
            );
        }
        return null;
    }, [mode, suspenseFallbackCenterNode, fetchingOverlayCenterNode]);

    if (hasError) {
        return (
            <div className={styles.Root}>
                {children}
                <StaticOverlay
                    centerNode={
                        <ErrorFallback
                            message={errorMessage}
                            onRetry={async () => {
                                await onRetry?.();
                            }}
                        />
                    }
                />
            </div>
        );
    }

    return (
        <div className={styles.Root}>
            {children}
            {overlayNode ? (
                <DeferredComponent
                    active={mode !== 'none'}
                    delay={deferredConfig.delay}
                    minVisibleMs={deferredConfig.minVisibleMs}
                >
                    {overlayNode}
                </DeferredComponent>
            ) : null}
        </div>
    );
};

export default MainOverlay;
