import React from 'react';
import classNames from 'classnames';
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

const BasicModal = ({
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
};

export default BasicModal;
