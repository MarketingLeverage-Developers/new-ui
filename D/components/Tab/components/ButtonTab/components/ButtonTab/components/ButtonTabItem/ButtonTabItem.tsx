import React from 'react';
import classNames from 'classnames';
import styles from './ButtonTabItem.module.scss';

import Select, { useSelect } from '../../../../../../../../../shared/headless/Select/Select';
import type { CSSVariables } from '../../../../../../../../../shared/types/css/CSSVariables';
import type { HexColor } from '../../../../../../../../../shared/types/css/HexColor';
import type { ThemeColorVar } from '../../../../../../../../../shared/types/css/ThemeColorTokens';

export type ButtonTabItemProps = Omit<React.ComponentProps<typeof Select.Item>, 'value'> & {
    value: string;
    className?: string;
    textColor?: HexColor | ThemeColorVar;
};

const ButtonTabItem: React.FC<ButtonTabItemProps> = (props) => {
    const { className, value, children, style, textColor, ...rest } = props;

    const { isActive } = useSelect();
    const active = isActive(value);
    const cssVariables: CSSVariables = {
        '--text-color': textColor,
        '--active-text-color': textColor,
    };

    const itemClassName = classNames(
        styles.Item,
        {
            [styles.Active]: active,
        },
        className
    );

    return (
        <Select.Item value={value} {...rest} className={itemClassName} style={{ ...cssVariables, ...style }}>
            {children}
        </Select.Item>
    );
};

export default ButtonTabItem;
