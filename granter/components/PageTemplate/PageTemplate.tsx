import React from 'react';
import { FiChevronsLeft } from 'react-icons/fi';
import { RiBuilding2Line, RiMenuLine } from 'react-icons/ri';
import Aside from './components/Aside/Aside';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Sidebar from './components/Sidebar/Sidebar';
import SubSidebar from './components/SubSidebar/SubSidebar';
import Tooltip from '../Tooltip/Tooltip';
import styles from './PageTemplate.module.scss';

export type PageTemplateProps = {
    sidebar: React.ReactNode;
    subSidebar?: React.ReactNode;
    header: React.ReactNode;
    main: React.ReactNode;
    mainPadding?: React.CSSProperties['padding'];
    onMainScrollElReady?: (el: HTMLDivElement | null) => void;
    aside?: React.ReactNode;
    overlay?: React.ReactNode;
    mainScrollable?: boolean;
    theme?: 'light' | 'dark' | 'system';
    sidebarCollapsible?: boolean;
    sidebarCollapsed?: boolean;
    defaultSidebarCollapsed?: boolean;
    onSidebarCollapsedChange?: (collapsed: boolean) => void;
    sidebarCollapseAriaLabel?: string;
    sidebarCollapseMode?: 'shrink' | 'overlay';
    sidebarCollapsedContent?: React.ReactNode;
    subSidebarCollapsible?: boolean;
    subSidebarCollapsed?: boolean;
    defaultSubSidebarCollapsed?: boolean;
    onSubSidebarCollapsedChange?: (collapsed: boolean) => void;
    subSidebarCollapseAriaLabel?: string;
    subSidebarCollapseMode?: 'shrink' | 'overlay';
    subSidebarCollapsedContent?: React.ReactNode;
};

const PageTemplate = ({
    sidebar,
    subSidebar,
    header,
    main,
    mainPadding = 20,
    onMainScrollElReady,
    aside,
    overlay,
    mainScrollable = true,
    theme = 'light',
    sidebarCollapsible = false,
    sidebarCollapsed,
    defaultSidebarCollapsed = false,
    onSidebarCollapsedChange,
    sidebarCollapseAriaLabel = '사이드바 접기/펼치기',
    sidebarCollapseMode = 'shrink',
    sidebarCollapsedContent,
    subSidebarCollapsible = false,
    subSidebarCollapsed,
    defaultSubSidebarCollapsed = false,
    onSubSidebarCollapsedChange,
    subSidebarCollapseAriaLabel = '서브 사이드바 접기/펼치기',
    subSidebarCollapseMode = 'shrink',
    subSidebarCollapsedContent,
}: PageTemplateProps) => {
    const hasSubSidebar = Boolean(subSidebar);
    const isSidebarCollapsedControlled = typeof sidebarCollapsed === 'boolean';
    const isSubSidebarCollapsedControlled = typeof subSidebarCollapsed === 'boolean';
    const [internalSidebarCollapsed, setInternalSidebarCollapsed] = React.useState(defaultSidebarCollapsed);
    const [internalSubSidebarCollapsed, setInternalSubSidebarCollapsed] = React.useState(defaultSubSidebarCollapsed);
    const [isSidebarPreviewOpen, setSidebarPreviewOpen] = React.useState(false);
    const [isSubSidebarPreviewOpen, setSubSidebarPreviewOpen] = React.useState(false);
    const sidebarPreviewCloseTimerRef = React.useRef<number | null>(null);
    const subSidebarPreviewCloseTimerRef = React.useRef<number | null>(null);
    const isSidebarOverlayMode = sidebarCollapsible && sidebarCollapseMode === 'overlay';
    const isSubSidebarOverlayMode =
        hasSubSidebar && subSidebarCollapsible && subSidebarCollapseMode === 'overlay';
    const resolvedSidebarCollapsed = sidebarCollapsible
        ? isSidebarCollapsedControlled
            ? sidebarCollapsed
            : internalSidebarCollapsed
        : false;
    const resolvedSubSidebarCollapsed = hasSubSidebar
        ? subSidebarCollapsible
            ? isSubSidebarCollapsedControlled
                ? subSidebarCollapsed
                : internalSubSidebarCollapsed
            : false
        : false;

    const updateSidebarCollapsed = (nextCollapsed: boolean) => {
        if (!isSidebarCollapsedControlled) {
            setInternalSidebarCollapsed(nextCollapsed);
        }
        onSidebarCollapsedChange?.(nextCollapsed);
    };
    const updateSubSidebarCollapsed = (nextCollapsed: boolean) => {
        if (!isSubSidebarCollapsedControlled) {
            setInternalSubSidebarCollapsed(nextCollapsed);
        }
        onSubSidebarCollapsedChange?.(nextCollapsed);
    };

    const clearSidebarPreviewCloseTimer = () => {
        if (sidebarPreviewCloseTimerRef.current === null) return;
        window.clearTimeout(sidebarPreviewCloseTimerRef.current);
        sidebarPreviewCloseTimerRef.current = null;
    };
    const clearSubSidebarPreviewCloseTimer = () => {
        if (subSidebarPreviewCloseTimerRef.current === null) return;
        window.clearTimeout(subSidebarPreviewCloseTimerRef.current);
        subSidebarPreviewCloseTimerRef.current = null;
    };

    const handleSidebarCollapse = () => {
        clearSidebarPreviewCloseTimer();
        setSidebarPreviewOpen(false);
        updateSidebarCollapsed(true);
    };

    const handleSidebarExpand = () => {
        clearSidebarPreviewCloseTimer();
        setSidebarPreviewOpen(false);
        updateSidebarCollapsed(false);
    };
    const handleSubSidebarCollapse = () => {
        clearSubSidebarPreviewCloseTimer();
        setSubSidebarPreviewOpen(false);
        updateSubSidebarCollapsed(true);
    };
    const handleSubSidebarExpand = () => {
        clearSubSidebarPreviewCloseTimer();
        setSubSidebarPreviewOpen(false);
        updateSubSidebarCollapsed(false);
    };

    const handleSidebarPreviewMouseEnter = () => {
        if (!isSidebarOverlayMode || !resolvedSidebarCollapsed) return;
        clearSidebarPreviewCloseTimer();
        setSidebarPreviewOpen(true);
    };

    const handleSidebarPreviewMouseLeave = () => {
        if (!isSidebarOverlayMode || !resolvedSidebarCollapsed) return;
        clearSidebarPreviewCloseTimer();
        sidebarPreviewCloseTimerRef.current = window.setTimeout(() => {
            setSidebarPreviewOpen(false);
            sidebarPreviewCloseTimerRef.current = null;
        }, 120);
    };
    const handleSubSidebarPreviewMouseEnter = () => {
        if (!isSubSidebarOverlayMode || !resolvedSubSidebarCollapsed) return;
        clearSubSidebarPreviewCloseTimer();
        setSubSidebarPreviewOpen(true);
    };
    const handleSubSidebarPreviewMouseLeave = () => {
        if (!isSubSidebarOverlayMode || !resolvedSubSidebarCollapsed) return;
        clearSubSidebarPreviewCloseTimer();
        subSidebarPreviewCloseTimerRef.current = window.setTimeout(() => {
            setSubSidebarPreviewOpen(false);
            subSidebarPreviewCloseTimerRef.current = null;
        }, 120);
    };

    React.useEffect(() => {
        if (!resolvedSidebarCollapsed) {
            clearSidebarPreviewCloseTimer();
            setSidebarPreviewOpen(false);
        }
    }, [resolvedSidebarCollapsed]);
    React.useEffect(() => {
        if (!resolvedSubSidebarCollapsed) {
            clearSubSidebarPreviewCloseTimer();
            setSubSidebarPreviewOpen(false);
        }
    }, [resolvedSubSidebarCollapsed]);

    React.useEffect(
        () => () => {
            clearSidebarPreviewCloseTimer();
            clearSubSidebarPreviewCloseTimer();
        },
        []
    );

    const showSidebarOverlay = isSidebarOverlayMode && resolvedSidebarCollapsed && isSidebarPreviewOpen;
    const showSubSidebarOverlay =
        isSubSidebarOverlayMode && resolvedSubSidebarCollapsed && isSubSidebarPreviewOpen;
    const sidebarClassName = resolvedSidebarCollapsed && isSidebarOverlayMode ? styles.SidebarSlotCollapsedOverlay : undefined;
    const subSidebarClassName =
        resolvedSubSidebarCollapsed && isSubSidebarOverlayMode ? styles.SubSidebarSlotCollapsedOverlay : undefined;

    return (
        <div
            className={styles.PageTemplate}
            data-has-sub-sidebar={subSidebar ? 'true' : 'false'}
            data-has-aside={aside ? 'true' : 'false'}
            data-theme={theme}
            data-sidebar-collapsed={resolvedSidebarCollapsed ? 'true' : 'false'}
            data-sidebar-collapsible={sidebarCollapsible ? 'true' : 'false'}
            data-sidebar-collapse-mode={sidebarCollapseMode}
            data-sub-sidebar-collapsed={resolvedSubSidebarCollapsed ? 'true' : 'false'}
            data-sub-sidebar-collapsible={subSidebarCollapsible ? 'true' : 'false'}
            data-sub-sidebar-collapse-mode={subSidebarCollapseMode}
        >
            <Sidebar className={sidebarClassName}>
                {resolvedSidebarCollapsed
                    ? sidebarCollapsedContent ?? null
                    : sidebar}
            </Sidebar>
            {sidebarCollapsible && !resolvedSidebarCollapsed ? (
                <Tooltip content="사이드바 닫기" side="right">
                    <button
                        type="button"
                        className={styles.SidebarToggle}
                        data-collapsed={resolvedSidebarCollapsed ? 'true' : 'false'}
                        onClick={handleSidebarCollapse}
                        aria-label={sidebarCollapseAriaLabel}
                    >
                        <FiChevronsLeft size={14} />
                    </button>
                </Tooltip>
            ) : null}
            {showSidebarOverlay ? (
                <aside
                    className={styles.SidebarOverlayPanel}
                    onMouseEnter={handleSidebarPreviewMouseEnter}
                    onMouseLeave={handleSidebarPreviewMouseLeave}
                >
                    {sidebar}
                </aside>
            ) : null}
            {subSidebar ? (
                <SubSidebar
                    className={subSidebarClassName}
                    onMouseEnter={handleSubSidebarPreviewMouseEnter}
                    onMouseLeave={handleSubSidebarPreviewMouseLeave}
                >
                    {resolvedSubSidebarCollapsed
                        ? subSidebarCollapsedContent ?? null
                        : subSidebar}
                </SubSidebar>
            ) : null}
            {subSidebarCollapsible && hasSubSidebar && !resolvedSubSidebarCollapsed ? (
                <Tooltip content="서브 사이드바 닫기" side="right">
                    <button
                        type="button"
                        className={styles.SubSidebarToggle}
                        data-collapsed={resolvedSubSidebarCollapsed ? 'true' : 'false'}
                        onClick={handleSubSidebarCollapse}
                        aria-label={subSidebarCollapseAriaLabel}
                    >
                        <FiChevronsLeft size={14} />
                    </button>
                </Tooltip>
            ) : null}
            {showSubSidebarOverlay ? (
                <aside
                    className={styles.SubSidebarOverlayPanel}
                    onMouseEnter={handleSubSidebarPreviewMouseEnter}
                    onMouseLeave={handleSubSidebarPreviewMouseLeave}
                >
                    {subSidebar}
                </aside>
            ) : null}
            <Header>
                {sidebarCollapsible && resolvedSidebarCollapsed ? (
                    <Tooltip content="사이드바 열기" side="bottom" align="start">
                        <button
                            type="button"
                            className={styles.HeaderSidebarOpenButton}
                            onClick={handleSidebarExpand}
                            onMouseEnter={handleSidebarPreviewMouseEnter}
                            onMouseLeave={handleSidebarPreviewMouseLeave}
                            aria-label="사이드바 열기"
                        >
                            <RiMenuLine size={14} />
                        </button>
                    </Tooltip>
                ) : null}
                {subSidebarCollapsible && hasSubSidebar && resolvedSubSidebarCollapsed ? (
                    <Tooltip content="서브 사이드바 열기" side="right" align="start">
                        <button
                            type="button"
                            className={styles.HeaderSubSidebarOpenButton}
                            onClick={handleSubSidebarExpand}
                            onMouseEnter={handleSubSidebarPreviewMouseEnter}
                            onMouseLeave={handleSubSidebarPreviewMouseLeave}
                            aria-label="서브 사이드바 열기"
                        >
                            <RiBuilding2Line size={14} />
                        </button>
                    </Tooltip>
                ) : null}
                <div className={styles.HeaderContent}>{header}</div>
            </Header>
            <Main scrollable={mainScrollable} padding={mainPadding} onScrollElReady={onMainScrollElReady}>
                {main}
            </Main>
            {aside ? <Aside>{aside}</Aside> : null}
            {overlay}
        </div>
    );
};

export default PageTemplate;
