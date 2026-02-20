import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import ErrorFallback from '../../../ErrorFallback/ErrorFallback';
import StrictLoadingFallback from '../../../StrictLoadingFallback/StrictLoadingFallback';

type StrictOverlayProps = {
    children: React.ReactNode;
    errorFallbackNode?: React.ReactNode;
    onError?: (error: unknown) => void;
    onRetry?: () => Promise<void> | void;
};

const StrictOverlay = ({ children, errorFallbackNode, onError, onRetry }: StrictOverlayProps) => (
    <QueryErrorResetBoundary>
        {({ reset }) => (
            <ErrorBoundary
                onError={(error) => onError?.(error)}
                onReset={reset}
                fallbackRender={({ resetErrorBoundary }) =>
                    errorFallbackNode ?? (
                        <ErrorFallback
                            onRetry={async () => {
                                resetErrorBoundary();
                                await onRetry?.();
                            }}
                        />
                    )
                }
            >
                <Suspense fallback={<StrictLoadingFallback />}>{children}</Suspense>
            </ErrorBoundary>
        )}
    </QueryErrorResetBoundary>
);

export default StrictOverlay;
