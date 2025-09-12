import React from 'react';
import styles from './PageName.module.scss';
import PageNameMobile from './PageNameMobile';

type PageNameProps = {
    text: string;
};

const PageName = ({ text }: PageNameProps) => <h1 className={styles.PageName}>{text}</h1>;

export default PageName;

PageName.Mobile = PageNameMobile;
