import React, { type HTMLAttributes, type ReactNode } from 'react';

import StrongIconLabel from './components/StrongIconLabel/StrongIconLabel';
import MutedIconLabel from './components/MutedIconLabel/MutedIconLabel';

export type LabelVariant = 'muted' | 'strong';
export type LabelDirection = 'row' | 'column';

export type LabelCommonProps = HTMLAttributes<HTMLDivElement> & {
    icon?: ReactNode;
    text?: string;
    direction?: LabelDirection;
    required?: boolean;
    gap?: number; // ✅ px 숫자
    children: ReactNode;
    actions?: React.ReactNode;
};

export type LabelProps = ({ variant: 'muted' } & LabelCommonProps) | ({ variant: 'strong' } & LabelCommonProps);

const Label = (props: LabelProps) => {
    const { variant, ...rest } = props;

    if (variant === 'strong') {
        return <StrongIconLabel {...rest} />;
    }

    return <MutedIconLabel {...rest} />;
};

export default Label;
