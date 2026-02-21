import React from 'react';
import styles from './RoundedTab.module.scss';
import Select from '../../../../../shared/headless/Select/Select';
import { RoundedTabItem, type RoundedTabItemProps } from './components/Item';
import classNames from 'classnames';

export type RoundedTabProps = React.ComponentProps<typeof Select> & {
    divProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;
    full?: boolean;
};

const RoundedTab: React.FC<RoundedTabProps> & { Item: React.FC<RoundedTabItemProps> } = ({
    children,
    divProps,
    full = false,
    ...props
}) => {
    const { style, ...restDiv } = divProps ?? {};
    const rootClassName = classNames(styles.RoundedTab, { [styles.Full]: full });

    return (
        <Select {...props}>
            <div {...restDiv} className={rootClassName} style={{ ...style }}>
                {children}
            </div>
        </Select>
    );
};

RoundedTab.Item = RoundedTabItem;

export default RoundedTab;
