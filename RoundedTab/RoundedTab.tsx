import React from 'react';
import styles from './RoundedTab.module.scss';
import Select from '@/shared/headless/Select/Select';
import { Item } from './components/Item';

type RoundedTabProps = React.ComponentProps<typeof Select> & {
    divProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;
};

const RoundedTab = ({ children, divProps, ...props }: RoundedTabProps) => {
    const { style, ...restDiv } = divProps ?? {};

    return (
        <Select {...props}>
            <div {...restDiv} className={styles.RoundedTab} style={{ ...style }}>
                {children}
            </div>
        </Select>
    );
};

export default RoundedTab;

RoundedTab.Item = Item;
