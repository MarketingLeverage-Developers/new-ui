import type React from 'react';
import classNames from 'classnames';
import styles from './Trigger.module.scss';
import { useMultiInput } from '@/shared/headless/MultiInput/MultiInput';

type TriggerProps = {
    className?: string;
    children?: React.ReactNode;
};

const Trigger: React.FC<TriggerProps> = ({ className, children = '추가' }) => {
    const { addInput, canAdd } = useMultiInput();

    return (
        <button
            type="button"
            className={classNames(styles.Trigger, className, { [styles.Disabled]: !canAdd })}
            onClick={addInput}
            disabled={!canAdd}
        >
            {children}
        </button>
    );
};

export default Trigger;
