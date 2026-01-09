import React, { type ReactNode } from 'react';
import styles from './Label.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import type { CSSLength } from '@/shared/types';
import classNames from 'classnames';

type LabelProps = {
    type?: 'vertical' | 'horizontal';
    text: string;
    subText?: string;
    subTextLink?: boolean;
    marginBottom?: CSSLength;
    gap?: CSSLength;
    required?: boolean;
    icon?: ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export const Label = ({
    type = 'vertical',
    text,
    subText,
    marginBottom = 0,
    gap = 8,
    required = false,
    subTextLink = false,
    icon,
    ...props
}: LabelProps) => {
    const cssVariables: CSSVariables = {
        '--margin-bottom': toCssUnit(marginBottom),
        '--gap': toCssUnit(gap),
    };

    const labelClassName = classNames(styles.Label, {
        [styles.Vertical]: type === 'vertical',
        [styles.Horizontal]: type === 'horizontal',
    });

    return (
        <div className={labelClassName} style={{ ...cssVariables }} {...props}>
            <div className={styles.labelWrapper}>
                {icon && icon}
                <div className={styles.TextWrapper}>
                    <span className={styles.Text}>
                        {text}
                        {required && <span className={styles.Required}>*</span>}
                    </span>
                    {subText && subTextLink ? (
                        <a className={styles.SubText} href={subText} target="_blank">
                            {subText}
                        </a>
                    ) : (
                        <span className={styles.SubText}>{subText}</span>
                    )}
                </div>
            </div>

            {props.children}
        </div>
    );
};
