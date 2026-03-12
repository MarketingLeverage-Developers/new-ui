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
            <RadixTooltip.Root>
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
                        className={classNames(styles.Content, contentClassName)}
                        style={{ maxWidth: toCssLength(maxWidth) }}
                    >
                        <span className={styles.Label}>{content}</span>
                        {showArrow ? <RadixTooltip.Arrow className={styles.Arrow} width={12} height={7} /> : null}
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
};

export default Tooltip;
