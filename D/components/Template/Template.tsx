import React from 'react';

import type { PageTemplateProps } from './components/PageTemplate/PageTemplate';
import PageTemplate from './components/PageTemplate/PageTemplate';

import type { ModalTemplateExtraProps, ModalTemplateProps } from './components/ModalTemplate/ModalTemplate';
import ModalTemplate from './components/ModalTemplate/ModalTemplate';
import ConfirmTemplate, { type ConfirmTemplateProps } from './components/ConfirmTemplate/ConfirmTemplate';
import RequestDetailTemplate, {
    type RequestDetailTemplateProps,
} from './components/RequestDetailTemplate/RequestDetailTemplate';
import OnboardingModalTemplate, {
    type OnboardingModalTemplateProps,
} from './components/OnboardingModalTemplate/OnboardingModalTemplate';

export type TemplateVariant = 'page' | 'modal' | 'confirm' | 'request-detail' | 'onboarding-modal';

export type TemplateProps<G extends string = string> =
    | ({ variant: 'page' } & PageTemplateProps)
    | ({ variant: 'modal' } & ModalTemplateProps & ModalTemplateExtraProps)
    | ({ variant: 'confirm' } & ConfirmTemplateProps)
    | ({ variant: 'request-detail' } & RequestDetailTemplateProps)
    | ({ variant: 'onboarding-modal' } & OnboardingModalTemplateProps<G>);

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

    return <PageTemplate {...(rest as PageTemplateProps)} />;
};

export default Template;
