import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';
import styles from './TextButton.module.scss';

export type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
};

const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>((props, ref) => {
    const { className, disabled, ...buttonProps } = props;

    const rootClassName = classNames(
        styles.TextButton,
        {
            [styles.Disabled]: disabled,
        },
        className
    );

    return <button ref={ref} type="button" {...buttonProps} className={rootClassName} disabled={disabled} />;
});

TextButton.displayName = 'TextButton';

export default TextButton;
