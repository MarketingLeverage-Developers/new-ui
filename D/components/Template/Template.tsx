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

export type TemplateVariant = 'page' | 'modal';

export type TemplateProps<
    S extends PageTemplateStateBase = PageTemplateStateBase,
    A extends PageTemplateActionsBase = PageTemplateActionsBase,
> =
    | ({ variant: 'page' } & PageTemplateProps<S, A> & PageTemplateExtraProps)
    | ({ variant: 'modal' } & ModalTemplateProps & ModalTemplateExtraProps);

const Template = <S extends PageTemplateStateBase, A extends PageTemplateActionsBase>(
    props: TemplateProps<S, A>
) => {
    const { variant, ...rest } = props;

    if (variant === 'modal') {
        return <ModalTemplate {...(rest as ModalTemplateProps & ModalTemplateExtraProps)} />;
    }

    return <PageTemplate {...(rest as PageTemplateProps<S, A> & PageTemplateExtraProps)} />;
};

export default Template;
