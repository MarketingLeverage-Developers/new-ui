import React from 'react';
import styles from './Desktop.module.scss';
import {
    DateSelect,
    Footer,
    Header,
    IsDeleteSelect,
    ListInfiniteScroll,
    ListPagination,
    ListTable,
    LogoLine,
    Main,
    ModalContainer,
    Overlays,
    PageSizeSelect,
    Sidebar,
    SubSidebar,
} from './components';
import { DeleteConfirmModal } from './components/DeleteConfirmModal/DeleteConfirmModal';
import RestoreConfirmModal from './components/RestoreConfirmModal/RestoreConfirmModal';

type DesktopProps = {
    children: React.ReactNode;
};

export const Desktop = ({ children }: DesktopProps) => <div className={styles.Desktop}>{children}</div>;

Desktop.Header = Header;
Desktop.Sidebar = Sidebar;
Desktop.Main = Main;
Desktop.Footer = Footer;
Desktop.SubSidebar = SubSidebar;
Desktop.Overlays = Overlays;
Desktop.DeleteConfirmModal = DeleteConfirmModal;
Desktop.RestoreConfirmModal = RestoreConfirmModal;
Desktop.DateSelect = DateSelect;
Desktop.IsDeleteSelect = IsDeleteSelect;
Desktop.ListInfiniteScroll = ListInfiniteScroll;
Desktop.ListPagination = ListPagination;
Desktop.ListTable = ListTable;
Desktop.PageSizeSelect = PageSizeSelect;
Desktop.LogoLine = LogoLine;
Desktop.ModalContainer = ModalContainer;
