import React from 'react';

import type {
    PageTemplateActionsBase,
    PageTemplateExtraProps,
    PageTemplateOverlayProps,
    PageTemplateProps,
    PageTemplateSlots,
    PageTemplateStateBase,
} from './components/PageTemplate/PageTemplate';
import PageTemplate from './components/PageTemplate/PageTemplate';
import MainOverlay from '../../../shared/composites/MainOverlay/MainOverlay';

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

export type TemplatePageProps<
    S extends PageTemplateStateBase = PageTemplateStateBase,
    A extends PageTemplateActionsBase = PageTemplateActionsBase,
> = PageTemplateProps &
    PageTemplateExtraProps & {
        state: S;
        actions: A;
        isLoading?: boolean;
        isError?: boolean;
        isEmpty?: boolean;
        onRetry?: () => void;
    };

export type RequestDetailPageTemplateProps<
    S extends PageTemplateStateBase = PageTemplateStateBase,
    A extends PageTemplateActionsBase = PageTemplateActionsBase,
> = Omit<TemplatePageProps<S, A>, 'main'> & RequestDetailTemplateProps;

export type TemplateProps<
    S extends PageTemplateStateBase = PageTemplateStateBase,
    A extends PageTemplateActionsBase = PageTemplateActionsBase,
    G extends string = string,
> =
    | ({ variant: 'page' } & TemplatePageProps<S, A>)
    | ({ variant: 'modal' } & ModalTemplateProps & ModalTemplateExtraProps)
    | ({ variant: 'confirm' } & ConfirmTemplateProps)
    | ({ variant: 'request-detail' } & RequestDetailTemplateProps)
    | ({ variant: 'request-detail' } & RequestDetailPageTemplateProps<S, A>)
    | ({ variant: 'onboarding-modal' } & OnboardingModalTemplateProps<G>);

let pageTemplateDefaultSlots: Partial<PageTemplateSlots> = {};

const cloneSlotNode = (node?: React.ReactNode): React.ReactNode =>
    React.isValidElement(node) ? React.cloneElement(node) : node;

export const setPageTemplateDefaultSlots = (slots: Partial<PageTemplateSlots>) => {
    pageTemplateDefaultSlots = {
        ...pageTemplateDefaultSlots,
        ...slots,
    };
};

export const resetPageTemplateDefaultSlots = () => {
    pageTemplateDefaultSlots = {};
};

const getDefaultPageTemplateSlots = (slots?: PageTemplateSlots): PageTemplateSlots => ({
    sidebarMenu: slots?.sidebarMenu ?? cloneSlotNode(pageTemplateDefaultSlots.sidebarMenu) ?? null,
    headerProfile: slots?.headerProfile ?? cloneSlotNode(pageTemplateDefaultSlots.headerProfile) ?? null,
    mainOverlay: slots?.mainOverlay ?? pageTemplateDefaultSlots.mainOverlay ?? MainOverlay,
});

const bindMainOverlayRuntime = (
    overlay: PageTemplateSlots['mainOverlay'],
    runtime: Pick<PageTemplateOverlayProps, 'isFetching' | 'hasError' | 'isEmpty' | 'onRetry'>
): PageTemplateSlots['mainOverlay'] => {
    if (!overlay) return undefined;

    const BoundMainOverlay: React.FC<PageTemplateOverlayProps> = ({ children }) => (
        React.createElement(
            overlay as React.ComponentType<PageTemplateOverlayProps>,
            {
                isFetching: runtime.isFetching,
                hasError: runtime.hasError,
                isEmpty: runtime.isEmpty,
                onRetry: runtime.onRetry,
            },
            children
        )
    );

    return BoundMainOverlay;
};

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
                state: _state,
                actions: _actions,
                isLoading,
                isError,
                isEmpty,
                onRetry,
                left,
                rightHeader,
                rightMain,
                leftFlex,
                rightFlex,
                slots,
                ...pageTemplateProps
            } = rest as RequestDetailPageTemplateProps<S, A>;

            const resolvedSlots = getDefaultPageTemplateSlots(slots);
            const runtimeBoundSlots: PageTemplateSlots = {
                ...resolvedSlots,
                mainOverlay: bindMainOverlayRuntime(resolvedSlots.mainOverlay, {
                    isFetching: isLoading,
                    hasError: isError,
                    isEmpty,
                    onRetry,
                }),
            };

            return (
                <PageTemplate
                    {...pageTemplateProps}
                    overlays={pageTemplateProps.overlays ?? pageTemplateProps.defaultOverlay}
                    slots={runtimeBoundSlots}
                    main={
                        <RequestDetailTemplate
                            left={left}
                            rightHeader={rightHeader}
                            rightMain={rightMain}
                            leftFlex={leftFlex}
                            rightFlex={rightFlex}
                        />
                    }
                />
            );
        }

        return <RequestDetailTemplate {...(rest as RequestDetailTemplateProps)} />;
    }

    const {
        state: _state,
        actions: _actions,
        isLoading,
        isError,
        isEmpty,
        onRetry,
        slots,
        ...pageTemplateProps
    } = rest as TemplatePageProps<S, A>;

    const resolvedSlots = getDefaultPageTemplateSlots(slots);
    const runtimeBoundSlots: PageTemplateSlots = {
        ...resolvedSlots,
        mainOverlay: bindMainOverlayRuntime(resolvedSlots.mainOverlay, {
            isFetching: isLoading,
            hasError: isError,
            isEmpty,
            onRetry,
        }),
    };

    return <PageTemplate {...pageTemplateProps} slots={runtimeBoundSlots} />;
};

export default Template;
