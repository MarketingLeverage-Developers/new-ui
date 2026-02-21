import React, { type HTMLAttributes, type ReactNode } from 'react';

import StrongIconLabel from './components/StrongIconLabel/StrongIconLabel';
import MutedIconLabel from './components/MutedIconLabel/MutedIconLabel';
import UnderlineIconLabel from './components/UnderlineIconLabel/UnderlineIconLabel';

export type LabelVariant = 'muted' | 'strong' | 'underline';
export type LabelDirection = 'row' | 'column';

export type LabelCommonProps = HTMLAttributes<HTMLDivElement> & {
    icon?: ReactNode;
    text?: string;
    direction?: LabelDirection;
    required?: boolean;
    gap?: number; // ✅ px 숫자
    labelWidth?: number | string; // underline + row 라벨 영역 폭
    children: ReactNode;
    actions?: React.ReactNode;
};

export type LabelProps =
    | ({ variant: 'muted' } & LabelCommonProps)
    | ({ variant: 'strong' } & LabelCommonProps)
    | ({ variant: 'underline' } & LabelCommonProps);

const Label = (props: LabelProps) => {
    const { variant, ...rest } = props;

    if (variant === 'strong') {
        return <StrongIconLabel {...rest} />;
    }

    if (variant === 'underline') {
        return <UnderlineIconLabel {...rest} />;
    }

    return <MutedIconLabel {...rest} />;
};

export default Label;
