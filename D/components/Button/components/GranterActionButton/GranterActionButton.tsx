import React from 'react';
import classNames from 'classnames';
import styles from './GranterActionButton.module.scss';

export type GranterActionButtonVariant = 'white' | 'white-border' | 'black' | 'ghost' | 'red-ghost';
export type GranterActionButtonSize = 'sm' | 'md' | 'header';

export type GranterActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: GranterActionButtonVariant;
    size?: GranterActionButtonSize;
};

const GranterActionButton = ({
    variant = 'white',
    size = 'md',
    className,
    type = 'button',
    ...rest
}: GranterActionButtonProps) => (
    <button
        type={type}
        className={classNames(
            styles.Button,
            {
                [styles.VariantWhite]: variant === 'white',
                [styles.VariantWhiteBorder]: variant === 'white-border',
                [styles.VariantBlack]: variant === 'black',
                [styles.VariantGhost]: variant === 'ghost',
                [styles.VariantRedGhost]: variant === 'red-ghost',
                [styles.SizeSm]: size === 'sm',
                [styles.SizeMd]: size === 'md',
                [styles.SizeHeader]: size === 'header',
            },
            className
        )}
        {...rest}
    />
);

export default GranterActionButton;
