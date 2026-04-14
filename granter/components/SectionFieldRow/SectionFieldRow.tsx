import React from 'react';
import classNames from 'classnames';
import styles from './SectionFieldRow.module.scss';

type Align = 'center' | 'start';
type Layout = 'inline' | 'stacked';

type SectionFieldRowCssProperties = React.CSSProperties & {
    '--granter-section-field-label-width'?: string;
};

export type SectionFieldRowProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    label: React.ReactNode;
    value?: React.ReactNode;
    children?: React.ReactNode;
    required?: boolean;
    error?: React.ReactNode;
    labelWidth?: number | string;
    align?: Align;
    layout?: Layout;
    divider?: boolean;
    labelClassName?: string;
    contentClassName?: string;
    valueClassName?: string;
};

export type SectionFieldRowSubFieldProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    label?: React.ReactNode;
    children?: React.ReactNode;
    required?: boolean;
    labelClassName?: string;
    contentClassName?: string;
};

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

const SectionFieldRowSubField = ({
    label,
    children,
    required,
    className,
    labelClassName,
    contentClassName,
    ...props
}: SectionFieldRowSubFieldProps) => (
    <div className={classNames(styles.SubField, className)} {...props}>
        {label !== undefined ? (
            <div className={classNames(styles.SubFieldLabel, labelClassName)}>
                <span className={styles.LabelInner}>
                    <span className={styles.LabelText}>{label}</span>
                    {required ? <span className={styles.RequiredMark}>*</span> : null}
                </span>
            </div>
        ) : null}
        {children !== undefined ? <div className={classNames(styles.SubFieldContent, contentClassName)}>{children}</div> : null}
    </div>
);

type SectionFieldRowComponent = ((props: SectionFieldRowProps) => React.ReactElement) & {
    SubField: typeof SectionFieldRowSubField;
};

const SectionFieldRow = (({
    label,
    value,
    children,
    required,
    error,
    labelWidth,
    align = 'center',
    layout = 'inline',
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
            data-layout={layout}
            data-divider={divider ? 'true' : 'false'}
            {...props}
        >
            <div className={classNames(styles.Label, labelClassName)}>
                <span className={styles.LabelInner}>
                    <span className={styles.LabelText}>{label}</span>
                    {required ? <span className={styles.RequiredMark}>*</span> : null}
                </span>
            </div>
            <div className={classNames(styles.Content, contentClassName)}>
                {children ? (
                    <div className={styles.FieldStack}>
                        {children}
                        {error ? <div className={styles.Error}>{error}</div> : null}
                    </div>
                ) : value !== undefined ? (
                    <div className={classNames(styles.Value, valueClassName)}>{value}</div>
                ) : null}
            </div>
        </div>
    );
}) as SectionFieldRowComponent;

SectionFieldRow.SubField = SectionFieldRowSubField;

export default SectionFieldRow;
