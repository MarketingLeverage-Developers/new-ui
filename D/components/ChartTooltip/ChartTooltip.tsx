import React from 'react';
import BaseChartTooltip, { type BaseChartTooltipProps } from './components/BaseChartTooltip/BaseChartTooltip';

export type ChartTooltipVariant = 'base';

export type ChartTooltipProps = { variant: 'base' } & BaseChartTooltipProps;

const ChartTooltip = (props: ChartTooltipProps) => {
    const { variant, ...rest } = props;

    if (variant === 'base') {
        return <BaseChartTooltip {...rest} />;
    }

    return <BaseChartTooltip {...rest} />;
};

export default ChartTooltip;
