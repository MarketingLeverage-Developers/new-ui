import React from 'react';

import type { PageTemplateExtraProps, PageTemplateProps } from './components/PageTemplate/PageTemplate';
import PageTemplate from './components/PageTemplate/PageTemplate';

import type { ModalTemplateExtraProps, ModalTemplateProps } from './components/ModalTemplate/ModalTemplate';
import ModalTemplate from './components/ModalTemplate/ModalTemplate';

export type TemplateVariant = 'page' | 'modal';

export type TemplateProps =
    | ({ variant: 'page' } & PageTemplateProps & PageTemplateExtraProps)
    | ({ variant: 'modal' } & ModalTemplateProps & ModalTemplateExtraProps);

const Template: React.FC<TemplateProps> = (props) => {
    const { variant, ...rest } = props;

    if (variant === 'modal') {
        return <ModalTemplate {...(rest as ModalTemplateProps & ModalTemplateExtraProps)} />;
    }

    return <PageTemplate {...(rest as PageTemplateProps & PageTemplateExtraProps)} />;
};

export default Template;
