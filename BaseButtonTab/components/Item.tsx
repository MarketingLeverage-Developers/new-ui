import React from 'react';
import styles from '../BaseButtonTab.module.scss';
import Select from '@/shared/headless/Select/Select';
import { useSelect } from '@/shared/headless/Select/Select';
import classNames from 'classnames';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';

type ItemProps = {
    children: React.ReactNode;
    activeColor?: HexColor | ThemeColorVar;
} & React.ComponentProps<typeof Select.Item>;

const Item = ({ children, activeColor, ...props }: ItemProps) => {
    const { isActive } = useSelect();
    const itemClassName = classNames(styles.Item, {
        [styles.Active]: isActive(props.value),
    });

    const cssVariables: CSSVariables = {
        '--active-color': activeColor,
    };
    return (
        <Select.Item {...props} className={itemClassName} style={{ ...cssVariables }}>
            {children}
        </Select.Item>
    );
};

export default Item;
