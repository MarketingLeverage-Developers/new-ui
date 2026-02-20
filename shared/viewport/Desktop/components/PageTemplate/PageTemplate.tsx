// src/shared/viewport/Desktop/DesktopPageTemplate.tsx
import React, { useEffect, useMemo, useState } from 'react';
import SiteSelect from '@/components/feature/site/SiteSelect';
import ProfileDropdown from '@/components/feature/navigation/ProfileDropdown/ProfileDropdown';
import PageName from '../../../../../PageName/PageName';
import { Desktop } from '../../Desktop';
import { UserAuthRenderer } from '@/components/feature/user/UserAuthRenderer';
import { ROLE } from '@/types/user/userAuthTypes';
import AppPageMenuSystem from '@/components/feature/navigation/AppPageMenu/components/AppPageMenuSystem';
import AppPageMenuUser from '@/components/feature/navigation/AppPageMenu/components/AppPageMenuUser';
import CompanySelectSidebar from '@/components/feature/company/CompanySelectSidebar/CompanySelectSidebar';
import RequireCompanyAndSite from '@/components/feature/navigation/RequireCompanyAndSite';
import MainOverlay from '@/features/overlay/components/MainOverlay';
import Flex from '../../../../../Flex/Flex';
import AppPageMenuManager from '@/components/feature/navigation/AppPageMenu/components/AppPageMenuManager';
import AppPageMenuAdvertiser from '@/components/feature/navigation/AppPageMenu/components/AppPageMenuAdvertiser';
import { ModalContainer } from '../../../../../D/components/ModalContainer/ModalContainer';
import CompanySettingModalContentDesktop from '@/components/feature/company/setting/CompanySettingModalContentDesktop';
import {
    AppOnboardingOverviewButton,
    AppOnboardingOverviewModal,
    useAppOnboardingOverview,
} from '@/components/feature/onboarding/AppOnboardingOverview';
import useCompanyListFetchQuery from '@/hooks/common/useCompanyListFetchQuery';
import type { CompanyListItem } from '@/types/company/companyListTypes';
import { useLocation } from 'react-router-dom';
import { subscribeCompanySettingModalOpen } from '@/components/feature/company/setting/companySettingModalEvents';

type PageTemplateStateBase = {
    companyUuid?: string;
    homepageUuid?: string;
    service?: string | null;
};

type PageTemplateActionsBase = {
    changeCompanyUuid?: (companyUuid: string) => void;
    changeHomepageUuid?: (homepageUuid: string) => void;
};

type MainLayoutMode = 'auto' | 'fill'; // ✅✅✅ 추가

type PageTemplateProps<S extends PageTemplateStateBase, A extends PageTemplateActionsBase> = {
    state: S;
    actions: A;
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    errorMessage?: string;
    onRetry?: () => void;
    main: React.ReactNode;
    overlays?: React.ReactNode;
    defaultOverlay?: React.ReactNode;
    filters?: React.ReactNode;
    creator?: React.ReactNode;
    pageTitle?: string;
    pageTitleAddon?: React.ReactNode;

    /** ✅✅✅ 추가: 메인 레이아웃 모드 */
    mainLayout?: MainLayoutMode;
    service?: string | null;
    showCompanySubSidebar?: boolean;
};

const EXCLUDED_INQUIRY_HISTORY_COMPANY_UUIDS = [
    import.meta.env.VITE_ML_UUID,
    import.meta.env.VITE_SL_UUID,
    import.meta.env.VITE_DJR_UUID,
];

type CompanySubSidebarGateProps = {
    companyUuid: string;
    onChange: (companyUuid: string) => void;
    onOpenCompanySetting: () => void;
};

const CompanySubSidebarGate = ({ companyUuid, onChange, onOpenCompanySetting }: CompanySubSidebarGateProps) => {
    const { res: companyListRes } = useCompanyListFetchQuery();
    const { pathname } = useLocation();

    const companyList = useMemo<CompanyListItem[]>(() => {
        const body = companyListRes?.data?.body ?? [];
        if (!pathname.includes('inquiry-history')) {
            return body;
        }

        return body.filter((item) => !EXCLUDED_INQUIRY_HISTORY_COMPANY_UUIDS.includes(item.uuid));
    }, [companyListRes?.data?.body, pathname]);

    if (companyList.length <= 1) {
        return null;
    }

    return (
        <Desktop.SubSidebar>
            <UserAuthRenderer
                rules={[
                    {
                        roles: [ROLE.SYSTEM, ROLE.MANAGER, ROLE.USER],
                        component: (
                            <CompanySelectSidebar
                                companyUuid={companyUuid}
                                onChange={onChange}
                                onOpenCompanySetting={onOpenCompanySetting}
                            />
                        ),
                    },
                    { roles: [ROLE.ADVERTISER], component: <div /> },
                ]}
            />
        </Desktop.SubSidebar>
    );
};

// 페이지 레이아웃 템플릿 컴포넌트
export const PageTemplate = <S extends PageTemplateStateBase, A extends PageTemplateActionsBase>({
    state,
    actions,
    isLoading,
    isError,
    isEmpty,
    errorMessage,
    onRetry,
    creator: _creator,
    main,
    pageTitle,
    pageTitleAddon,
    overlays,
    defaultOverlay,
    filters,
    mainLayout = 'fill', // ✅ 기본 auto
    showCompanySubSidebar = true,
}: PageTemplateProps<S, A>) => {
    const [companySettingOpen, setCompanySettingOpen] = useState(false);
    const onboardingOverview = useAppOnboardingOverview();

    useEffect(() => {
        const unsubscribe = subscribeCompanySettingModalOpen(() => {
            setCompanySettingOpen(true);
        });
        return unsubscribe;
    }, []);

    const mainWrapperStyle =
        mainLayout === 'fill'
            ? ({
                  height: '100%',
                  //   minHeight: 0, // ✅ flex 내부 스크롤/자식 height 계산 필수
              } as React.CSSProperties)
            : undefined;

    return (
        <Desktop>
            <Desktop.Sidebar>
                <Desktop.LogoLine />
                <UserAuthRenderer
                    rules={[
                        { roles: [ROLE.SYSTEM], component: <AppPageMenuSystem /> },
                        { roles: [ROLE.MANAGER], component: <AppPageMenuManager /> },
                        { roles: [ROLE.USER], component: <AppPageMenuUser /> },
                        { roles: [ROLE.ADVERTISER], component: <AppPageMenuAdvertiser /> },
                    ]}
                />
            </Desktop.Sidebar>

            {showCompanySubSidebar &&
                typeof state.companyUuid !== 'undefined' &&
                typeof actions.changeCompanyUuid === 'function' && (
                <CompanySubSidebarGate
                    companyUuid={state.companyUuid ?? ''}
                    onChange={actions.changeCompanyUuid}
                    onOpenCompanySetting={() => setCompanySettingOpen(true)}
                />
            )}

            <Desktop.Header>
                {typeof state.companyUuid !== 'undefined' && typeof state.homepageUuid !== 'undefined' ? (
                    <>
                        <Flex.Item flex={1}>
                            <Flex gap={4} align="center">
                                <PageName text={pageTitle ?? ''} />
                                {pageTitleAddon}
                                <span>/</span>
                                <SiteSelect
                                    companyUuid={state.companyUuid ?? ''}
                                    homepageUuid={state.homepageUuid ?? ''}
                                    onChange={actions.changeHomepageUuid ?? (() => undefined)}
                                />
                            </Flex>
                        </Flex.Item>
                        <Flex.Item flex={2}>
                            <Flex justify="center">{filters}</Flex>
                        </Flex.Item>
                        <Flex.Item flex={1}>
                            <Flex justify="end" align="center" gap={8}>
                                <AppOnboardingOverviewButton
                                    onClick={onboardingOverview.openGuide}
                                    disabled={!onboardingOverview.isReady}
                                />
                                <ProfileDropdown.Desktop service={state.service} />
                            </Flex>
                        </Flex.Item>
                    </>
                ) : (
                    <>
                        <Flex.Item flex={1}>
                            <Flex gap={8} align="center">
                                <PageName text={pageTitle ?? ''} />
                                {pageTitleAddon}
                            </Flex>
                        </Flex.Item>
                        <Flex.Item flex={2}>
                            <Flex justify="center">{filters}</Flex>
                        </Flex.Item>
                        <Flex.Item flex={1}>
                            <Flex justify="end" align="center" gap={8}>
                                <AppOnboardingOverviewButton
                                    onClick={onboardingOverview.openGuide}
                                    disabled={!onboardingOverview.isReady}
                                />
                                <ProfileDropdown.Desktop service={state.service} />
                            </Flex>
                        </Flex.Item>
                    </>
                )}
            </Desktop.Header>

            <Desktop.Main>
                {typeof state.companyUuid !== 'undefined' && typeof state.homepageUuid !== 'undefined' ? (
                    <RequireCompanyAndSite.Desktop homepageUuid={state.homepageUuid}>
                        <MainOverlay
                            isFetching={isLoading}
                            isEmpty={isEmpty}
                            hasError={isError}
                            errorMessage={errorMessage}
                            onRetry={onRetry}
                        >
                            <Flex
                                padding={{ y: 20, x: 12 }}
                                direction="column"
                                gap={16}
                                style={mainWrapperStyle} // ✅✅✅ 여기
                            >
                                {main}
                            </Flex>
                        </MainOverlay>
                    </RequireCompanyAndSite.Desktop>
                ) : (
                    <MainOverlay
                        isFetching={isLoading}
                        isEmpty={isEmpty}
                        hasError={isError}
                        errorMessage={errorMessage}
                        onRetry={onRetry}
                    >
                        <Flex
                            padding={{ y: 20, x: 12 }}
                            direction="column"
                            gap={24}
                            style={mainWrapperStyle} // ✅✅✅ 여기
                        >
                            {main}
                        </Flex>
                    </MainOverlay>
                )}
            </Desktop.Main>

            <Desktop.Overlays>
                <AppOnboardingOverviewModal open={onboardingOverview.isOpen} onClose={onboardingOverview.closeGuide} />
                <UserAuthRenderer
                    rules={[
                        {
                            roles: [ROLE.SYSTEM, ROLE.MANAGER, ROLE.USER],
                            component: (
                                <>
                                    {overlays}

                                    {typeof state.companyUuid !== 'undefined' &&
                                        typeof state.homepageUuid !== 'undefined' && (
                                            <ModalContainer
                                                variant="right-drawer"
                                                open={companySettingOpen}
                                                onChange={() => setCompanySettingOpen(false)}
                                                content={
                                                    <CompanySettingModalContentDesktop
                                                        open={companySettingOpen}
                                                        companyUuid={state.companyUuid ?? ''}
                                                        homepageUuid={state.homepageUuid ?? ''}
                                                    />
                                                }
                                            />
                                        )}
                                </>
                            ),
                        },
                    ]}
                    defaultComponent={<>{defaultOverlay}</>}
                />
            </Desktop.Overlays>
        </Desktop>
    );
};
