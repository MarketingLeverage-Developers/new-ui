import React from 'react';
import styles from './MutedIconLabel.module.scss';
import type { LabelCommonProps } from '../../Label';
import classNames from 'classnames';

const MutedIconLabel = (props: LabelCommonProps) => {
    const { icon, direction = 'row', children, className, text, ...rest } = props;

    const rootClassName = classNames(
        styles.MutedIconLabel,
        {
            [styles.Row]: direction === 'row',
            [styles.Column]: direction === 'column',
        },
        className
    );

    return (
        <div className={rootClassName} {...rest}>
            {icon ? (
                <div className={styles.LabelLine}>
                    <span className={styles.Icon}>{icon}</span>
                    <span className={styles.Text}>{text}</span>
                </div>
            ) : null}

            <div className={styles.Content}>{children}</div>
        </div>
    );
};

export default MutedIconLabel;
