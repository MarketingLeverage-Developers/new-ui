import type { ReactNode } from 'react';
import React from 'react';
import StaticOverlay from '../../../StaticOverlay/StaticOverlay';
import LogoLottie from '../../../LogoLottie/LogoLottie';
import BlurOverlay from '../../../BlurOverlay/BlurOverlay';
import ErrorFallback from '../../../ErrorFallback/ErrorFallback';

type MainOverlayProps = {
    children: ReactNode;
    isFetching?: boolean;
    isEmpty?: boolean;
    hasError?: boolean;
    errorMessage?: string;
    suspenseFallbackCenterNode?: ReactNode;
    fetchingOverlayCenterNode?: ReactNode;
    onRetry?: () => void;
};

const MainOverlay: React.FC<MainOverlayProps> = ({
    children,
    isFetching = false,
    isEmpty = false,
    hasError = false,
    errorMessage,
    suspenseFallbackCenterNode,
    fetchingOverlayCenterNode,
    onRetry,
}) => {
    if (hasError) {
        return (
            <>
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
            </>
        );
    }

    if (!isFetching) {
        return <>{children}</>;
    }

    if (isEmpty) {
        return (
            <>
                {children}
                <StaticOverlay centerNode={suspenseFallbackCenterNode ?? <LogoLottie />} />
            </>
        );
    }

    return (
        <>
            {children}
            <BlurOverlay centerNode={fetchingOverlayCenterNode ?? <LogoLottie />} />
        </>
    );
};

export default MainOverlay;
