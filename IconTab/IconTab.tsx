import Select from '@/shared/headless/Select/Select';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import React from 'react';
import styles from './IconTab.module.scss';
import Item from './components/Item';

type IconTabProps = React.ComponentProps<typeof Select> & {
    gap?: string | number;
    divProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;
};

const IconTab = ({ children, divProps, gap, ...props }: IconTabProps) => {
    const { style, ...restDiv } = divProps ?? {};

    const cssVariables: CSSVariables = {
        '--gap': toCssUnit(gap),
    };

    return (
        <Select {...props}>
            <div className={styles.IconTab} {...restDiv}>
                {children}
            </div>
        </Select>
    );
};

export default IconTab;

IconTab.Item = Item;
