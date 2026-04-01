import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import Dropdown, { useDropdown } from '../../../shared/headless/Dropdown/Dropdown';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import styles from './SectionFieldDurationInput.module.scss';

const noop = () => undefined;
const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

export type SectionFieldDurationInputUnitOption = {
    value: string;
    label: React.ReactNode;
    secondsMultiplier: number;
    disabled?: boolean;
};

export type SectionFieldDurationInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'size' | 'value' | 'onChange' | 'className'
> & {
    value: number | string;
    onChange?: (nextValue: string) => void;
    className?: string;
    width?: number | string;
    minWidth?: number | string;
    maxWidth?: number | string;
    fullWidthOnMobile?: boolean;
    inputClassName?: string;
    controlClassName?: string;
    menuClassName?: string;
    summaryClassName?: string;
    summary?: React.ReactNode;
    formatSummary?: (totalSeconds: number) => React.ReactNode;
    unitOptions?: SectionFieldDurationInputUnitOption[];
    defaultUnit?: string;
    unitAriaLabel?: string;
    unitMinWidth?: number | string;
    unitPaddingX?: number | string;
};

type SectionFieldDurationInputCssProperties = React.CSSProperties & {
    '--granter-section-field-duration-width'?: string;
    '--granter-section-field-duration-min-width'?: string;
    '--granter-section-field-duration-max-width'?: string;
    '--granter-section-field-duration-unit-min-width'?: string;
    '--granter-section-field-duration-unit-padding-x'?: string;
};

const DEFAULT_UNIT_OPTIONS: SectionFieldDurationInputUnitOption[] = [
    { value: 'SECOND', label: '초', secondsMultiplier: 1 },
    { value: 'MINUTE', label: '분', secondsMultiplier: 60 },
    { value: 'HOUR', label: '시간', secondsMultiplier: 60 * 60 },
];

const sanitizeDigits = (value: string) => value.replace(/[^\d]/g, '');

const toTotalSeconds = (value: number | string) => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
    }

    const digits = sanitizeDigits(value);
    return digits ? Number(digits) : 0;
};

const getBestUnitOption = (
    totalSeconds: number,
    options: SectionFieldDurationInputUnitOption[],
    defaultUnit?: string
) => {
    const defaultOption = defaultUnit ? options.find((option) => option.value === defaultUnit) : undefined;
    if (totalSeconds <= 0) return defaultOption ?? options[0];

    const sortedOptions = [...options].sort((left, right) => right.secondsMultiplier - left.secondsMultiplier);
    return (
        sortedOptions.find(
            (option) => option.secondsMultiplier > 0 && totalSeconds % option.secondsMultiplier === 0
        ) ??
        defaultOption ??
        options[0]
    );
};

const toDisplayValue = (totalSeconds: number, option: SectionFieldDurationInputUnitOption) => {
    if (option.secondsMultiplier <= 0) return String(totalSeconds);
    return String(Math.floor(totalSeconds / option.secondsMultiplier));
};

const normalizeSecondsForUnit = (totalSeconds: number, option: SectionFieldDurationInputUnitOption) => {
    if (totalSeconds <= 0) return 0;
    if (option.secondsMultiplier <= 1) return totalSeconds;
    return Math.max(
        option.secondsMultiplier,
        Math.round(totalSeconds / option.secondsMultiplier) * option.secondsMultiplier
    );
};

type UnitOptionItemProps = {
    option: SectionFieldDurationInputUnitOption;
    disabled?: boolean;
};

const UnitOptionItem = ({ option, disabled = false }: UnitOptionItemProps) => {
    const { isActive, changeSelectValue } = useSelect();
    const { close } = useDropdown();
    const isDisabled = Boolean(disabled || option.disabled);

    return (
        <button
            type="button"
            className={styles.Option}
            data-active={isActive(option.value) ? 'true' : 'false'}
            disabled={isDisabled}
            onClick={() => {
                if (isDisabled) return;
                changeSelectValue(option.value);
                close();
            }}
        >
            {option.label}
        </button>
    );
};

const SectionFieldDurationInput = React.forwardRef<HTMLInputElement, SectionFieldDurationInputProps>(
    (
        {
            value,
            onChange = noop,
            className,
            width,
            minWidth,
            maxWidth,
            fullWidthOnMobile = false,
            inputClassName,
            controlClassName,
            menuClassName,
            summaryClassName,
            summary,
            formatSummary,
            unitOptions = DEFAULT_UNIT_OPTIONS,
            defaultUnit,
            unitAriaLabel = '시간 단위 선택',
            unitMinWidth,
            unitPaddingX,
            disabled = false,
            placeholder = '0',
            inputMode = 'numeric',
            type = 'text',
            ...inputProps
        },
        ref
    ) => {
        const options = useMemo(
            () => (unitOptions.length > 0 ? unitOptions : DEFAULT_UNIT_OPTIONS),
            [unitOptions]
        );
        const totalSeconds = useMemo(() => toTotalSeconds(value), [value]);
        const cssVariables: SectionFieldDurationInputCssProperties = {
            '--granter-section-field-duration-width': toCssLength(width),
            '--granter-section-field-duration-min-width': toCssLength(minWidth),
            '--granter-section-field-duration-max-width': toCssLength(maxWidth),
            '--granter-section-field-duration-unit-min-width': toCssLength(unitMinWidth),
            '--granter-section-field-duration-unit-padding-x': toCssLength(unitPaddingX),
        };
        const [selectedUnitValue, setSelectedUnitValue] = useState<string>(() =>
            getBestUnitOption(totalSeconds, options, defaultUnit).value
        );
        const selectedUnit =
            options.find((option) => option.value === selectedUnitValue) ??
            getBestUnitOption(totalSeconds, options, defaultUnit);
        const [draftValue, setDraftValue] = useState(() => toDisplayValue(totalSeconds, selectedUnit));
        const summaryContent = formatSummary ? formatSummary(totalSeconds) : summary;

        useEffect(() => {
            const nextOption =
                selectedUnit &&
                (totalSeconds <= 0 || totalSeconds % selectedUnit.secondsMultiplier === 0)
                    ? selectedUnit
                    : getBestUnitOption(totalSeconds, options, defaultUnit);

            if (nextOption.value !== selectedUnitValue) {
                setSelectedUnitValue(nextOption.value);
                return;
            }

            setDraftValue(toDisplayValue(totalSeconds, nextOption));
        }, [defaultUnit, options, selectedUnit, selectedUnitValue, totalSeconds]);

        return (
            <div
                className={classNames(styles.Root, className)}
                style={cssVariables}
                data-full-width-on-mobile={fullWidthOnMobile ? 'true' : 'false'}
            >
                <div
                    className={classNames(styles.Control, controlClassName)}
                    data-disabled={disabled ? 'true' : 'false'}
                >
                    <input
                        {...inputProps}
                        ref={ref}
                        type={type}
                        value={draftValue}
                        onChange={(event) => {
                            const digits = sanitizeDigits(event.target.value);
                            setDraftValue(digits);
                            onChange(digits ? String(Number(digits) * selectedUnit.secondsMultiplier) : '0');
                        }}
                        disabled={disabled}
                        placeholder={placeholder}
                        inputMode={inputMode}
                        className={classNames(styles.Input, inputClassName)}
                    />

                    <div className={styles.Divider} />

                    <Select
                        value={selectedUnit.value}
                        onChange={(nextValue) => {
                            const nextUnit = options.find((option) => option.value === nextValue);
                            if (!nextUnit) return;

                            const currentDisplayValue = sanitizeDigits(draftValue);
                            const nextTotalSeconds = currentDisplayValue
                                ? Number(currentDisplayValue) * selectedUnit.secondsMultiplier
                                : totalSeconds;
                            const normalizedSeconds = normalizeSecondsForUnit(nextTotalSeconds, nextUnit);

                            setSelectedUnitValue(nextUnit.value);
                            setDraftValue(toDisplayValue(normalizedSeconds, nextUnit));
                            onChange(String(normalizedSeconds));
                        }}
                    >
                        <Dropdown>
                            <Dropdown.Trigger className={styles.UnitTriggerWrap} disabled={disabled}>
                                <button
                                    type="button"
                                    className={styles.UnitTrigger}
                                    aria-label={unitAriaLabel}
                                    disabled={disabled}
                                >
                                    <span className={styles.UnitLabel}>{selectedUnit.label}</span>
                                    <UnitChevronIcon />
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content
                                className={classNames(styles.Menu, menuClassName)}
                                placement="bottom-end"
                                keepMounted={false}
                            >
                                {options.map((option) => (
                                    <UnitOptionItem key={option.value} option={option} disabled={disabled} />
                                ))}
                            </Dropdown.Content>
                        </Dropdown>
                    </Select>
                </div>

                {summaryContent ? (
                    <div className={classNames(styles.Summary, summaryClassName)}>{summaryContent}</div>
                ) : null}
            </div>
        );
    }
);

type UnitChevronIconProps = {
    size?: number;
};

const UnitChevronIcon = ({ size = 16 }: UnitChevronIconProps) => {
    const { isOpen } = useDropdown();

    return (
        <span className={styles.UnitIcon} data-open={isOpen ? 'true' : 'false'}>
            <HiOutlineChevronDown size={size} />
        </span>
    );
};

SectionFieldDurationInput.displayName = 'SectionFieldDurationInput';

export default SectionFieldDurationInput;
