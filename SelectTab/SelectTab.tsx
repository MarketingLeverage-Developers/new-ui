import Select from '@/shared/headless/Select/Select';
import React from 'react';
import styles from './SelectTab.module.scss';
import Item from './components/Item/Item';
type SelectTabProps = React.ComponentProps<typeof Select> & {
    divProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;
};
const SelectTab = ({ children, divProps, ...props }: SelectTabProps) => {
    const { style, ...restDiv } = divProps ?? {};
    return (
        <Select {...props}>
            <div {...restDiv} className={styles.SelectTab} style={{ ...style }}>
                {children}
            </div>
        </Select>
    );
};

export default SelectTab;

SelectTab.Item = Item;
