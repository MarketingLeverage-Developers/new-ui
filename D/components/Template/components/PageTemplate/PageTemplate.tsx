import React from 'react';

import PageName from '@/shared/primitives/PageName/PageName';

import MainOverlay from '@/features/overlay/components/MainOverlay';
import Flex from '@/shared/primitives/Flex/Flex';
import { AppPageMenu } from '@/features/navigation/components/AppPageMenu';
import { Sidebar } from './components/Sidebar/Sidebar';
import { LogoLine } from './components/LogoLine/LogoLine';
import { SubSidebar } from './components/SubSidebar/SubSidebar';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Overlays } from './components/Overlays/Overlays';
import styles from './PageTemplate.module.scss';
import ProfileDropdown from '@/features/navigation/components/ProfileDropdown/ProfileDropdown';

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

export type PageTemplateProps<
    S extends PageTemplateStateBase = PageTemplateStateBase,
    A extends PageTemplateActionsBase = PageTemplateActionsBase,
> = {
    state: S;
    actions: A;

    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    onRetry?: () => void;

    main: React.ReactNode;

    overlays?: React.ReactNode;
    defaultOverlay?: React.ReactNode;

    filters?: React.ReactNode;
    creator?: React.ReactNode;

    pageTitle?: string;
    subSidebar?: React.ReactNode;

    mainLayout?: MainLayoutMode;
};

export type PageTemplateExtraProps = {
    className?: string;
};

const PageTemplate = <S extends PageTemplateStateBase, A extends PageTemplateActionsBase>(
    props: PageTemplateProps<S, A> & PageTemplateExtraProps
) => {
    const {
        state,
        actions,

        isLoading,
        isError,
        isEmpty,
        onRetry,

        main,
        pageTitle,
        subSidebar,
        overlays,

        filters,
        mainLayout = 'fill',

        className,
    } = props;

    const mainWrapperStyle =
        mainLayout === 'fill'
            ? ({
                  height: '100%',
              } as React.CSSProperties)
            : undefined;

    const hasCompanyAndHomepage = typeof state.companyUuid !== 'undefined' && typeof state.homepageUuid !== 'undefined';

    return (
        <div className={styles.PageTemplate}>
            <Sidebar>
                <LogoLine />
                <AppPageMenu />
            </Sidebar>

            {subSidebar ? <SubSidebar>{subSidebar}</SubSidebar> : null}

            <Header>
                {hasCompanyAndHomepage ? (
                    <>
                        <Flex.Item flex={1}>
                            <Flex gap={8} align="center">
                                <PageName text={pageTitle ?? ''} />
                                <span>/</span>
                                {/* <SiteSelect
                                    companyUuid={state.companyUuid ?? ''}
                                    homepageUuid={state.homepageUuid ?? ''}
                                    onChange={actions.changeHomepageUuid ?? (() => undefined)}
                                /> */}
                            </Flex>
                        </Flex.Item>

                        <Flex.Item flex={2}>
                            <Flex justify="center">{filters}</Flex>
                        </Flex.Item>

                        <Flex.Item flex={1}>
                            <Flex justify="end">
                                <ProfileDropdown />
                            </Flex>
                        </Flex.Item>
                    </>
                ) : (
                    <>
                        <Flex.Item flex={1}>
                            <Flex gap={8} align="center">
                                <PageName text={pageTitle ?? ''} />
                            </Flex>
                        </Flex.Item>

                        <Flex.Item flex={2}>
                            <Flex justify="center">{filters}</Flex>
                        </Flex.Item>

                        <Flex.Item flex={1}>
                            <Flex justify="end">
                                <ProfileDropdown />
                            </Flex>
                        </Flex.Item>
                    </>
                )}
            </Header>

            <Main>
                <MainOverlay isFetching={isLoading} isEmpty={isEmpty} hasError={isError} onRetry={onRetry}>
                    <Flex padding={{ y: 20, x: 24 }} direction="column" gap={24} style={mainWrapperStyle}>
                        {main}
                    </Flex>
                </MainOverlay>
            </Main>

            <Overlays>{overlays}</Overlays>
        </div>
    );
};

export default PageTemplate;
