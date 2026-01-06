import React from 'react';
import styles from './UnderlineTab.module.scss';
import Select from '@/shared/headless/Select/Select';
import { Item } from './components/Item';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';

type UnderlineTabProps = React.ComponentProps<typeof Select> & {
    gap?: string | number;
    margin?: PaddingSize | number;
    divProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;
};

const UnderlineTab = ({ children, divProps, gap, margin, ...props }: UnderlineTabProps) => {
    const { style, ...restDiv } = divProps ?? {};
    const cssVariables: CSSVariables = {
        '--gap': toCssUnit(gap),
        '--margin': toCssPadding(margin),
    };

    return (
        <Select {...props}>
            <div {...restDiv} className={styles.UnderlineTab} style={{ ...cssVariables, ...style }}>
                {children}
            </div>
        </Select>
    );
};

export default UnderlineTab;

UnderlineTab.Item = Item;
