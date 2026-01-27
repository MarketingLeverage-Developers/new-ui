import React from 'react';
import { Mobile } from '@/shared/primitives/M/Mobile';
import LogoMobile from '@/shared/primitives/LogoMobile/LogoMobile';
import ScrollArea from '@/shared/primitives/ScrollArea/ScrollArea';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import { IoMdOptions } from 'react-icons/io';
import MainOverlay from '@/features/overlay/components/MainOverlay';
import Flex from '@/shared/primitives/Flex/Flex';
import styles from './PageTemplate.module.scss';
import FooterNav from './components/FooterNav/FooterNav';

export type MobilePageTemplateStateBase = {
    companyUuid?: string;
    homepageUuid?: string;
    bottomOpen?: boolean;
};

export type MobilePageTemplateActionsBase = {
    changeCompanyUuid?: (companyUuid: string) => void;
    changeHomepageUuid?: (homepageUuid: string) => void;
    setBottomOpen?: (bottomOpen: boolean) => void;
};

export type MobilePageTemplateProps<
    S extends MobilePageTemplateStateBase = MobilePageTemplateStateBase,
    A extends MobilePageTemplateActionsBase = MobilePageTemplateActionsBase,
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
    isFiltersButton?: boolean;
    footer?: React.ReactNode;
    showFooter?: boolean;
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
    footer,
    showFooter = true,
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
            <header className={styles.Header}>
                <div className={styles.Line}>
                    <LogoMobile />
                </div>

                <div className={styles.Line}>
                    {pageTitle}
                    {creator}
                </div>

                {filters ? (
                    <div className={styles.Line}>
                        {isFiltersButton ? (
                            <>
                                <ScrollArea>{filters}</ScrollArea>
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
                        ) : (
                            <>{filters}</>
                        )}
                    </div>
                ) : null}
            </header>

            <main className={styles.Main}>
                <div className={styles.MainScroller}>
                    <MainOverlay isFetching={isLoading} isEmpty={isEmpty} hasError={isError} onRetry={onRetry}>
                        <Flex padding={{ y: 16, x: 8 }} direction="column" gap={24} height="100%">
                            {main}
                        </Flex>
                    </MainOverlay>
                </div>
            </main>

            <div className={styles.Overlays}>{overlays ?? defaultOverlay}</div>

            {showFooter ? (
                <footer className={styles.Footer}>
                    {footer === null ? null : (footer ?? <FooterNav variant="base" />)}
                </footer>
            ) : null}
        </Mobile>
    );
};

(PageTemplate as typeof PageTemplate & { FooterNav: typeof FooterNav }).FooterNav = FooterNav;
