import React from 'react';
import classNames from 'classnames';
import styles from './EmptyStatePanel.module.scss';

type EmptyStatePanelCssProperties = React.CSSProperties & {
    '--granter-empty-state-height'?: string;
    '--granter-empty-state-min-height'?: string;
};

export type EmptyStatePanelProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    height?: number | string;
    minHeight?: number | string;
};

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

const EmptyStatePanel = ({
    icon,
    title,
    description,
    height,
    minHeight,
    className,
    style,
    ...props
}: EmptyStatePanelProps) => {
    const cssVariables: EmptyStatePanelCssProperties = {
        '--granter-empty-state-height': toCssLength(height),
        '--granter-empty-state-min-height': toCssLength(minHeight),
        ...style,
    };

    return (
        <div className={classNames(styles.Root, className)} style={cssVariables} {...props}>
            {icon ? <span className={styles.Icon}>{icon}</span> : null}
            <span className={styles.Copy}>
                <strong>{title}</strong>
                {description ? <small>{description}</small> : null}
            </span>
        </div>
    );
};

export default EmptyStatePanel;
