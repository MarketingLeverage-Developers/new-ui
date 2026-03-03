import React from 'react';
import CircleDot, { type CircleDotProps } from './components/CircleDot/CircleDot';

export type DotVariant = 'circle';

export type DotProps = ({ variant?: 'circle' } & CircleDotProps) | ({ variant: 'circle' } & CircleDotProps);

const Dot = (props: DotProps) => {
    const { variant = 'circle', ...rest } = props;

    if (variant === 'circle') {
        return <CircleDot {...rest} />;
    }

    return null;
};

export default Dot;
