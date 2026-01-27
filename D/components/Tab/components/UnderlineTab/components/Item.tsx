import Select from '@/shared/headless/Select/Select';
import { useSelect } from '@/shared/headless/Select/Select';
import classNames from 'classnames';
import styles from '../UnderlineTab.module.scss';
import React from 'react';
import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';

export type UnderlineTabItemProps = React.ComponentProps<typeof Select.Item> & {
    full?: boolean;
    fontSize?: CSSLength;
    fontWeight?: CSSLength;
    padding?: PaddingSize | number;
};

export const UnderlineTabItem: React.FC<UnderlineTabItemProps> = ({
    style,
    full,
    fontSize,
    fontWeight,
    padding = { y: 10, x: 0 },
    ...props
}) => {
    const { isActive } = useSelect();
    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--font-weight': fontWeight,
        '--padding': toCssPadding(padding),
    };

    const itemClassName = classNames(styles.Item, {
        [styles.Active]: isActive(props.value),
        [styles.Full]: full,
    });

    return (
        <Select.Item {...props} className={itemClassName} style={{ ...cssVariables, ...style }}>
            {props.children}
        </Select.Item>
    );
};
