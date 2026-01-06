import React from 'react';
import styles from './Main.module.scss';
import SideModalFormLine from './SideModalFormLine/SideModalFormLine';
import SideModalFormTitle from './SideModalFormTitle/SideModalFormTitle';

const Main = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.SideModalMain}>
        <div className={styles.MainWrapper}>{children}</div>
    </div>
);

export default Main;

Main.SideModalFormTitle = SideModalFormTitle;
Main.SideModalFormLine = SideModalFormLine;
