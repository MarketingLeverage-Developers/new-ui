import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Portal from '@/shared/headless/Portal/Portal';
import Flex from '@/shared/primitives/Flex/Flex';
import Text from '@/shared/primitives/Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import styles from './OnboardingSpotlight.module.scss';

type Placement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

type HighlightRect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

type Step = {
    id: string;
    title: string;
    description: React.ReactNode;
    placement?: Placement;
    stepLabel?: string;
    advanceOnTargetClick?: boolean;
};

type Props = {
    storageKey: string;
    children: React.ReactNode;
    steps?: Step[];
    title?: string;
    description?: React.ReactNode;
    when?: boolean;
    replayKey?: number | string | null;
    padding?: number;
    placement?: Placement;
    stepLabel?: string;
    confirmLabel?: string;
    nextLabel?: string;
    prevLabel?: string;
    doneLabel?: string;
    skipLabel?: string;
    showSkip?: boolean;
    advanceOnTargetClick?: boolean;
    closeOnBackdrop?: boolean;
    onClose?: () => void;
    onComplete?: () => void;
    wrapperStyle?: React.CSSProperties;
};

type TargetProps = {
    stepId: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
};

type SpotlightContextValue = {
    registerTarget: (id: string, el: HTMLDivElement | null) => void;
};

const DEFAULT_PADDING = 8;
const DEFAULT_SINGLE_STEP_ID = 'default';

const placementStyles: Record<Placement, React.CSSProperties> = {
    'top-right': { top: 24, right: 24 },
    'top-left': { top: 24, left: 24 },
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
};

const SpotlightContext = React.createContext<SpotlightContextValue | null>(null);

const Target = ({ stepId, children, style, className }: TargetProps) => {
    const ctx = React.useContext(SpotlightContext);
    const ref = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        ctx?.registerTarget(stepId, ref.current);
        return () => ctx?.registerTarget(stepId, null);
    }, [ctx, stepId]);

    return (
        <div ref={ref} className={className} style={style}>
            {children}
        </div>
    );
};

const OnboardingSpotlight = ({
    storageKey,
    children,
    steps,
    title,
    description,
    when = true,
    replayKey,
    padding = DEFAULT_PADDING,
    placement = 'top-right',
    stepLabel,
    confirmLabel = '알겠어요',
    nextLabel = '다음',
    prevLabel = '이전',
    doneLabel = '완료',
    skipLabel = '건너뛰기',
    showSkip = true,
    advanceOnTargetClick = false,
    closeOnBackdrop = true,
    onClose,
    onComplete,
    wrapperStyle,
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const targetsRef = useRef<Record<string, HTMLDivElement | null>>({});

    const normalizedSteps = useMemo<Step[]>(() => {
        if (steps && steps.length > 0) return steps;
        return [
            {
                id: DEFAULT_SINGLE_STEP_ID,
                title: title ?? '',
                description: description ?? '',
                placement,
                stepLabel,
            },
        ];
    }, [steps, title, description, placement, stepLabel]);

    const activeStep = normalizedSteps[activeIndex];
    const isMultiStep = normalizedSteps.length > 1;

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setHighlightRect(null);
        onClose?.();
    }, [onClose]);

    useEffect(() => {
        if (!when || isOpen) return;
        let seen = false;
        try {
            seen = localStorage.getItem(storageKey) === '1';
        } catch {}
        if (seen) return;
        try {
            localStorage.setItem(storageKey, '1');
        } catch {}
        setActiveIndex(0);
        setIsOpen(true);
    }, [when, isOpen, storageKey]);

    useEffect(() => {
        if (replayKey == null) return;
        if (!when) return;
        setActiveIndex(0);
        setHighlightRect(null);
        setIsOpen(true);
    }, [replayKey, when]);

    const handleNext = useCallback(() => {
        if (!isMultiStep) {
            handleClose();
            onComplete?.();
            return;
        }
        setActiveIndex((prev) => {
            const next = prev + 1;
            if (next >= normalizedSteps.length) {
                handleClose();
                onComplete?.();
                return prev;
            }
            return next;
        });
    }, [handleClose, isMultiStep, normalizedSteps.length, onComplete]);

    const handlePrev = useCallback(() => {
        if (!isMultiStep) return;
        setActiveIndex((prev) => Math.max(0, prev - 1));
    }, [isMultiStep]);

    const registerTarget = useCallback((id: string, el: HTMLDivElement | null) => {
        targetsRef.current[id] = el;
    }, []);

    const updateHighlightRect = useCallback(() => {
        if (!isOpen) return;
        const target = targetsRef.current[activeStep?.id ?? ''];
        if (!target) {
            setHighlightRect(null);
            return;
        }
        const rect = target.getBoundingClientRect();
        setHighlightRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });
    }, [isOpen, activeStep?.id]);

    useLayoutEffect(() => {
        if (!isOpen) return;
        updateHighlightRect();
    }, [isOpen, updateHighlightRect, activeIndex]);

    useEffect(() => {
        if (!isOpen) return;
        const handle = () => updateHighlightRect();
        window.addEventListener('resize', handle);
        window.addEventListener('scroll', handle, true);
        return () => {
            window.removeEventListener('resize', handle);
            window.removeEventListener('scroll', handle, true);
        };
    }, [isOpen, updateHighlightRect]);

    useEffect(() => {
        if (!isOpen) return;
        const target = targetsRef.current[activeStep?.id ?? ''];
        if (!target || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => updateHighlightRect());
        observer.observe(target);
        return () => observer.disconnect();
    }, [isOpen, updateHighlightRect, activeStep?.id]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose]);

    useEffect(() => {
        if (!isOpen) return;
        const target = targetsRef.current[activeStep?.id ?? ''];
        if (!target) return;
        const shouldAdvance = activeStep?.advanceOnTargetClick ?? advanceOnTargetClick;
        if (!shouldAdvance) return;
        const handleClick = () => handleNext();
        target.addEventListener('click', handleClick);
        return () => target.removeEventListener('click', handleClick);
    }, [isOpen, activeStep?.id, activeStep?.advanceOnTargetClick, advanceOnTargetClick, handleNext]);

    const resolvedPlacement = activeStep?.placement ?? placement;
    const cardStyle = useMemo(() => placementStyles[resolvedPlacement], [resolvedPlacement]);

    const computedStepLabel = useMemo(() => {
        if (activeStep?.stepLabel) return activeStep.stepLabel;
        if (isMultiStep) return `${activeIndex + 1}/${normalizedSteps.length}`;
        return stepLabel;
    }, [activeStep?.stepLabel, isMultiStep, activeIndex, normalizedSteps.length, stepLabel]);

    const stepTitle = activeStep?.title ?? title ?? '';
    const stepDescription = activeStep?.description ?? description ?? '';

    return (
        <SpotlightContext.Provider value={{ registerTarget }}>
            {steps && steps.length > 0 ? (
                children
            ) : (
                <Target stepId={DEFAULT_SINGLE_STEP_ID} style={{ width: '100%', ...wrapperStyle }}>
                    {children}
                </Target>
            )}
            {isOpen && highlightRect && (
                <Portal>
                    <>
                        {closeOnBackdrop && (
                            <div
                                aria-hidden
                                onClick={handleClose}
                                className={styles.OverlayCatcher}
                            />
                        )}
                        <div
                            aria-hidden
                            className={styles.SpotlightHole}
                            style={{
                                top: highlightRect.top - padding,
                                left: highlightRect.left - padding,
                                width: highlightRect.width + padding * 2,
                                height: highlightRect.height + padding * 2,
                            }}
                        />
                        <div
                            role="dialog"
                            aria-modal="true"
                            style={{
                                ...cardStyle,
                            }}
                            className={styles.Card}
                            data-placement={resolvedPlacement}
                        >
                            <Flex direction="column" gap={10}>
                                <Flex align="center" justify="space-between">
                                    <Flex align="center" gap={8}>
                                        <span className={styles.StepDot} />
                                        <Text fontSize={15} fontWeight={600} textColor={getThemeColor('Gray1')}>
                                            {stepTitle}
                                        </Text>
                                    </Flex>
                                    {computedStepLabel && (
                                        <span className={styles.StepPill}>{computedStepLabel}</span>
                                    )}
                                </Flex>
                                <Text fontSize={13} textColor={getThemeColor('Gray2')} style={{ lineHeight: '18px' }}>
                                    {stepDescription}
                                </Text>
                                {isMultiStep ? (
                                    <Flex align="center" justify="space-between" style={{ marginTop: 4 }}>
                                        {showSkip ? (
                                            <button type="button" onClick={handleClose} className={styles.GhostButton}>
                                                {skipLabel}
                                            </button>
                                        ) : (
                                            <span />
                                        )}
                                        <Flex gap={8}>
                                            <button
                                                type="button"
                                                onClick={handlePrev}
                                                disabled={activeIndex === 0}
                                                className={styles.SecondaryButton}
                                            >
                                                {prevLabel}
                                            </button>
                                            <button type="button" onClick={handleNext} className={styles.PrimaryButton}>
                                                {activeIndex === normalizedSteps.length - 1 ? doneLabel : nextLabel}
                                            </button>
                                        </Flex>
                                    </Flex>
                                ) : (
                                    <Flex justify="end" style={{ marginTop: 4 }}>
                                        <button type="button" onClick={handleClose} className={styles.SecondaryButton}>
                                            {confirmLabel}
                                        </button>
                                    </Flex>
                                )}
                            </Flex>
                        </div>
                    </>
                </Portal>
            )}
        </SpotlightContext.Provider>
    );
};

type OnboardingSpotlightComponent = React.FC<Props> & { Target: React.FC<TargetProps> };

(OnboardingSpotlight as OnboardingSpotlightComponent).Target = Target;

export default OnboardingSpotlight as OnboardingSpotlightComponent;
