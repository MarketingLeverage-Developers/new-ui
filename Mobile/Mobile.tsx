import React from 'react';
import styles from './Mobile.module.scss';
import { Header, Main, CompanySelectFullScreenTrigger, Footer } from './components';

type MobileProps = {
    children: React.ReactNode;
};

export const Mobile = ({ children }: MobileProps) => <div className={styles.Mobile}>{children}</div>;

Mobile.Header = Header;
Mobile.Main = Main;
Mobile.CompanySelectFullScreenTrigger = CompanySelectFullScreenTrigger;
Mobile.Footer = Footer;
