import React from 'react';
import styles from './RequestItemBox.module.scss';
import Header from './Header/Header';
import Content from './Content/Content';
import Label from './Label/Label';
const RequestItemBox = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.RequestItemBox}>{children}</div>
);

export default RequestItemBox;

RequestItemBox.Header = Header;
RequestItemBox.Content = Content;
RequestItemBox.Label = Label;
