import React from 'react';
import styles from './UnderlineTab.module.scss';
import Select from '@/shared/headless/Select/Select';
import { Item } from './components/Item';

type UnderlineTabProps = React.ComponentProps<typeof Select> & {
    divProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;
};

const UnderlineTab = ({ children, divProps, ...props }: UnderlineTabProps) => {
    const { style, ...restDiv } = divProps ?? {};

    return (
        <Select {...props}>
            <div {...restDiv} className={styles.UnderlineTab} style={{ ...style }}>
                {children}
            </div>
        </Select>
    );
};

export default UnderlineTab;

UnderlineTab.Item = Item;
