import React from 'react';
import classNames from 'classnames';
import styles from './ModalTemplateHeader.module.scss';
import { MdClose } from 'react-icons/md';

export type ModalTemplateHeaderProps = {
    className?: string;
    title?: string;
    subTitle?: string;
    placeholder?: string;
    onTitleChange?: (title: string) => void;
    onClose?: () => void;
    actions?: React.ReactNode;
};

const ModalTemplateHeader: React.FC<ModalTemplateHeaderProps> = (props) => {
    const { className, title, subTitle, onTitleChange, placeholder, onClose, actions } = props;
    const rootClassName = classNames(styles.ModalTemplateHeader, className);

    return (
        <div className={rootClassName}>
            <div className={styles.TopRow}>
                <div className={styles.SubTitle}>{subTitle}</div>
                {actions || onClose ? (
                    <div className={styles.Right}>
                        {actions ? <div className={styles.Actions}>{actions}</div> : null}
                        {onClose ? (
                            <button type="button" className={styles.CloseButton} onClick={onClose} aria-label="close">
                                <MdClose />
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </div>
            {onTitleChange ? (
                <input
                    value={title}
                    onChange={(e) => onTitleChange?.(e.target.value)}
                    className={styles.TitleInput}
                    placeholder={placeholder}
                />
            ) : (
                <div className={styles.Title}>{title}</div>
            )}
        </div>
    );
};

export default ModalTemplateHeader;
