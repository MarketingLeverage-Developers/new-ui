import React from 'react';
import classNames from 'classnames';
import styles from './BaseBox.module.scss';

import type { BoxCommonProps } from '../../Box';

import type { CSSVariables } from '../../../../../shared/types/css/CSSVariables';
import { toCssPadding } from '../../../../../shared/utils/css/toCssPadding';
import { toCssUnit } from '../../../../../shared/utils';

export type BaseBoxExtraProps = {
    radius?: number;
    shadow?: boolean;

    /** value for background-color (for example: 'var(--White1)' / '#fff') */
    background?: string;

    /** value for border-color */
    borderColor?: string;
};

type BaseBoxProps = BoxCommonProps & BaseBoxExtraProps;
type BaseBoxStyleVariant = 'default' | 'granter-panel' | 'granter-muted';
type BaseBoxInternalProps = BaseBoxProps & {
    styleVariant?: BaseBoxStyleVariant;
};

const BaseBox: React.FC<BaseBoxInternalProps> = (props) => {
    const {
        children,
        className,
        style,

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

        radius = 12,
        shadow: _shadow = false,
        styleVariant = 'default',
        background,
        borderColor,

        ...rest
    } = props;

    const rootClassName = classNames(styles.BaseBox, className, {
        [styles.GranterPanel]: styleVariant === 'granter-panel',
        [styles.GranterMuted]: styleVariant === 'granter-muted',
    });

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
