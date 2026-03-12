import React from 'react';
import Aside from './components/Aside/Aside';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Sidebar from './components/Sidebar/Sidebar';
import SubSidebar from './components/SubSidebar/SubSidebar';
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
}: PageTemplateProps) => (
    <div
        className={styles.PageTemplate}
        data-has-sub-sidebar={subSidebar ? 'true' : 'false'}
        data-has-aside={aside ? 'true' : 'false'}
        data-theme={theme}
    >
        <Sidebar>{sidebar}</Sidebar>
        {subSidebar ? <SubSidebar>{subSidebar}</SubSidebar> : null}
        <Header>{header}</Header>
        <Main scrollable={mainScrollable} padding={mainPadding} onScrollElReady={onMainScrollElReady}>
            {main}
        </Main>
        {aside ? <Aside>{aside}</Aside> : null}
        {overlay}
    </div>
);

export default PageTemplate;
