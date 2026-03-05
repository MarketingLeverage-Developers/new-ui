import React from 'react';

import type { PageTemplateProps } from './components/PageTemplate/PageTemplate';
import PageTemplate from './components/PageTemplate/PageTemplate';
import MobilePageTemplate, { type MobilePageTemplateProps } from './components/MobilePageTemplate/MobilePageTemplate';

import type { ModalTemplateExtraProps, ModalTemplateProps } from './components/ModalTemplate/ModalTemplate';
import ModalTemplate from './components/ModalTemplate/ModalTemplate';
import ConfirmTemplate, { type ConfirmTemplateProps } from './components/ConfirmTemplate/ConfirmTemplate';
import RequestDetailTemplate, {
    type RequestDetailTemplateProps,
} from './components/RequestDetailTemplate/RequestDetailTemplate';
import OnboardingModalTemplate, {
    type OnboardingModalTemplateProps,
} from './components/OnboardingModalTemplate/OnboardingModalTemplate';
import { LogoLine, type LogoLineProps } from './components/PageTemplate/components/LogoLine/LogoLine';
import GranterTemplate, { type GranterTemplateProps } from './components/GranterTemplate/GranterTemplate';
import GranterWorkspaceInfo, {
    type GranterWorkspaceInfoProps,
} from './components/GranterTemplate/components/GranterWorkspaceInfo/GranterWorkspaceInfo';
import { GranterPageMenu, type GranterPageMenuProps } from './components/GranterTemplate/components/GranterPageMenu/GranterPageMenu';
import GranterSideSearchBar, { type GranterSideSearchBarProps } from './components/GranterTemplate/components/GranterSideSearchBar/GranterSideSearchBar';


export type TemplateVariant =
    | 'page'
    | 'mobile'
    | 'modal'
    | 'confirm'
    | 'request-detail'
    | 'onboarding-modal'
    | 'logo'
    | 'granter-logo'
    | 'granter'
    | 'granter-menu-desktop'
    | 'granterMenu-desktop'
    | 'granter-search-side'
    | 'granter-companybar';
export type TemplatePageProps = PageTemplateProps;
export type TemplateMobilePageProps = MobilePageTemplateProps;
export type TemplateLogoProps = LogoLineProps;
export type TemplateGranterLogoProps = GranterWorkspaceInfoProps;

export type TemplateProps<G extends string = string> =
    | ({ variant: 'page' } & PageTemplateProps)
    | ({ variant: 'mobile' } & MobilePageTemplateProps)
    | ({ variant: 'modal' } & ModalTemplateProps & ModalTemplateExtraProps)
    | ({ variant: 'confirm' } & ConfirmTemplateProps)
    | ({ variant: 'request-detail' } & RequestDetailTemplateProps)
    | ({ variant: 'onboarding-modal' } & OnboardingModalTemplateProps<G>)
    | ({ variant: 'logo' } & LogoLineProps)
    | ({ variant: 'granter-logo' } & GranterWorkspaceInfoProps)
    | ({ variant: 'granter' } & GranterTemplateProps)
    | ({ variant: 'granter-menu-desktop' } & GranterPageMenuProps)
    | ({ variant: 'granterMenu-desktop' } & GranterPageMenuProps)
    | ({ variant: 'granter-search-side' } & GranterSideSearchBarProps);

const Template = <G extends string = string>(props: TemplateProps<G>) => {
    const { variant, ...rest } = props;

    if (variant === 'modal') {
        return <ModalTemplate {...(rest as ModalTemplateProps & ModalTemplateExtraProps)} />;
    }

    if (variant === 'onboarding-modal') {
        return <OnboardingModalTemplate {...(rest as OnboardingModalTemplateProps<G>)} />;
    }

    if (variant === 'confirm') {
        return <ConfirmTemplate {...(rest as ConfirmTemplateProps)} />;
    }

    if (variant === 'request-detail') {
        return <RequestDetailTemplate {...(rest as RequestDetailTemplateProps)} />;
    }

    if (variant === 'mobile') {
        return <MobilePageTemplate {...(rest as MobilePageTemplateProps)} />;
    }

    if (variant === 'logo') {
        return <LogoLine {...(rest as LogoLineProps)} />;
    }

    if (variant === 'granter-logo') {
        return <GranterWorkspaceInfo {...(rest as GranterWorkspaceInfoProps)} />;
    }

    if (variant === 'granter') {
        return <GranterTemplate {...(rest as GranterTemplateProps)} />;
    }

    if (variant === 'granter-menu-desktop' || variant === 'granterMenu-desktop') {
        return <GranterPageMenu {...(rest as GranterPageMenuProps)} />;
    }

    if (variant === 'granter-search-side') {
        return <GranterSideSearchBar {...(rest as GranterSideSearchBarProps)} />;
    }

    return <PageTemplate {...(rest as PageTemplateProps)} />;
};

export default Template;
