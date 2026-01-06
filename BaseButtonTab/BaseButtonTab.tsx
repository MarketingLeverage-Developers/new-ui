import Select from '@/shared/headless/Select/Select';
import React from 'react';
import styles from './BaseButtonTab.module.scss';
import Item from './components/Item';

type BaseButtonTabProps = React.ComponentProps<typeof Select>;

const BaseButtonTab = ({ children, ...props }: BaseButtonTabProps) => (
    <Select {...props}>
        <div className={styles.BaseButtonWrapper}>{children}</div>
    </Select>
);

export default BaseButtonTab;

BaseButtonTab.Item = Item;
