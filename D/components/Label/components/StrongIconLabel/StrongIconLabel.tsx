import React from 'react';
import styles from './StrongIconLabel.module.scss';
import type { LabelCommonProps } from '../../Label';
import classNames from 'classnames';
import type { CSSVariables } from '../../../../../shared/types/css/CSSVariables';

const StrongIconLabel = (props: LabelCommonProps) => {
    const { icon, direction = 'row', gap = 12, children, className, text, style, actions, ...rest } = props;

    const rootClassName = classNames(
        styles.StrongIconLabel,
        {
            [styles.Row]: direction === 'row',
            [styles.Column]: direction === 'column',
        },
        className
    );

    const cssVariables: CSSVariables = {
        '--label-gap': `${gap}px`,
    };

    const actionsClassName = classNames(styles.LabelWarpper, { [styles.HasActions]: Boolean(actions) });
    const hasLabelHeader = Boolean(icon || text || actions);

    return (
        <div className={rootClassName} {...rest} style={{ ...cssVariables, ...style }}>
            {hasLabelHeader ? (
                <div className={actionsClassName}>
                    <div className={styles.LabelLine}>
                        {icon ? <span className={styles.Icon}>{icon}</span> : null}
                        {text ? <span className={styles.Text}>{text}</span> : null}
                    </div>
                    {actions && actions}
                </div>
            ) : null}

            <div className={styles.Content}>{children}</div>
        </div>
    );
};

export default StrongIconLabel;
