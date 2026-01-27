import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './BoxButton.module.scss';
import { MdKeyboardArrowRight, MdClose } from 'react-icons/md';
import { Common } from '@/shared/primitives/C/Common';

export type BoxButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    imageSrc?: string;
    imageAlt?: string;
    showRemove?: boolean;
    onRemove?: () => void;
};

const BoxButton = forwardRef<HTMLButtonElement, BoxButtonProps>((props, ref) => {
    const {
        className,
        type = 'button',
        children,
        imageSrc,
        imageAlt,
        showRemove = false,
        onRemove,
        disabled,
        ...rest
    } = props;

    const rootClassName = classNames(styles.BoxButton, className);
    const apiPrefix = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : undefined;

    const handleRemoveClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove?.();
    };

    const hasImage = !!imageSrc;

    return (
        <button ref={ref} type={type} className={rootClassName} disabled={disabled} {...rest}>
            {hasImage ? (
                <Common.Image
                    className={styles.Image}
                    src={imageSrc}
                    prefix={apiPrefix}
                    alt={imageAlt ?? ''}
                    width="100%"
                    height="100%"
                    fit="cover"
                    block
                />
            ) : null}

            {showRemove && hasImage && !disabled ? (
                <button type="button" className={styles.RemoveButton} onClick={handleRemoveClick} aria-label="remove">
                    <MdClose className={styles.RemoveIcon} aria-hidden />
                </button>
            ) : null}

            {!hasImage ? (
                <>
                    <span className={styles.Text}>{children}</span>
                    <span className={styles.Circle} aria-hidden>
                        <MdKeyboardArrowRight className={styles.Icon} />
                    </span>
                </>
            ) : null}
        </button>
    );
});

BoxButton.displayName = 'BoxButton';

export default BoxButton;
