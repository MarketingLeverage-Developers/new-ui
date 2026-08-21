import type { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import { FiCheck, FiChevronDown } from 'react-icons/fi';
import Dropdown, { useDropdown } from '@/components/common/shared/headless/Dropdown/Dropdown';
import Select, { useSelect } from '@/components/common/shared/headless/Select/Select';
import styles from './WorkflowCompactSelect.module.scss';

export type WorkflowCompactSelectOption<T extends string = string> = {
    value: T;
    label: ReactNode;
    disabled?: boolean;
};

export type WorkflowCompactSelectProps<T extends string = string> = {
    value: T;
    options: WorkflowCompactSelectOption<T>[];
    onChange?: (value: T) => void;
    placeholder?: ReactNode;
    ariaLabel: string;
    disabled?: boolean;
    className?: string;
    menuWidth?: number | string;
};

type WorkflowCompactSelectViewProps<T extends string> = Omit<
    WorkflowCompactSelectProps<T>,
    'onChange'
>;

const WorkflowCompactSelectView = <T extends string,>({
    value,
    options,
    placeholder = '선택',
    ariaLabel,
    disabled = false,
    className,
    menuWidth = 200,
}: WorkflowCompactSelectViewProps<T>) => {
    const { selectValue, changeSelectValue } = useSelect();
    const { isOpen, close } = useDropdown();
    const selectedOption = options.find((option) => option.value === selectValue)
        ?? options.find((option) => option.value === value);
    const menuStyle: CSSProperties = { width: menuWidth };

    return (
        <div className={classNames(styles.Root, className)}>
            <Dropdown.Trigger className={styles.TriggerAnchor} disabled={disabled}>
                <button
                    type="button"
                    className={styles.Trigger}
                    aria-label={ariaLabel}
                    disabled={disabled}
                >
                    <span className={styles.TriggerLabel} data-placeholder={!selectedOption || undefined}>
                        {selectedOption?.label ?? placeholder}
                    </span>
                    <FiChevronDown
                        className={styles.Chevron}
                        data-open={isOpen || undefined}
                        aria-hidden="true"
                    />
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content
                className={styles.Menu}
                placement="bottom-start"
                offset={4}
                keepMounted={false}
                style={menuStyle}
                role="listbox"
                aria-label={ariaLabel}
            >
                {options.map((option) => {
                    const selected = option.value === selectValue;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            className={styles.Option}
                            role="option"
                            aria-selected={selected}
                            data-selected={selected || undefined}
                            disabled={option.disabled}
                            onClick={() => {
                                if (option.disabled) return;
                                changeSelectValue(option.value);
                                close();
                            }}
                        >
                            <span className={styles.Check} aria-hidden="true">
                                {selected ? <FiCheck /> : null}
                            </span>
                            <span className={styles.OptionLabel}>{option.label}</span>
                        </button>
                    );
                })}
            </Dropdown.Content>
        </div>
    );
};

const WorkflowCompactSelect = <T extends string = string>({
    value,
    options,
    onChange,
    ...props
}: WorkflowCompactSelectProps<T>) => (
    <Select value={value} onChange={(nextValue) => onChange?.(nextValue as T)}>
        <Dropdown>
            <WorkflowCompactSelectView value={value} options={options} {...props} />
        </Dropdown>
    </Select>
);

export default WorkflowCompactSelect;
