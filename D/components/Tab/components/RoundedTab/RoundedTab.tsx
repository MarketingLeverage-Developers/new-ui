import React from 'react';
import styles from './RoundedTab.module.scss';
import Select from '@/shared/headless/Select/Select';
import { RoundedTabItem, type RoundedTabItemProps } from './components/Item';

export type RoundedTabProps = React.ComponentProps<typeof Select> & {
    divProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;
};

const RoundedTab: React.FC<RoundedTabProps> & { Item: React.FC<RoundedTabItemProps> } = ({ children, divProps, ...props }) => {
    const { style, ...restDiv } = divProps ?? {};

    return (
        <Select {...props}>
            <div {...restDiv} className={styles.RoundedTab} style={{ ...style }}>
                {children}
            </div>
        </Select>
    );
};

RoundedTab.Item = RoundedTabItem;

export default RoundedTab;
