import React from 'react';
import classNames from 'classnames';
import styles from './ModalTemplateMain.module.scss';

export type ModalTemplateMainProps = {
    className?: string;
    children?: React.ReactNode;
};

const ModalTemplateMain: React.FC<ModalTemplateMainProps> = (props) => {
    const { className, children } = props;

    const rootClassName = classNames(styles.ModalTemplateMain, className);

    return <div className={rootClassName}>{children}</div>;
};

export default ModalTemplateMain;
