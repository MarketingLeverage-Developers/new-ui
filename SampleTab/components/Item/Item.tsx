import classNames from 'classnames';
import styles from './Item.module.scss';
import Select from '@/shared/headless/Select/Select';
import { useSelect } from '@/shared/headless/Select/Select';

type ItemProps = React.ComponentProps<typeof Select.Item> & {};

export const Item = ({ ...props }: ItemProps) => {
    const { isActive } = useSelect();

    const className = classNames(styles.Item, {
        [styles.Active]: isActive(props.value),
    });

    return (
        <Select.Item {...props} className={className} style={{ ...props }}>
            {props.children}
        </Select.Item>
    );
};
