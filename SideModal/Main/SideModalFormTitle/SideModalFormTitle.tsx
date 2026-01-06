import React from 'react';
import styles from './SideModalFormTitle.module.scss';

const SideModalFormTitle = ({ title }: { title: string }) => <div className={styles.FormTitle}>{title}</div>;

export default SideModalFormTitle;
