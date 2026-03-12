import React from 'react';
import classNames from 'classnames';
import styles from './Button.module.scss';

export type ButtonVariant =
    | 'black'
    | 'white'
    | 'gray'
    | 'light'
    | 'outline'
    | 'icon'
    | 'icon-strong'
    | 'danger-ghost'
    | 'ghost';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-wide';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    plain?: boolean;
    type?: 'button' | 'submit' | 'reset';
};

export type VariantButtonProps = Omit<ButtonProps, 'variant'>;

const Button = ({
    className,
    variant = 'outline',
    size = 'md',
    leftIcon,
    rightIcon,
    plain = false,
    children,
    type = 'button',
    ...props
}: ButtonProps) => {
    const iconOnly = !plain && !children && Boolean(leftIcon || rightIcon);

    return (
        <button
            type={type}
            className={classNames(
                styles.Button,
                !plain && styles[`Variant-${variant}`],
                !plain && styles[`Size-${size}`],
                className
            )}
            data-icon-only={iconOnly ? 'true' : 'false'}
            {...props}
        >
            {plain ? (
                children
            ) : (
                <span className={styles.Content}>
                    {leftIcon ? <span className={styles.Icon}>{leftIcon}</span> : null}
                    {children ? <span className={styles.Label}>{children}</span> : null}
                    {rightIcon ? <span className={styles.Icon}>{rightIcon}</span> : null}
                </span>
            )}
        </button>
    );
};

export default Button;
