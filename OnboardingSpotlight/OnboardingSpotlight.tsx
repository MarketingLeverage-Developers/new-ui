import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Portal from '@/shared/headless/Portal/Portal';
import Flex from '@/shared/primitives/Flex/Flex';
import Text from '@/shared/primitives/Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type Placement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

type HighlightRect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

type Props = {
    storageKey: string;
    title: string;
    description: React.ReactNode;
    children: React.ReactNode;
    when?: boolean;
    padding?: number;
    placement?: Placement;
    stepLabel?: string;
    confirmLabel?: string;
    closeOnBackdrop?: boolean;
    onClose?: () => void;
    wrapperStyle?: React.CSSProperties;
};

const DEFAULT_PADDING = 8;

const placementStyles: Record<Placement, React.CSSProperties> = {
    'top-right': { top: 24, right: 24 },
    'top-left': { top: 24, left: 24 },
    'bottom-right': { bottom: 24, right: 24 },
    'bottom-left': { bottom: 24, left: 24 },
};

const OnboardingSpotlight = ({
    storageKey,
    title,
    description,
    children,
    when = true,
    padding = DEFAULT_PADDING,
    placement = 'top-right',
    stepLabel,
    confirmLabel = '알겠어요',
    closeOnBackdrop = true,
    onClose,
    wrapperStyle,
}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null);
    const targetRef = useRef<HTMLDivElement | null>(null);

    const handleClose = useCallback(() => {
        setIsOpen(false);
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
        setIsOpen(true);
    }, [when, isOpen, storageKey]);

    const updateHighlightRect = useCallback(() => {
        if (!isOpen) return;
        const target = targetRef.current;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        setHighlightRect({
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
        });
    }, [isOpen]);

    useLayoutEffect(() => {
        if (!isOpen) return;
        updateHighlightRect();
    }, [isOpen, updateHighlightRect]);

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
        if (!targetRef.current || typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => updateHighlightRect());
        observer.observe(targetRef.current);
        return () => observer.disconnect();
    }, [isOpen, updateHighlightRect]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleClose]);

    const cardStyle = useMemo(() => placementStyles[placement], [placement]);

    return (
        <>
            <div ref={targetRef} style={{ width: '100%', ...wrapperStyle }}>
                {children}
            </div>
            {isOpen && highlightRect && (
                <Portal>
                    <>
                        {closeOnBackdrop && (
                            <div
                                aria-hidden
                                onClick={handleClose}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    zIndex: 10000,
                                    background: 'transparent',
                                }}
                            />
                        )}
                        <div
                            aria-hidden
                            style={{
                                position: 'fixed',
                                top: highlightRect.top - padding,
                                left: highlightRect.left - padding,
                                width: highlightRect.width + padding * 2,
                                height: highlightRect.height + padding * 2,
                                borderRadius: 12,
                                boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.45)',
                                border: '2px solid rgba(255, 255, 255, 0.9)',
                                zIndex: 10001,
                                pointerEvents: 'none',
                                transition: 'all 180ms ease',
                            }}
                        />
                        <div
                            role="dialog"
                            aria-modal="true"
                            style={{
                                position: 'fixed',
                                zIndex: 10002,
                                width: 260,
                                background: '#fff',
                                borderRadius: 12,
                                padding: 14,
                                boxShadow: '0 12px 24px rgba(15, 23, 42, 0.22)',
                                ...cardStyle,
                            }}
                        >
                            <Flex direction="column" gap={10}>
                                <Flex align="center" justify="space-between">
                                    <Text fontSize={15} fontWeight={600} textColor={getThemeColor('Gray1')}>
                                        {title}
                                    </Text>
                                    {stepLabel && (
                                        <Text fontSize={12} textColor={getThemeColor('Gray3')}>
                                            {stepLabel}
                                        </Text>
                                    )}
                                </Flex>
                                <Text fontSize={13} textColor={getThemeColor('Gray2')} style={{ lineHeight: '18px' }}>
                                    {description}
                                </Text>
                                <Flex justify="end" style={{ marginTop: 4 }}>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        style={{
                                            border: `1px solid ${getThemeColor('Gray4')}`,
                                            background: '#fff',
                                            color: getThemeColor('Gray1'),
                                            borderRadius: 8,
                                            padding: '6px 10px',
                                            fontSize: 12,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {confirmLabel}
                                    </button>
                                </Flex>
                            </Flex>
                        </div>
                    </>
                </Portal>
            )}
        </>
    );
};

export default OnboardingSpotlight;
