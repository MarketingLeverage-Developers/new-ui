import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './BoxButton.module.scss';
import { MdKeyboardArrowRight } from 'react-icons/md';

export type BoxButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
};

const BoxButton = forwardRef<HTMLButtonElement, BoxButtonProps>((props, ref) => {
    const { className, type = 'button', children, ...rest } = props;

    const rootClassName = classNames(styles.BoxButton, className);

    return (
        <button ref={ref} type={type} className={rootClassName} {...rest}>
            <span className={styles.Text}>{children}</span>

            <span className={styles.Circle} aria-hidden>
                <MdKeyboardArrowRight className={styles.Icon} />
            </span>
        </button>
    );
});

BoxButton.displayName = 'BoxButton';

export default BoxButton;
