import React from 'react';
import styles from './SideModalFormLine.module.scss';
import classNames from 'classnames';

type SideModalFormLineProps = {
    label: string;
    noBorder?: boolean;
    alignColumn?: boolean;
    children: React.ReactNode;
};
const SideModalFormLine = ({ label, children, noBorder = false, alignColumn = false }: SideModalFormLineProps) => {
    const SideModalFormLine = classNames(styles.SideModalFormLine, {
        [styles.NoBorder]: noBorder,
        [styles.AlignColumn]: alignColumn,
    });

    return (
        <div className={SideModalFormLine}>
            <span className={styles.Label}>{label}</span>
            <div className={styles.Children}>{children}</div>
        </div>
    );
};

export default SideModalFormLine;
