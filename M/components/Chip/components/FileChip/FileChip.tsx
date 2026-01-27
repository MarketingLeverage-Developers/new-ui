import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './FileChip.module.scss';

export type FileChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    name: ReactNode;
    sizeText?: ReactNode;
    onRemove?: () => void;
};

const FileChip = (props: FileChipProps) => {
    const { name, sizeText, className, disabled, ...rest } = props;

    const rootClassName = classNames(
        styles.FileChip,
        {
            [styles.Disabled]: disabled,
        },
        className
    );

    return (
        <button type="button" className={rootClassName} disabled={disabled} {...rest}>
            <div className={styles.Left}>
                <span className={styles.Name}>{name}</span>
                {sizeText ? <span className={styles.Size}>{sizeText}</span> : null}
            </div>
        </button>
    );
};

export default FileChip;
