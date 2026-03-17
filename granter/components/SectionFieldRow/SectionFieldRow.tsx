import React from 'react';
import classNames from 'classnames';
import styles from './SectionFieldRow.module.scss';

type Align = 'center' | 'start';

type SectionFieldRowCssProperties = React.CSSProperties & {
    '--granter-section-field-label-width'?: string;
};

export type SectionFieldRowProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    label: React.ReactNode;
    value?: React.ReactNode;
    children?: React.ReactNode;
    labelWidth?: number | string;
    align?: Align;
    divider?: boolean;
    labelClassName?: string;
    contentClassName?: string;
    valueClassName?: string;
};

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

const SectionFieldRow = ({
    label,
    value,
    children,
    labelWidth,
    align = 'center',
    divider = true,
    className,
    labelClassName,
    contentClassName,
    valueClassName,
    style,
    ...props
}: SectionFieldRowProps) => {
    const cssVariables: SectionFieldRowCssProperties = {
        '--granter-section-field-label-width': toCssLength(labelWidth),
        ...style,
    };

    return (
        <div
            className={classNames(styles.Root, className)}
            style={cssVariables}
            data-align={align}
            data-divider={divider ? 'true' : 'false'}
            {...props}
        >
            <div className={classNames(styles.Label, labelClassName)}>{label}</div>
            <div className={classNames(styles.Content, contentClassName)}>
                {children ?? (value !== undefined ? <div className={classNames(styles.Value, valueClassName)}>{value}</div> : null)}
            </div>
        </div>
    );
};

export default SectionFieldRow;
