import React from 'react';
import classNames from 'classnames';
import styles from './ModalTemplateFooter.module.scss';

export type ModalTemplateFooterProps = {
    className?: string;
    children?: React.ReactNode;
};

const ModalTemplateFooter: React.FC<ModalTemplateFooterProps> = (props) => {
    const { className, children } = props;

    const rootClassName = classNames(styles.ModalTemplateFooter, className);

    return <div className={rootClassName}>{children}</div>;
};

export default ModalTemplateFooter;
