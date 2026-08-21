import { FiCheck } from 'react-icons/fi';
import styles from './WorkflowResultForm.module.scss';

export type WorkflowResultChoice = {
    id: string | number;
    label: string;
    meta?: string;
    checked?: boolean;
};

export type WorkflowResultChoiceGroupProps = {
    title: string;
    helper?: string;
    selectionType?: 'single' | 'multiple';
    options: WorkflowResultChoice[];
};

const WorkflowResultChoiceGroup = ({
    title,
    helper,
    selectionType = 'multiple',
    options,
}: WorkflowResultChoiceGroupProps) => (
    <div className={styles.ChoiceGroup} role="group" aria-label={title}>
        <div className={styles.ChoiceHeader}>
            <span>{title}</span>
            {helper ? <small>{helper}</small> : null}
        </div>
        {options.map((option) => (
            <div key={option.id} className={styles.ChoiceOption}>
                <span
                    className={styles.ChoiceIndicator}
                    data-selection={selectionType}
                    data-checked={option.checked ? 'true' : undefined}
                    aria-hidden="true"
                >
                    {selectionType === 'multiple' && option.checked ? <FiCheck /> : null}
                </span>
                <span className={styles.ChoiceLabel}>{option.label}</span>
                {option.meta ? <span className={styles.ChoiceMeta}>{option.meta}</span> : null}
            </div>
        ))}
    </div>
);

export default WorkflowResultChoiceGroup;
