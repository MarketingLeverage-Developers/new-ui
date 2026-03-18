import Modal, { useModal } from '../../shared/headless/Modal/Modal';
import Portal from '../../shared/headless/Portal/Portal';
import React from 'react';
import classNames from 'classnames';
import styles from './Content.module.scss';
import Header from '../Header/Header';
import Main from '../Main/Main';
import type { CSSVariables } from '../../shared/types/css/CSSVariables';
import type { CSSLength } from '../../shared/types';
import { toCssUnit } from '../../shared/utils';

type ContentProps = {
    children: React.ReactNode;
    width?: CSSLength;
};

const Content = ({ children, width }: ContentProps) => {
    const { modalValue } = useModal();
    const classnames = classNames(styles.SideModalContent, {
        [styles.Open]: modalValue,
        [styles.Closed]: !modalValue,
    });

    const cssVariables: CSSVariables = {
        '--side-modal-width': width != null ? toCssUnit(width) : undefined,
    };

    return (
        <Portal>
            <Modal.Backdrop />
            <Modal.Content
                className={classnames}
                height="100vh"
                maxHeight="100vh"
                style={{
                    top: 0,
                    right: 0,
                    left: 'auto',
                    transform: 'none',
                    pointerEvents: modalValue ? 'auto' : 'none',
                    visibility: modalValue ? 'visible' : 'hidden',
                    zIndex: modalValue ? 1000 : -1,
                    ...cssVariables,
                }}
            >
                {children}
            </Modal.Content>
        </Portal>
    );
};

export default Content;

Content.Header = Header;
Content.Main = Main;
