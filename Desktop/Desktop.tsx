import React from 'react';
import styles from './Desktop.module.scss';
import { Footer, Header, Main, Sidebar, SubSidebar } from './components';

type DesktopProps = {
    children: React.ReactNode;
};

export const Desktop = ({ children }: DesktopProps) => <div className={styles.Desktop}>{children}</div>;

Desktop.Header = Header;
Desktop.Sidebar = Sidebar;
Desktop.Main = Main;
Desktop.Footer = Footer;
Desktop.SubSidebar = SubSidebar;
