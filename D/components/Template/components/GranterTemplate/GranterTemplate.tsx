import React from 'react';
import styles from './GranterTemplate.module.scss';
import GranterHeader, { type GranterHeaderProps } from './components/GranterHeader/GranterHeader';
import GranterSidebar, { type GranterSidebarProps } from './components/GranterSidebar/GranterSidebar';
import GranterMenu, { type GranterMenuSection } from './components/GranterMenu/GranterMenu';
import GranterEventBar, { type GranterEventBarProps } from './components/GranterEventBar/GranterEventBar';
import GranterDateSwaperWithPanel, {
    type GranterDateSwaperWithPanelProps,
} from './components/GranterDateSwaperWithPanel/GranterDateSwaperWithPanel';
import GranterDateSwaper, { type GranterDateSwaperProps } from './components/GranterDateSwaper/GranterDateSwaper';
import GranterSimpleDateRange, {
    type GranterSimpleDateRangeProps,
} from './components/GranterSimpleDateRange/GranterSimpleDateRange';
import GranterHeaderDatePicker, {
    type GranterHeaderDatePickerProps,
} from './components/GranterHeaderDatePicker/GranterHeaderDatePicker';
import GranterSalaryHistoryDatePicker, {
    type GranterSalaryHistoryDatePickerProps,
} from './components/GranterSalaryHistoryDatePicker/GranterSalaryHistoryDatePicker';
import GranterWorkspaceInfo, {
    type GranterWorkspaceInfoProps,
} from './components/GranterWorkspaceInfo/GranterWorkspaceInfo';
import GranterHiddenMenuList, {
    type GranterHiddenMenuListProps,
} from './components/GranterHiddenMenuList/GranterHiddenMenuList';
import GranterBottomProfile, {
    type GranterBottomProfileProps,
} from './components/GranterBottomProfile/GranterBottomProfile';
import GranterCenterNavigation, {
    type GranterCenterNavigationProps,
} from './components/GranterCenterNavigation/GranterCenterNavigation';
import GranterWorkspacePageLayout, {
    type GranterWorkspacePageLayoutProps,
} from './components/GranterWorkspacePageLayout/GranterWorkspacePageLayout';
import GranterWorkspaceSidebar, {
    type GranterWorkspaceSidebarProps,
} from './components/GranterWorkspaceSidebar/GranterWorkspaceSidebar';
import GranterHomeContent, {
    type GranterHomeContentProps,
} from './components/GranterHomeContent/GranterHomeContent';
import GranterPatternLayout, {
    type GranterPatternLayoutProps,
} from './components/GranterPatternLayout/GranterPatternLayout';
import GranterSubSidebar from './components/GranterSubSidebar/GranterSubSidebar';
import { GranterPageMenu } from './components/GranterPageMenu/GranterPageMenu';
import GranterSideSearchBar from './components/GranterSideSearchBar/GranterSideSearchBar';

export type GranterTemplateProps = {
    sidebar: React.ReactNode;
    subSidebar?: React.ReactNode;
    header: React.ReactNode;
    main: React.ReactNode;
    eventBar?: React.ReactNode;
    floating?: React.ReactNode;
    overlay?: React.ReactNode;
};

type GranterTemplateCompound = React.FC<GranterTemplateProps> & {
    Header: React.FC<GranterHeaderProps>;
    Sidebar: React.FC<GranterSidebarProps>;
    Menu: React.FC<{
        sections: GranterMenuSection[];
        activeItemKey?: string;
        compact?: boolean;
        hideSectionLabel?: boolean;
        onItemClick?: (itemKey: string) => void;
    }>;
    EventBar: React.FC<GranterEventBarProps>;
    DateSwaperWithPanel: React.FC<GranterDateSwaperWithPanelProps>;
    DateSwaper: React.FC<GranterDateSwaperProps>;
    SimpleDateRange: React.FC<GranterSimpleDateRangeProps>;
    HeaderDatePicker: React.FC<GranterHeaderDatePickerProps>;
    SalaryHistoryDatePicker: React.FC<GranterSalaryHistoryDatePickerProps>;
    WorkspaceInfo: React.FC<GranterWorkspaceInfoProps>;
    HiddenMenuList: React.FC<GranterHiddenMenuListProps>;
    BottomProfile: React.FC<GranterBottomProfileProps>;
    CenterNavigation: React.FC<GranterCenterNavigationProps>;
    WorkspacePageLayout: React.FC<GranterWorkspacePageLayoutProps>;
    WorkspaceSidebar: React.FC<GranterWorkspaceSidebarProps>;
    HomeContent: React.FC<GranterHomeContentProps>;
    PatternLayout: React.FC<GranterPatternLayoutProps>;
};

const GranterTemplateRoot: React.FC<GranterTemplateProps> = ({
    sidebar,
    subSidebar,
    header,
    main,
    eventBar,
    floating,
    overlay,
}) => (
    <div className={styles.GranterTemplate}>
        <aside className={styles.SidebarArea}>{sidebar}</aside>
        {subSidebar ? <GranterSubSidebar>{subSidebar}</GranterSubSidebar> : null}

        <div className={styles.ContentArea}>
            {eventBar ? <div className={styles.EventBarArea}>{eventBar}</div> : null}
            <div className={styles.HeaderArea}>{header}</div>

            <main className={styles.Main}>
                <div className={styles.MainInner}>{main}</div>
            </main>
        </div>

        {floating ? <div className={styles.FloatingLayer}>{floating}</div> : null}
        {overlay ? <div className={styles.OverlayLayer}>{overlay}</div> : null}
    </div>
);

const GranterTemplate = Object.assign(GranterTemplateRoot, {
    Header: GranterHeader,
    Sidebar: GranterSidebar,
    Menu: GranterMenu,
    EventBar: GranterEventBar,
    DateSwaperWithPanel: GranterDateSwaperWithPanel,
    DateSwaper: GranterDateSwaper,
    SimpleDateRange: GranterSimpleDateRange,
    HeaderDatePicker: GranterHeaderDatePicker,
    SalaryHistoryDatePicker: GranterSalaryHistoryDatePicker,
    WorkspaceInfo: GranterWorkspaceInfo,
    HiddenMenuList: GranterHiddenMenuList,
    BottomProfile: GranterBottomProfile,
    CenterNavigation: GranterCenterNavigation,
    WorkspacePageLayout: GranterWorkspacePageLayout,
    WorkspaceSidebar: GranterWorkspaceSidebar,
    HomeContent: GranterHomeContent,
    PatternLayout: GranterPatternLayout,
    PageMenu : GranterPageMenu,
    SideSearchBar : GranterSideSearchBar,
    subSidebar: GranterSubSidebar,

}) as GranterTemplateCompound;

export default GranterTemplate;
