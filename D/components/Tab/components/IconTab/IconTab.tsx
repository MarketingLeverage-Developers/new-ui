import Select from '@/shared/headless/Select/Select';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import React from 'react';
import styles from './IconTab.module.scss';
import IconTabItem, { type IconTabItemProps } from './components/Item';

export type IconTabProps = React.ComponentProps<typeof Select> & {
    gap?: string | number;
    divProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;
};

const IconTab: React.FC<IconTabProps> & { Item: React.FC<IconTabItemProps> } = ({ children, divProps, gap, ...props }) => {
    const { style, ...restDiv } = divProps ?? {};

    const cssVariables: CSSVariables = {
        '--gap': toCssUnit(gap),
    };

    return (
        <Select {...props}>
            <div className={styles.IconTab} {...restDiv} style={{ ...cssVariables, ...style }}>
                {children}
            </div>
        </Select>
    );
};

IconTab.Item = IconTabItem;

export default IconTab;
