import React from 'react';

import ModalTemplate, {
    type ModalTemplateExtraProps,
    type ModalTemplateProps,
} from './components/ModalTemplate/ModalTemplate';
import type {
    PageTemplateExtraProps,
    PageTemplateProps,
} from '@/shared/primitives/D/components/Template/components/PageTemplate/PageTemplate';
import { PageTemplate } from './components/PageTemplate/PageTemplate';

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
