import React from 'react';
import classNames from 'classnames';
import ManySelect, { useManySelect } from '@/shared/headless/ManySelect/ManySelect';
import styles from './ChipMultiSelectItem.module.scss';

export type ChipMultiSelectItemProps = React.ComponentProps<typeof ManySelect.Item> & {
    className?: string;
};

const ChipMultiSelectItem: React.FC<ChipMultiSelectItemProps> = (props) => {
    const { className, value, children, ...rest } = props;

    const { isChecked } = useManySelect();
    const checked = isChecked(value);

    const itemClassName = classNames(styles.Item, { [styles.Checked]: checked }, className);

    return (
        <ManySelect.Item value={value} {...rest} className={itemClassName} role="checkbox" aria-checked={checked}>
            <span className={styles.Checkbox} aria-hidden>
                <span className={styles.Check} />
            </span>

            <span className={styles.Label}>{children}</span>
        </ManySelect.Item>
    );
};

export default ChipMultiSelectItem;
