import React from 'react';
import styles from './AdRequestItemBox.module.scss';
import Header from './Header/Header';
import Content from './Content/Content';
import Label from './Label/Label';
const AdRequestItemBox = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.AdRequestItemBox}>{children}</div>
);

export default AdRequestItemBox;

AdRequestItemBox.Header = Header;
AdRequestItemBox.Content = Content;
AdRequestItemBox.Label = Label;
