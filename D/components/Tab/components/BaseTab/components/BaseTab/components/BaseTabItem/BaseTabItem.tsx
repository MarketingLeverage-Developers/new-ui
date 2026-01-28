import React from 'react';
import classNames from 'classnames';
import styles from './BaseTabItem.module.scss';

import Select, { useSelect } from '@/shared/headless/Select/Select';
import { IoCloseSharp } from 'react-icons/io5';

export type BaseTabItemTone = 'default' | 'add';

export type BaseTabItemProps = React.ComponentProps<typeof Select.Item> & {
    tone?: BaseTabItemTone;
    className?: string;
    setDelete?: (value: string) => void;
};

export type BaseTabDeleteButtonItemProps = BaseTabItemProps & {
    setDelete: (value: string) => void;
};

const BaseTabItem: React.FC<BaseTabItemProps> = (props) => {
    const { className, value, tone = 'default', children, onClick, setDelete, ...rest } = props;

    const { isActive } = useSelect();
    const active = tone === 'default' ? isActive(value) : false;

    const itemClassName = classNames(
        styles.Item,
        {
            [styles.Active]: active,
            [styles.Add]: tone === 'add',
        },
        className
    );

    // ✅ add는 Select.Item이 아니라 "액션 버튼"
    // ✅ headless onClick 시그니처: (value: string) => void 를 맞춰서 호출
    if (tone === 'add') {
        const handleAddClick: React.MouseEventHandler<HTMLButtonElement> = () => {
            onClick?.(value);
        };

        return (
            <button type="button" className={itemClassName} onClick={handleAddClick}>
                {children}
            </button>
        );
    }

    const handleDeleteClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDelete?.(value);
    };

    return (
        <Select.Item value={value} {...rest} className={itemClassName} onClick={onClick}>
            <span className={styles.Label}>{children}</span>
            {setDelete ? (
                <button type="button" aria-label="삭제" className={styles.DeleteButton} onClick={handleDeleteClick}>
                    <IoCloseSharp />
                </button>
            ) : null}
        </Select.Item>
    );
};

export default BaseTabItem;
