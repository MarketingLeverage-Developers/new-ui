import Select from '../../../../../../shared/headless/Select/Select';
import { useSelect } from '../../../../../../shared/headless/Select/Select';
import classNames from 'classnames';
import styles from '../RoundedTab.module.scss';
import React from 'react';
import type { CSSVariables } from '../../../../../../shared/types/css/CSSVariables';
import type { HexColor } from '../../../../../../shared/types/css/HexColor';
import type { ThemeColorVar } from '../../../../../../shared/types/css/ThemeColorTokens';

export type RoundedTabItemProps = React.ComponentProps<typeof Select.Item> & {
    textColor?: HexColor | ThemeColorVar;
};

export const RoundedTabItem: React.FC<RoundedTabItemProps> = ({ style, textColor, ...props }) => {
    const { isActive } = useSelect();
    const cssVariables: CSSVariables = {
        '--text-color': textColor,
        '--active-text-color': textColor,
    };

    const itemclassName = classNames(styles.Item, {
        [styles.Active]: isActive(props.value),
    });

    return (
        <Select.Item {...props} className={itemclassName} style={{ ...cssVariables, ...style }}>
            {props.children}
        </Select.Item>
    );
};
