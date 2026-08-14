import React from 'react';
import classNames from 'classnames';
import { FiX } from 'react-icons/fi';
import Modal from '../../../shared/headless/Modal/Modal';
import Portal from '../../../shared/headless/Portal/Portal';
import styles from './BasicModal.module.scss';

export type BasicModalProps = {
    open: boolean;
    onChange: () => void;
    content: React.ReactNode;
    keepMounted?: boolean;
    width?: string | number;
    height?: string | number;
    maxHeight?: string | number;
    enterAction?: () => void;
    lockBodyScroll?: boolean;
    closeOnEsc?: boolean;
    contentClassName?: string;
    backdropClassName?: string;
};

export type BasicModalFormContentProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    children: React.ReactNode;
    footer?: React.ReactNode;
    onClose: () => void;
    closeLabel: string;
    closeDisabled?: boolean;
    className?: string;
    bodyClassName?: string;
    footerClassName?: string;
    density?: 'default' | 'compact';
};

export type BasicModalConfirmContentProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    primaryAction: React.ReactNode;
    secondaryAction?: React.ReactNode;
    tone?: 'primary' | 'danger' | 'success';
    className?: string;
};

type BasicModalComponent = ((props: BasicModalProps) => React.JSX.Element | null) & {
    FormContent: React.FC<BasicModalFormContentProps>;
    ConfirmContent: React.FC<BasicModalConfirmContentProps>;
};

const BasicModalFormContent = ({
    title,
    description,
    children,
    footer,
    onClose,
    closeLabel,
    closeDisabled = false,
    className,
    bodyClassName,
    footerClassName,
    density = 'default',
}: BasicModalFormContentProps) => (
    <section className={classNames(styles.FormContent, className)} data-density={density}>
        <button
            type="button"
            className={styles.FormCloseButton}
            aria-label={closeLabel}
            disabled={closeDisabled}
            onClick={onClose}
        >
            <FiX aria-hidden="true" />
        </button>

        <header className={styles.FormIntro}>
            <h2 className={styles.FormTitle}>{title}</h2>
            {description ? <p className={styles.FormDescription}>{description}</p> : null}
        </header>

        <div className={classNames(styles.FormBody, bodyClassName)}>{children}</div>
        {footer ? <footer className={classNames(styles.FormFooter, footerClassName)}>{footer}</footer> : null}
    </section>
);

const BasicModalConfirmContent = ({
    title,
    description,
    primaryAction,
    secondaryAction,
    tone = 'primary',
    className,
}: BasicModalConfirmContentProps) => (
    <section className={classNames(styles.ConfirmContent, className)} data-tone={tone}>
        <div className={styles.ConfirmIntro}>
            <h2 className={styles.ConfirmTitle}>{title}</h2>
            {description ? <p className={styles.ConfirmDescription}>{description}</p> : null}
        </div>
        <div className={styles.ConfirmActions}>
            <div className={styles.ConfirmPrimaryAction}>{primaryAction}</div>
            {secondaryAction ? <div className={styles.ConfirmSecondaryAction}>{secondaryAction}</div> : null}
        </div>
    </section>
);

const BasicModal = (({
    open,
    onChange,
    content,
    keepMounted = false,
    width = 400,
    height = 'auto',
    maxHeight = '80%',
    enterAction,
    lockBodyScroll = true,
    closeOnEsc = true,
    contentClassName,
    backdropClassName,
}: BasicModalProps) => {
    if (!open && !keepMounted) {
        return null;
    }

    return (
        <Modal
            value={open}
            onChange={(nextOpen) => {
                if (!nextOpen) onChange();
            }}
            enterAction={enterAction}
            lockBodyScroll={lockBodyScroll}
            closeOnEsc={closeOnEsc}
        >
            <Portal>
                <Modal.Backdrop className={backdropClassName} />
                <Modal.Content
                    width={width}
                    height={height}
                    maxHeight={maxHeight}
                    className={classNames(styles.BasicModalContent, contentClassName)}
                >
                    {content}
                </Modal.Content>
            </Portal>
        </Modal>
    );
}) as BasicModalComponent;

BasicModal.FormContent = BasicModalFormContent;
BasicModal.ConfirmContent = BasicModalConfirmContent;

export default BasicModal;
