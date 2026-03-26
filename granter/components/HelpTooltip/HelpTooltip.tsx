import React from 'react';
import classNames from 'classnames';
import { FiInfo } from 'react-icons/fi';
import Tooltip, { type TooltipProps } from '../Tooltip/Tooltip';
import styles from './HelpTooltip.module.scss';

export type HelpTooltipProps = Omit<TooltipProps, 'children'> & {
    className?: string;
    iconClassName?: string;
    icon?: React.ReactNode;
    ariaLabel?: string;
};

const HelpTooltip = ({
    content,
    className,
    iconClassName,
    icon,
    ariaLabel = '도움말 보기',
    side = 'top',
    align = 'center',
    sideOffset = 8,
    ...tooltipProps
}: HelpTooltipProps) => (
    <Tooltip content={content} side={side} align={align} sideOffset={sideOffset} {...tooltipProps}>
        <button type="button" className={classNames(styles.Trigger, className)} aria-label={ariaLabel}>
            <span className={classNames(styles.Icon, iconClassName)} aria-hidden="true">
                {icon ?? <FiInfo size={14} />}
            </span>
        </button>
    </Tooltip>
);

export default HelpTooltip;
