import React from 'react';
import classNames from 'classnames';
import styles from './EmptyGuideBox.module.scss';

type EmptyGuideBoxCssProperties = React.CSSProperties & {
    '--granter-empty-guide-height'?: string;
    '--granter-empty-guide-min-height'?: string;
};

export type EmptyGuideBoxProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    icon?: React.ReactNode;
    children?: React.ReactNode;
    height?: number | string;
    minHeight?: number | string;
};

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

const EmptyGuideBox = ({ icon, children, height, minHeight, className, style, ...props }: EmptyGuideBoxProps) => {
    const cssVariables: EmptyGuideBoxCssProperties = {
        '--granter-empty-guide-height': toCssLength(height),
        '--granter-empty-guide-min-height': toCssLength(minHeight),
        ...style,
    };

    return (
        <div className={classNames(styles.Root, className)} style={cssVariables} {...props}>
            {icon ? <span className={styles.Icon}>{icon}</span> : null}
            {children ? <span className={styles.Text}>{children}</span> : null}
        </div>
    );
};

export default EmptyGuideBox;
