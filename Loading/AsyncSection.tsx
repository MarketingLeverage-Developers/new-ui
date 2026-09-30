import type { ReactNode } from 'react';
import type { AsyncLoadPhase } from '@/shared/utils/asyncLoadState';

type AsyncSectionProps = {
    phase: AsyncLoadPhase;
    loading: ReactNode;
    error: ReactNode;
    children: ReactNode;
};

/** Keeps a section's loading and error UI local while the page remains usable. */
const AsyncSection = ({ phase, loading, error, children }: AsyncSectionProps) => {
    if (phase === 'initial') return <>{loading}</>;
    if (phase === 'error') return <>{error}</>;
    return <>{children}</>;
};

export default AsyncSection;
