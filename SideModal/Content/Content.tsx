import Modal, { useModal } from '@/shared/headless/Modal/Modal';
import Portal from '@/shared/headless/Portal/Portal';
import React from 'react';
import classNames from 'classnames';
import styles from './Content.module.scss';
import Header from '../Header/Header';
import Main from '../Main/Main';

const Content = ({ children }: { children: React.ReactNode }) => {
    const { modalValue } = useModal();
    const classnames = classNames(styles.SideModalContent, {
        [styles.Open]: modalValue,
        [styles.Closed]: !modalValue,
    });

    return (
        <Portal>
            <Modal.Backdrop />
            <Modal.Content className={classnames} height="100%">
                {children}
            </Modal.Content>
        </Portal>
    );
};

export default Content;

Content.Header = Header;
Content.Main = Main;
