import React from 'react';
import classNames from 'classnames';
import styles from './MutedIconLabel.module.scss';
import type { LabelCommonProps } from '../../Label';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';

const MutedIconLabel = (props: LabelCommonProps) => {
    const { icon, direction = 'row', required = false, gap = 8, children, className, text, style, ...rest } = props;

    const rootClassName = classNames(
        styles.MutedIconLabel,
        {
            [styles.Row]: direction === 'row',
            [styles.Column]: direction === 'column',
        },
        className
    );

    const cssVariables: CSSVariables = {
        '--label-gap': `${gap}px`,
    };

    return (
        <div className={rootClassName} {...rest} style={{ ...cssVariables, ...style }}>
            {icon ? (
                <div className={styles.LabelLine}>
                    <span className={styles.Icon}>{icon}</span>
                    <span className={styles.Text}>
                        {text}
                        {required ? <span className={styles.Required}> (필수)</span> : null}
                    </span>
                </div>
            ) : null}

            <div className={styles.Content}>{children}</div>
        </div>
    );
};

export default MutedIconLabel;
