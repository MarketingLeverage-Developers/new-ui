import React from 'react';

import type {
    PageTemplateActionsBase,
    PageTemplateExtraProps,
    PageTemplateProps,
    PageTemplateStateBase,
} from './components/PageTemplate/PageTemplate';
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

export type RequestDetailPageTemplateProps<
    S extends PageTemplateStateBase = PageTemplateStateBase,
    A extends PageTemplateActionsBase = PageTemplateActionsBase,
> = Omit<PageTemplateProps<S, A>, 'main'> & PageTemplateExtraProps & RequestDetailTemplateProps;

export type TemplateProps<
    S extends PageTemplateStateBase = PageTemplateStateBase,
    A extends PageTemplateActionsBase = PageTemplateActionsBase,
    G extends string = string,
> =
    | ({ variant: 'page' } & PageTemplateProps<S, A> & PageTemplateExtraProps)
    | ({ variant: 'modal' } & ModalTemplateProps & ModalTemplateExtraProps)
    | ({ variant: 'confirm' } & ConfirmTemplateProps)
    | ({ variant: 'request-detail' } & RequestDetailTemplateProps)
    | ({ variant: 'request-detail' } & RequestDetailPageTemplateProps<S, A>)
    | ({ variant: 'onboarding-modal' } & OnboardingModalTemplateProps<G>);

const Template = <S extends PageTemplateStateBase, A extends PageTemplateActionsBase, G extends string = string>(
    props: TemplateProps<S, A, G>
) => {
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
        const hasPageProps =
            'state' in rest || 'actions' in rest || 'isLoading' in rest || 'isError' in rest || 'isEmpty' in rest;

        if (hasPageProps) {
            const {
                state,
                actions,
                isLoading,
                isError,
                isEmpty,
                onRetry,
                overlays,
                defaultOverlay,
                filters,
                creator,
                pageTitle,
                subSidebar,
                mainLayout,
                className,
                ...detailProps
            } = rest as RequestDetailPageTemplateProps<S, A>;

            return (
                <PageTemplate
                    state={state}
                    actions={actions}
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={isEmpty}
                    onRetry={onRetry}
                    overlays={overlays ?? defaultOverlay}
                    filters={filters}
                    creator={creator}
                    pageTitle={pageTitle}
                    subSidebar={subSidebar}
                    mainLayout={mainLayout}
                    className={className}
                    main={<RequestDetailTemplate {...(detailProps as RequestDetailTemplateProps)} />}
                />
            );
        }

        return <RequestDetailTemplate {...(rest as RequestDetailTemplateProps)} />;
    }

    return <PageTemplate {...(rest as PageTemplateProps<S, A> & PageTemplateExtraProps)} />;
};

export default Template;
