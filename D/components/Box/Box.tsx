import React, { type HTMLAttributes } from 'react';

import BaseBox, { type BaseBoxExtraProps } from './components/BaseBox/BaseBox';
import FlexBox, { type FlexBoxExtraProps } from './components/FlexBox/FlexBox';
import GridBox, { type GridBoxExtraProps } from './components/GridBox/GridBox';
import RoundedBox, { type RoundedBoxExtraProps } from './components/RoundedBox/RoundedBox';

/** CSS 크기 단위 타입 */
export type CSSLength = number | string;

export type PaddingSize =
    | number
    | {
          x?: number;
          y?: number;
          l?: number;
          r?: number;
          t?: number;
          b?: number;
      };

export type BoxVariant = 'base' | 'granter-panel' | 'granter-muted' | 'flex' | 'grid' | 'rounded';

export type BoxCommonProps = HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
} & {
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    align?: 'stretch' | 'center' | 'start' | 'end' | 'baseline';
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    gap?: string | number;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

    width?: string | number;
    maxWidth?: CSSLength;
    height?: string | number;

    padding?: PaddingSize | number;
    margin?: PaddingSize | number;

    flex?: CSSLength;
    minWidth?: CSSLength;
    minHeight?: CSSLength;
};

export type BoxProps =
    | ({ variant?: 'flex' } & BoxCommonProps & FlexBoxExtraProps)
    | ({ variant?: 'base' } & BoxCommonProps & BaseBoxExtraProps)
    | ({ variant: 'granter-panel' } & BoxCommonProps & BaseBoxExtraProps)
    | ({ variant: 'granter-muted' } & BoxCommonProps & BaseBoxExtraProps)
    | ({ variant: 'grid' } & BoxCommonProps & GridBoxExtraProps)
    | ({ variant: 'rounded' } & BoxCommonProps & RoundedBoxExtraProps);

const Box: React.FC<BoxProps> = (props) => {
    const { variant = 'flex', ...rest } = props;

    if (variant === 'base') {
        return <BaseBox {...(rest as BoxCommonProps & BaseBoxExtraProps)} />;
    }

    if (variant === 'granter-panel') {
        return <BaseBox {...(rest as BoxCommonProps & BaseBoxExtraProps)} styleVariant="granter-panel" />;
    }

    if (variant === 'granter-muted') {
        return <BaseBox {...(rest as BoxCommonProps & BaseBoxExtraProps)} styleVariant="granter-muted" />;
    }

    if (variant === 'grid') {
        return <GridBox {...(rest as BoxCommonProps & GridBoxExtraProps)} />;
    }

    if (variant === 'rounded') {
        return <RoundedBox {...(rest as BoxCommonProps & RoundedBoxExtraProps)} />;
    }

    return <FlexBox {...(rest as BoxCommonProps & FlexBoxExtraProps)} />;
};

export default Box;
