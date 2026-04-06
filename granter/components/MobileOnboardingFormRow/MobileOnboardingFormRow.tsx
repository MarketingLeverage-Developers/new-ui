import React from 'react';
import classNames from 'classnames';
import styles from './MobileOnboardingFormRow.module.scss';

type Align = 'center' | 'start';

type MobileOnboardingFormRowCssProperties = React.CSSProperties & {
    '--granter-mobile-onboarding-form-row-label-width'?: string;
};

export type MobileOnboardingFormRowProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    label: React.ReactNode;
    children?: React.ReactNode;
    required?: boolean;
    error?: React.ReactNode;
    labelWidth?: number | string;
    align?: Align;
    divider?: boolean;
    labelClassName?: string;
    contentClassName?: string;
};

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

const MobileOnboardingFormRow = ({
    label,
    children,
    required = false,
    error,
    labelWidth,
    align = 'center',
    divider = true,
    className,
    labelClassName,
    contentClassName,
    style,
    ...props
}: MobileOnboardingFormRowProps) => {
    const cssVariables: MobileOnboardingFormRowCssProperties = {
        '--granter-mobile-onboarding-form-row-label-width': toCssLength(labelWidth),
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
            <div className={classNames(styles.Label, labelClassName)}>
                <span className={styles.LabelInner}>
                    <span className={styles.LabelText}>{label}</span>
                    {required ? <span className={styles.RequiredMark}>*</span> : null}
                </span>
            </div>

            <div className={classNames(styles.Content, contentClassName)}>
                <div className={styles.FieldStack}>
                    {children}
                    {error ? <div className={styles.Error}>{error}</div> : null}
                </div>
            </div>
        </div>
    );
};

export default MobileOnboardingFormRow;
