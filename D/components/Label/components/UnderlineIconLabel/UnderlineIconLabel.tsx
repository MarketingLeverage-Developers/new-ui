import React from 'react';
import classNames from 'classnames';
import type { CSSVariables } from '../../../../../shared/types/css/CSSVariables';
import type { LabelCommonProps } from '../../Label';
import styles from './UnderlineIconLabel.module.scss';

const UnderlineIconLabel = (props: LabelCommonProps) => {
    const {
        icon,
        direction = 'row',
        required = false,
        gap = 16,
        labelWidth,
        children,
        className,
        text,
        style,
        actions,
        ...rest
    } = props;

    const rootClassName = classNames(
        styles.UnderlineIconLabel,
        {
            [styles.Row]: direction === 'row',
            [styles.Column]: direction === 'column',
        },
        className
    );

    const cssVariables: CSSVariables = {
        '--label-gap': `${gap}px`,
    };

    if (labelWidth !== undefined) {
        cssVariables['--label-width'] = typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth;
    }

    const headerClassName = classNames(styles.LabelHeader, { [styles.HasActions]: Boolean(actions) });
    const hasLabelHeader = Boolean(icon || text || actions);

    return (
        <div className={rootClassName} {...rest} style={{ ...cssVariables, ...style }}>
            {hasLabelHeader ? (
                <div className={headerClassName}>
                    <div className={styles.LabelLine}>
                        {icon ? <span className={styles.Icon}>{icon}</span> : null}
                        {text ? (
                            <span className={styles.Text}>
                                {text}
                                {required ? <span className={styles.Required}> (필수)</span> : null}
                            </span>
                        ) : null}
                    </div>
                    {actions}
                </div>
            ) : null}

            <div className={styles.Content}>{children}</div>
        </div>
    );
};

export default UnderlineIconLabel;
