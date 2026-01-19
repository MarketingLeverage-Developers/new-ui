import React from 'react';
import classNames from 'classnames';
import styles from './BaseBox.module.scss';

import type { BoxCommonProps } from '../../Box';

import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import { toCssUnit } from '@/shared/utils';

export type BaseBoxExtraProps = {
    radius?: number;
    shadow?: boolean;

    /** ✅ background-color로 들어갈 값 (예: 'var(--White1)' / '#fff') */
    background?: string;

    /** ✅ border-color로 들어갈 값 */
    borderColor?: string;
};

type BaseBoxProps = BoxCommonProps & BaseBoxExtraProps;

const BaseBox: React.FC<BaseBoxProps> = (props) => {
    const {
        children,
        className,
        style,

        // ✅ 공통 props (DOM으로 내려가면 안 됨)
        direction,
        align,
        justify,
        gap,
        wrap,

        width,
        maxWidth,
        height,

        padding,
        margin,

        flex,
        minWidth,
        minHeight,

        // ✅ base 전용
        radius = 12,
        shadow = false,
        background,
        borderColor,

        ...rest
    } = props;

    const rootClassName = classNames(styles.BaseBox, className);

    const cssVariables: CSSVariables = {
        '--flex-direction': direction,
        '--align-items': align,
        '--justify-content': justify,
        '--wrap': wrap,
        '--gap': toCssUnit(gap),

        '--width': toCssUnit(width),
        '--max-width': toCssUnit(maxWidth),
        '--height': toCssUnit(height),

        '--padding': toCssPadding(padding),
        '--margin': toCssPadding(margin),

        '--flex': flex,
        '--min-width': toCssUnit(minWidth),
        '--min-height': toCssUnit(minHeight),

        '--radius': toCssUnit(radius),

        /* ✅ 여기로 background-color 주입 */
        '--bg': background,

        '--border-color': borderColor,
    };

    return (
        <div {...rest} className={rootClassName} style={{ ...cssVariables, ...style }}>
            {children}
        </div>
    );
};

export default BaseBox;
