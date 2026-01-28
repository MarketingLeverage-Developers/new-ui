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
import RequestDetailTemplate, {
    type RequestDetailTemplateProps,
} from './components/RequestDetailTemplate/RequestDetailTemplate';

export type TemplateVariant = 'page' | 'modal' | 'request-detail';

export type RequestDetailPageTemplateProps<
    S extends PageTemplateStateBase = PageTemplateStateBase,
    A extends PageTemplateActionsBase = PageTemplateActionsBase,
> = Omit<PageTemplateProps<S, A>, 'main'> & PageTemplateExtraProps & RequestDetailTemplateProps;

export type TemplateProps<
    S extends PageTemplateStateBase = PageTemplateStateBase,
    A extends PageTemplateActionsBase = PageTemplateActionsBase,
> =
    | ({ variant: 'page' } & PageTemplateProps<S, A> & PageTemplateExtraProps)
    | ({ variant: 'modal' } & ModalTemplateProps & ModalTemplateExtraProps)
    | ({ variant: 'request-detail' } & RequestDetailTemplateProps)
    | ({ variant: 'request-detail' } & RequestDetailPageTemplateProps<S, A>);

const Template = <S extends PageTemplateStateBase, A extends PageTemplateActionsBase>(
    props: TemplateProps<S, A>
) => {
    const { variant, ...rest } = props;

    if (variant === 'modal') {
        return <ModalTemplate {...(rest as ModalTemplateProps & ModalTemplateExtraProps)} />;
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
