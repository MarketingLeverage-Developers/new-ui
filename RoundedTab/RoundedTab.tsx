import React from 'react';
import styles from './RoundedTab.module.scss';
import Select from '@/shared/headless/Select/Select';
import { Item } from './components/Item';

type RoundedTabProps = React.ComponentProps<typeof Select> & React.HTMLAttributes<HTMLDivElement>;

const RoundedTab = ({ children, style, ...props }: RoundedTabProps) => (
    <Select {...props}>
        <div {...props} className={styles.RoundedTab} style={{ ...style }}>
            {children}
        </div>
    </Select>
);

export default RoundedTab;

RoundedTab.Item = Item;
