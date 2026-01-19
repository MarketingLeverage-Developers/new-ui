import React from 'react';
import styles from './Mobile.module.scss';
import {
    Header,
    Main,
    Footer,
    Overlays,
    ListTable,
    InfiniteScrollTrigger,
    PageSizeSelect,
    IsDeleteSelect,
    DateSelect,
    PageTemplate,
} from './components';

type MobileProps = {
    children: React.ReactNode;
};

export const Mobile = ({ children }: MobileProps) => <div className={styles.Mobile}>{children}</div>;

Mobile.Header = Header;
Mobile.Main = Main;
Mobile.Footer = Footer;
Mobile.Overlays = Overlays;
Mobile.ListTable = ListTable;
Mobile.InfiniteScrollTrigger = InfiniteScrollTrigger;
Mobile.PageSizeSelect = PageSizeSelect;
Mobile.IsDeleteSelect = IsDeleteSelect;
Mobile.DateSelect = DateSelect;
Mobile.PageTemplate = PageTemplate;
