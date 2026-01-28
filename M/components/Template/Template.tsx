import React from 'react';

import ModalTemplate, {
    type ModalTemplateExtraProps,
    type ModalTemplateProps,
} from './components/ModalTemplate/ModalTemplate';
import { PageTemplate } from './components/PageTemplate/PageTemplate';
import type {
    MobilePageTemplateActionsBase,
    MobilePageTemplateProps,
    MobilePageTemplateStateBase,
} from './components/PageTemplate/PageTemplate';
import RequestDetailTemplate, {
    type RequestDetailTemplateProps,
} from './components/RequestDetailTemplate/RequestDetailTemplate';

export type TemplateVariant = 'page' | 'modal' | 'request-detail';

export type RequestDetailPageTemplateProps<
    S extends MobilePageTemplateStateBase = MobilePageTemplateStateBase,
    A extends MobilePageTemplateActionsBase = MobilePageTemplateActionsBase,
> = Omit<MobilePageTemplateProps<S, A>, 'main'> & RequestDetailTemplateProps;

export type TemplateProps<
    S extends MobilePageTemplateStateBase = MobilePageTemplateStateBase,
    A extends MobilePageTemplateActionsBase = MobilePageTemplateActionsBase,
> =
    | ({ variant: 'page' } & MobilePageTemplateProps<S, A>)
    | ({ variant: 'modal' } & ModalTemplateProps & ModalTemplateExtraProps)
    | ({ variant: 'request-detail' } & RequestDetailTemplateProps)
    | ({ variant: 'request-detail' } & RequestDetailPageTemplateProps<S, A>);

const Template = <S extends MobilePageTemplateStateBase, A extends MobilePageTemplateActionsBase>(
    props: TemplateProps<S, A>
) => {
    const { variant, ...rest } = props;

    if (variant === 'modal') {
        return <ModalTemplate {...(rest as ModalTemplateProps & ModalTemplateExtraProps)} />;
    }

    if (variant === 'request-detail') {
        const hasPageProps = 'state' in rest || 'actions' in rest || 'isLoading' in rest || 'isError' in rest;

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
                isFiltersButton,
                footer,
                showFooter,
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
                    isFiltersButton={isFiltersButton}
                    footer={footer}
                    showFooter={showFooter}
                    main={<RequestDetailTemplate {...(detailProps as RequestDetailTemplateProps)} className={className} />}
                />
            );
        }

        return <RequestDetailTemplate {...(rest as RequestDetailTemplateProps)} />;
    }

    return <PageTemplate {...(rest as MobilePageTemplateProps<S, A>)} />;
};

export default Template;
