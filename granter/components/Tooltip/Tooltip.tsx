import React from 'react';
import classNames from 'classnames';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import styles from './Tooltip.module.scss';

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipAlign = 'start' | 'center' | 'end';

export type TooltipProps = {
    content: React.ReactNode;
    children: React.ReactNode;
    side?: TooltipSide;
    align?: TooltipAlign;
    sideOffset?: number;
    alignOffset?: number;
    collisionPadding?: number;
    delayDuration?: number;
    showArrow?: boolean;
    disabled?: boolean;
    maxWidth?: number | string;
    contentClassName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onEscapeKeyDown?: React.ComponentProps<typeof RadixTooltip.Content>['onEscapeKeyDown'];
    onPointerDownOutside?: React.ComponentProps<typeof RadixTooltip.Content>['onPointerDownOutside'];
};

const Tooltip = ({
    content,
    children,
    side = 'top',
    align = 'center',
    sideOffset = 6,
    alignOffset = 0,
    collisionPadding = 8,
    delayDuration = 80,
    showArrow = true,
    disabled = false,
    maxWidth,
    contentClassName,
    open,
    onOpenChange,
    onEscapeKeyDown,
    onPointerDownOutside,
}: TooltipProps) => {
    const isEmptyContent = content === null || content === undefined || content === false || content === '';

    if (disabled || isEmptyContent) {
        return <>{children}</>;
    }

    const shouldUseChildDirectly =
        React.isValidElement(children) &&
        children.type !== React.Fragment &&
        typeof children.type === 'string';

    return (
        <RadixTooltip.Provider delayDuration={delayDuration} skipDelayDuration={80}>
            <RadixTooltip.Root open={open} onOpenChange={onOpenChange}>
                {shouldUseChildDirectly ? (
                    <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
                ) : (
                    <RadixTooltip.Trigger asChild>
                        <span className={styles.Trigger}>{children}</span>
                    </RadixTooltip.Trigger>
                )}

                <RadixTooltip.Portal>
                    <RadixTooltip.Content
                        side={side}
                        align={align}
                        sideOffset={sideOffset}
                        alignOffset={alignOffset}
                        collisionPadding={collisionPadding}
                        onEscapeKeyDown={onEscapeKeyDown}
                        onPointerDownOutside={onPointerDownOutside}
                        className={classNames(styles.Content, contentClassName)}
                        style={{ maxWidth: toCssLength(maxWidth) }}
                    >
                        <span className={styles.Label}>{content}</span>
                        {showArrow ? (
                            <RadixTooltip.Arrow asChild className={styles.Arrow} width={12} height={7}>
                                <svg viewBox="0 0 12 7" aria-hidden="true">
                                    <path d="M0 -2H12V0L6 7L0 0Z" />
                                    <path className={styles.ArrowOutline} d="M0 0L6 7L12 0" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </RadixTooltip.Arrow>
                        ) : null}
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
};

export default Tooltip;
