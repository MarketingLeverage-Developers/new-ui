import React from 'react';
import styles from './PageName.module.scss';

type PageNameProps = {
    text: string;
};

const PageNameMobile = ({ text }: PageNameProps) => <h1 className={styles.PageNameMobile}>{text}</h1>;

export default PageNameMobile;
