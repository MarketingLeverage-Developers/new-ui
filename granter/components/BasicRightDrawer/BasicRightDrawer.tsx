import React from 'react';
import classNames from 'classnames';
import Modal from '../../../shared/headless/Modal/Modal';
import Portal from '../../../shared/headless/Portal/Portal';
import styles from './BasicRightDrawer.module.scss';

export type BasicRightDrawerProps = {
    open: boolean;
    onChange: () => void;
    content: React.ReactNode;
    keepMounted?: boolean;
    width?: string | number;
    maxHeight?: string | number;
    enterAction?: () => void;
    lockBodyScroll?: boolean;
    closeOnEsc?: boolean;
    contentClassName?: string;
    backdropClassName?: string;
};

const BasicRightDrawer = ({
    open,
    onChange,
    content,
    keepMounted = false,
    width = 580,
    maxHeight = '100%',
    enterAction,
    lockBodyScroll = true,
    closeOnEsc = true,
    contentClassName,
    backdropClassName,
}: BasicRightDrawerProps) => (
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
                height="100vh"
                maxHeight={maxHeight}
                className={classNames(styles.RightDrawerContent, contentClassName)}
                data-open={open ? 'true' : 'false'}
            >
                {open || keepMounted ? content : null}
            </Modal.Content>
        </Portal>
    </Modal>
);

export default BasicRightDrawer;
