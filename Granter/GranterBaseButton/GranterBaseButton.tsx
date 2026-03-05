import React from 'react';
import styles from './GranterBaseButton.module.scss';

export type GranterBaseButtonVariant = 'solid' | 'outline' | 'ghost' | 'soft';
export type GranterBaseButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export type GranterBaseButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
    variant?: GranterBaseButtonVariant;
    size?: GranterBaseButtonSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
};

const GranterBaseButton = ({
    variant = 'outline',
    size = 'md',
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    children,
    type = 'button',
    ...rest
}: GranterBaseButtonProps) => {
    const classes = [
        styles.BaseButton,
        styles[`Variant${variant.charAt(0).toUpperCase()}${variant.slice(1)}`],
        styles[`Size${size.charAt(0).toUpperCase()}${size.slice(1)}`],
        fullWidth ? styles.FullWidth : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button type={type} className={classes} {...rest}>
            {leftIcon ? <span className={styles.Icon}>{leftIcon}</span> : null}
            {children ? <span className={styles.Label}>{children}</span> : null}
            {rightIcon ? <span className={styles.Icon}>{rightIcon}</span> : null}
        </button>
    );
};

export default GranterBaseButton;
