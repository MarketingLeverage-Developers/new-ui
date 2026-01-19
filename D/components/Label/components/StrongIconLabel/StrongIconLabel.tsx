import React from 'react';
import styles from './StrongIconLabel.module.scss';
import type { LabelCommonProps } from '../../Label';
import classNames from 'classnames';

const StrongIconLabel = (props: LabelCommonProps) => {
    const { icon, direction = 'row', children, className, text, ...rest } = props;

    const rootClassName = classNames(
        styles.StrongIconLabel,
        {
            [styles.Row]: direction === 'row',
            [styles.Column]: direction === 'column',
        },
        className
    );

    const contentClassName = classNames(styles.Content, {
        [styles.ContentEqual]: direction === 'column',
    });

    return (
        <div className={rootClassName} {...rest}>
            {icon ? (
                <div className={styles.LabelLine}>
                    <span className={styles.Icon}>{icon}</span>
                    <span className={styles.Text}>{text}</span>
                </div>
            ) : null}

            <div className={contentClassName}>{children}</div>
        </div>
    );
};

export default StrongIconLabel;
