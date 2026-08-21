import { FiCheck } from 'react-icons/fi';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import styles from './WorkflowForm.module.scss';

export type WorkflowFormMultiSelectOption<T extends string = string> = {
    value: T;
    label: string;
    disabled?: boolean;
};

export type WorkflowFormMultiSelectProps<T extends string = string> = {
    options: WorkflowFormMultiSelectOption<T>[];
    value: T[];
    onChange?: (nextValue: T[]) => void;
    placeholder?: string;
    emptyText?: string;
    disabled?: boolean;
    id?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    invalid?: boolean;
    required?: boolean;
};

const WorkflowFormMultiSelectView = <T extends string>({
    options,
    value,
    onChange,
    placeholder = '옵션을 선택해주세요. (여러 개 선택 가능)',
    emptyText = '선택 가능한 옵션이 없습니다.',
    disabled = false,
    id,
    ariaLabelledBy,
    ariaDescribedBy,
    invalid = false,
    required = false,
}: WorkflowFormMultiSelectProps<T>) => {
    const { isOpen, menuId } = useDropdown();
    const selectedValueSet = new Set(value);
    const selectedOptions = options.filter((option) => selectedValueSet.has(option.value));
    const valueId = id ? `${id}-value` : undefined;
    const displayLabel =
        selectedOptions.length === 0
            ? placeholder
            : selectedOptions.length === 1
              ? selectedOptions[0].label
              : `${selectedOptions[0].label} 외 ${selectedOptions.length - 1}개`;
    const controlDisabled = disabled || options.length === 0;

    const toggleOption = (optionValue: T) => {
        const nextValueSet = new Set(value);
        if (nextValueSet.has(optionValue)) nextValueSet.delete(optionValue);
        else nextValueSet.add(optionValue);

        onChange?.(options.filter((option) => nextValueSet.has(option.value)).map((option) => option.value));
    };

    return (
        <div className={styles.MultiSelectRoot}>
            <Dropdown.Trigger className={styles.MultiSelectTriggerWrap} disabled={controlDisabled}>
                <button
                    id={id}
                    type="button"
                    className={styles.MultiSelectTrigger}
                    data-invalid={invalid ? 'true' : undefined}
                    disabled={controlDisabled}
                    aria-labelledby={[ariaLabelledBy, valueId].filter(Boolean).join(' ') || undefined}
                    aria-describedby={ariaDescribedBy}
                    aria-invalid={invalid}
                    aria-required={required}
                    aria-expanded={isOpen}
                    aria-controls={menuId}
                >
                    <span
                        id={valueId}
                        className={styles.MultiSelectValue}
                        data-placeholder={selectedOptions.length === 0 ? 'true' : undefined}
                    >
                        {options.length === 0 ? emptyText : displayLabel}
                    </span>
                    <span className={styles.MultiSelectIcon} data-open={isOpen ? 'true' : undefined} aria-hidden="true">
                        <HiOutlineChevronDown size={15} />
                    </span>
                </button>
            </Dropdown.Trigger>

            {options.length > 0 ? (
                <Dropdown.Content
                    className={styles.MultiSelectMenu}
                    placement="bottom-start"
                    matchTriggerWidth
                    keepMounted={false}
                >
                    {options.map((option) => {
                        const checked = selectedValueSet.has(option.value);
                        return (
                            <button
                                key={option.value}
                                type="button"
                                role="menuitemcheckbox"
                                aria-checked={checked}
                                className={styles.MultiSelectOption}
                                disabled={disabled || option.disabled}
                                onClick={() => toggleOption(option.value)}
                            >
                                <span
                                    className={styles.MultiSelectCheck}
                                    data-checked={checked ? 'true' : undefined}
                                    aria-hidden="true"
                                >
                                    {checked ? <FiCheck /> : null}
                                </span>
                                <span>{option.label}</span>
                            </button>
                        );
                    })}
                </Dropdown.Content>
            ) : null}
        </div>
    );
};

const WorkflowFormMultiSelect = <T extends string = string>(props: WorkflowFormMultiSelectProps<T>) => (
    <Dropdown>
        <WorkflowFormMultiSelectView {...props} />
    </Dropdown>
);

export default WorkflowFormMultiSelect;
