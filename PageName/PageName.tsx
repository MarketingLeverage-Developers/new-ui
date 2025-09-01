import React from 'react';
import styles from './PageName.module.scss';

type PageNameProps = {
    text: string;
};

const PageName = ({ text }: PageNameProps) => <h1 className={styles.PageName}>{text}</h1>;

export default PageName;
