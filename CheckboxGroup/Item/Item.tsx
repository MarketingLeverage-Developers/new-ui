import React, { useEffect, useMemo } from 'react';
import Toggle from '@/shared/headless/Toggle/Toggle';
import { FaCheck } from 'react-icons/fa';
import { useCheckboxGroup } from '../CheckboxGroupContext';
import styles from '../CheckboxGroup.module.scss';

export type ItemProps = {
    id: string;
    children: React.ReactNode;
    disabled?: boolean;
    onTriggerClick?: (value: boolean) => void;
};

const Item: React.FC<ItemProps> = ({ id, children, disabled, onTriggerClick }) => {
    const { checked, setChecked, registerId, unregisterId } = useCheckboxGroup();

    useEffect(() => {
        registerId(id, disabled);
        return () => unregisterId(id);
    }, [id, disabled, registerId, unregisterId]);

    const isChecked = useMemo(() => checked.has(id), [checked, id]);

    const onChange = (next: boolean) => {
        setChecked((prev) => {
            const base = new Set(prev as Set<string>);
            if (next) base.add(id);
            else base.delete(id);
            return base;
        });
    };

    return (
        <Toggle value={isChecked} onChange={onChange}>
            <div className={styles.ItemWrapper}>
                {/* TODO: disabled에 대한 처리는 어떻게 할 것인가 */}
                <Toggle.Trigger disabled={disabled} onTriggerClick={onTriggerClick} className={styles.Item}>
                    {isChecked && <FaCheck size={10} />}
                </Toggle.Trigger>
                <span>{children}</span>
            </div>
        </Toggle>
    );
};

export default Item;
