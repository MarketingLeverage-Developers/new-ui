// src/shared/viewport/Mobile/MobilePageTemplate.tsx
import React from 'react';
import { Mobile } from '@/shared/viewport/Mobile/Mobile';
import PageName from '@/shared/primitives/PageName/PageName';
import LogoMobile from '@/shared/primitives/LogoMobile/LogoMobile';
import ProfileDropdown from '@/features/navigation/components/ProfileDropdown/ProfileDropdown';
import AppFooterNav from '@/features/navigation/components/AppFooterNav/AppFooterNav';
import ScrollArea from '@/shared/primitives/ScrollArea/ScrollArea';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import { IoMdOptions } from 'react-icons/io';
import RequireCompanyAndSite from '@/features/navigation/components/RequireCompanyAndSite/RequireCompanyAndSite';
import MainOverlay from '@/features/overlay/components/MainOverlay';
import Flex from '@/shared/primitives/Flex/Flex';

type MobilePageTemplateStateBase = {
    companyUuid?: string;
    homepageUuid?: string;
    bottomOpen?: boolean;
};

type MobilePageTemplateActionsBase = {
    changeCompanyUuid?: (companyUuid: string) => void;
    changeHomepageUuid?: (homepageUuid: string) => void;
    setBottomOpen?: (bottomOpen: boolean) => void;
};

type MobilePageTemplateProps<S extends MobilePageTemplateStateBase, A extends MobilePageTemplateActionsBase> = {
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
    isFiltersButton?: boolean;
};

export const PageTemplate = <S extends MobilePageTemplateStateBase, A extends MobilePageTemplateActionsBase>({
    state,
    actions,
    isLoading,
    isError,
    isEmpty,
    onRetry,
    main,
    overlays,
    filters,
    creator,
    pageTitle,
    isFiltersButton = true,
    defaultOverlay,
}: MobilePageTemplateProps<S, A>) => {
    const companyUuid = state.companyUuid ?? '';
    const homepageUuid = state.homepageUuid ?? '';

    const handleChangeCompany = actions.changeCompanyUuid ?? (() => undefined);
    const handleChangeHomepage = actions.changeHomepageUuid ?? (() => undefined);

    const hasCompanyUuid = typeof state.companyUuid !== 'undefined';
    const hasHomepageUuid = typeof state.homepageUuid !== 'undefined';
    const hasChangeCompany = typeof actions.changeCompanyUuid === 'function';
    const hasChangeHomepage = typeof actions.changeHomepageUuid === 'function';

    const canUseProfileDropdownMobile = hasCompanyUuid && hasHomepageUuid && hasChangeCompany && hasChangeHomepage;

    return (
        <Mobile>
            <Mobile.Header>
                <Mobile.Header.Line justify="space-between">
                    <LogoMobile />
                    {canUseProfileDropdownMobile && (
                        <ProfileDropdown.Mobile
                            companyUuid={companyUuid}
                            homepageUuid={homepageUuid}
                            onChangeCompanyUuid={handleChangeCompany}
                            onChangeHomepageUuid={handleChangeHomepage}
                        />
                    )}
                </Mobile.Header.Line>

                <Mobile.Header.Line justify="space-between">
                    <PageName.Mobile text={pageTitle ?? ''} />
                    {creator}
                </Mobile.Header.Line>

                {/* 오른쪽 컬럼: 고정 폭 옵션 버튼 */}
                {filters && (
                    <Mobile.Header.Line>
                        {isFiltersButton && (
                            <>
                                <ScrollArea> {filters} </ScrollArea>
                                <BaseButton
                                    width="fit-content"
                                    bgColor={getThemeColor('Gray6')}
                                    padding={{ x: 12, y: 9 }}
                                    onClick={() => actions.setBottomOpen?.(true)}
                                    radius={6}
                                >
                                    <IoMdOptions color={getThemeColor('Gray1')} />
                                </BaseButton>
                            </>
                        )}
                        {!isFiltersButton && <>{filters}</>}
                    </Mobile.Header.Line>
                )}
            </Mobile.Header>

            <Mobile.Main>
                {typeof state.companyUuid !== 'undefined' && typeof state.homepageUuid !== 'undefined' ? (
                    <RequireCompanyAndSite.Mobile homepageUuid={state.homepageUuid}>
                        <MainOverlay isFetching={isLoading} isEmpty={isEmpty} hasError={isError} onRetry={onRetry}>
                            <Flex padding={{ y: 16, x: 8 }} direction="column" gap={24} height={'100%'}>
                                {main}
                            </Flex>
                        </MainOverlay>
                    </RequireCompanyAndSite.Mobile>
                ) : (
                    <MainOverlay isFetching={isLoading} isEmpty={isEmpty} hasError={isError} onRetry={onRetry}>
                        <Flex padding={{ y: 16, x: 8 }} direction="column" gap={24} height={'100%'}>
                            {main}
                        </Flex>
                    </MainOverlay>
                )}
                {/* <NeverSubscribedOverlay.Mobile /> */}
                {/* <NotSubscribedOverlay.Mobile /> */}
            </Mobile.Main>

            <Mobile.Overlays>
                <>
                    {/* <UserAuthRenderer
                        rules={[
                            {
                                roles: [ROLE.SYSTEM, ROLE.MANAGER, ROLE.USER],
                                component: <>{overlays}</>,
                            },
                        ]}
                        defaultComponent={<>{defaultOverlay}</>}
                    /> ㅇ*/}
                    {overlays}
                </>
            </Mobile.Overlays>

            <Mobile.Footer>
                <AppFooterNav />
            </Mobile.Footer>
        </Mobile>
    );
};
