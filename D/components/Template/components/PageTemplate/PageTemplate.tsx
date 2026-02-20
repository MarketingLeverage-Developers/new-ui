import React from 'react';

import PageName from '../../../../../PageName/PageName';

import Flex from '../../../../../Flex/Flex';
import { Sidebar } from './components/Sidebar/Sidebar';
import { LogoLine } from './components/LogoLine/LogoLine';
import { SubSidebar } from './components/SubSidebar/SubSidebar';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Overlays } from './components/Overlays/Overlays';
import styles from './PageTemplate.module.scss';
import type { PaddingSize } from '../../../../../shared/types/css/PaddingSize';

export type PageTemplateOverlayProps = {
    children: React.ReactNode;
    isFetching?: boolean;
    isEmpty?: boolean;
    hasError?: boolean;
    onRetry?: () => void;
};

export type PageTemplateSlots = {
    sidebarMenu?: React.ReactNode;
    headerProfile?: React.ReactNode;
    mainOverlay?: React.ComponentType<PageTemplateOverlayProps>;
};

export type PageTemplateStateBase = {
    companyUuid?: string;
    homepageUuid?: string;
    service?: string | null;
};

export type PageTemplateActionsBase = {
    changeCompanyUuid?: (companyUuid: string) => void;
    changeHomepageUuid?: (homepageUuid: string) => void;
};

export type MainLayoutMode = 'auto' | 'fill';

export type PageTemplateProps = {
    main: React.ReactNode;

    overlays?: React.ReactNode;
    defaultOverlay?: React.ReactNode;

    filters?: React.ReactNode;
    creator?: React.ReactNode;

    pageTitle?: string;
    pageTitleAddon?: React.ReactNode;
    subSidebar?: React.ReactNode;
    sidebarBrand?: React.ReactNode;
    sidebarContent?: React.ReactNode;

    headerContent?: React.ReactNode;
    headerLeft?: React.ReactNode;
    headerCenter?: React.ReactNode;
    headerRight?: React.ReactNode;

    mainLayout?: MainLayoutMode;
    mainPadding?: PaddingSize | number;
    mainScrollable?: boolean;
};

export type PageTemplateExtraProps = {
    className?: string;
    slots?: PageTemplateSlots;
};

const PageTemplate = (props: PageTemplateProps & PageTemplateExtraProps) => {
    const {
        main,
        pageTitle,
        pageTitleAddon,
        subSidebar,
        sidebarBrand,
        sidebarContent,
        overlays,

        filters,
        headerContent,
        headerLeft,
        headerCenter,
        headerRight,
        mainLayout = 'fill',
        mainPadding = { y: 20, x: 24 },
        mainScrollable = true,

        className: _className,
        slots,
    } = props;

    const MainOverlayComponent = slots?.mainOverlay;
    const sidebarMenu = slots?.sidebarMenu ?? null;
    const headerProfile = slots?.headerProfile ?? null;

    const defaultHeaderLeft = (
        <Flex gap={8} align="center">
            <PageName text={pageTitle ?? ''} />
            {pageTitleAddon}
        </Flex>
    );

    const resolvedHeaderContent = headerContent ?? (
        <>
            <Flex.Item flex={1}>{headerLeft ?? defaultHeaderLeft}</Flex.Item>

            <Flex.Item flex={2}>
                {headerCenter ?? <Flex justify="center">{filters}</Flex>}
            </Flex.Item>

            <Flex.Item flex={1}>
                {headerRight ?? <Flex justify="end">{headerProfile}</Flex>}
            </Flex.Item>
        </>
    );

    const mainWrapperStyle =
        mainLayout === 'fill'
            ? ({
                  height: '100%',
              } as React.CSSProperties)
            : undefined;

    return (
        <div className={styles.PageTemplate}>
            <Sidebar>
                {sidebarBrand ?? <LogoLine />}
                {sidebarContent ?? sidebarMenu}
            </Sidebar>

            {subSidebar ? <SubSidebar>{subSidebar}</SubSidebar> : null}

            <Header>{resolvedHeaderContent}</Header>

            <Main scrollable={mainScrollable}>
                {MainOverlayComponent ? (
                    <MainOverlayComponent>
                        <Flex padding={mainPadding} direction="column" gap={24} style={mainWrapperStyle}>
                            {main}
                        </Flex>
                    </MainOverlayComponent>
                ) : (
                    <Flex padding={mainPadding} direction="column" gap={24} style={mainWrapperStyle}>
                        {main}
                    </Flex>
                )}
            </Main>

            <Overlays>{overlays}</Overlays>
        </div>
    );
};

export default PageTemplate;
