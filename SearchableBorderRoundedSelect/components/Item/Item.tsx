import React from 'react';
import classNames from 'classnames';
import Select from '../../../shared/headless/Select/Select';
import { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import { useQuerySearch } from '../../../shared/headless/QuerySearch/QuerySearch';
import styles from './Item.module.scss';

type ItemProps = React.ComponentProps<typeof Select.Item> & {
    clearQueryOnClick?: boolean;
};

export const Item = ({ onClick, clearQueryOnClick = true, className, value, ...props }: ItemProps) => {
    const { close } = useDropdown();
    const { setQuery } = useQuerySearch<unknown>();

    const handleItemClick = () => {
        if (clearQueryOnClick) setQuery('', { isSync: true });
        close();
        onClick?.(value);
    };

    return (
        <Select.Item {...props} value={value} className={classNames(styles.Item, className)} onClick={handleItemClick} />
    );
};
