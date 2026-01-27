import React from 'react';
import classNames from 'classnames';
import HeadlessSelect from '@/shared/headless/Select/Select';
import styles from './BaseSelectItem.module.scss';

export type BaseSelectItemProps = React.ComponentProps<typeof HeadlessSelect.Item> & {
    className?: string;
    value: string;
};

const BaseSelectItem: React.FC<BaseSelectItemProps> = (props) => {
    const { className, value, children, ...rest } = props;

    return (
        <HeadlessSelect.Item value={value} {...rest} className={classNames(styles.Item, className)}>
            {children}
        </HeadlessSelect.Item>
    );
};

export default BaseSelectItem;
