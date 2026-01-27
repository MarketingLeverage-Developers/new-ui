import React from 'react';
import classNames from 'classnames';
import styles from './ModalTemplateHeader.module.scss';
import { MdClose } from 'react-icons/md';
import { useModal } from '@/shared/headless/Modal/Modal';

export type ModalTemplateHeaderProps = {
    className?: string;
    title?: string;
    subTitle?: string;
    placeholder?: string;
    onTitleChange?: (title: string) => void;
    onClose?: () => void;
};

const ModalTemplateHeader: React.FC<ModalTemplateHeaderProps> = (props) => {
    const { className, title, subTitle, onTitleChange, placeholder, onClose } = props;
    const { closeModal } = useModal();
    const handleClose = onClose ?? closeModal;

    const rootClassName = classNames(styles.ModalTemplateHeader, className);

    return (
        <div className={rootClassName}>
            <div className={styles.ModalTopRow}>
                <div className={styles.SubTitle}>{subTitle}</div>
                <button type="button" className={styles.CloseButton} onClick={handleClose} aria-label="close">
                    <MdClose />
                </button>
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
