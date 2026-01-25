import React from 'react';
import classNames from 'classnames';
import styles from './BaseMultiInput.module.scss';
import type { MultiInputCommonProps } from '../../MultiInput';
import MultiInput, { useMultiInput } from '@/shared/headless/MultiInput/MultiInput';
import { IoCloseOutline } from 'react-icons/io5';

export type BaseMultiInputStatus = 'default' | 'error' | 'success';

export type BaseMultiInputExtraProps = {
    status?: BaseMultiInputStatus;
    message?: string;
    value?: string;
    onChange?: (combinedValue: string) => void;
    separator?: string;
    minCount?: number;
    maxCount?: number;
    addLabel?: React.ReactNode;
};

type BaseMultiInputProps = MultiInputCommonProps & BaseMultiInputExtraProps;

type BaseMultiInputContentProps = Omit<BaseMultiInputProps, 'value' | 'onChange' | 'separator' | 'minCount' | 'maxCount'>;

const BaseMultiInputContent: React.FC<BaseMultiInputContentProps> = (props) => {
    const {
        status = 'default',
        message,
        addLabel = '추가',
        className,
        disabled,
        ...inputProps
    } = props;
    const { inputValues, setInputValue, removeInput, canRemove, addInput, canAdd } = useMultiInput();

    const wrapperClassName = classNames(styles.Wrapper, className, {
        [styles.Error]: status === 'error',
        [styles.Success]: status === 'success',
    });

    const itemClassName = classNames(styles.Item, {
        [styles.Error]: status === 'error',
        [styles.Success]: status === 'success',
        [styles.Disabled]: disabled,
    });

    return (
        <div className={wrapperClassName}>
            <div className={styles.List}>
                {inputValues.map((value, idx) => (
                    <div key={idx} className={itemClassName}>
                        <input
                            {...inputProps}
                            disabled={disabled}
                            value={value}
                            onChange={(e) => setInputValue(idx, e.target.value)}
                        />
                        {canRemove && (
                            <button
                                type="button"
                                className={styles.RemoveButton}
                                onClick={() => removeInput(idx)}
                                aria-label="삭제"
                                disabled={disabled}
                            >
                                <IoCloseOutline size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.Footer}>
                <button
                    type="button"
                    className={classNames(styles.AddButton, { [styles.AddButtonDisabled]: !canAdd || disabled })}
                    onClick={addInput}
                    disabled={!canAdd || disabled}
                >
                    {addLabel}
                </button>
            </div>
            {message ? <span className={styles.Message}>{message}</span> : null}
        </div>
    );
};

const BaseMultiInput: React.FC<BaseMultiInputProps> = ({
    value,
    onChange,
    separator = ', ',
    minCount = 1,
    maxCount,
    ...rest
}) => (
    <MultiInput value={value} onChange={onChange} separator={separator} minCount={minCount} maxCount={maxCount}>
        <BaseMultiInputContent {...rest} />
    </MultiInput>
);

export default BaseMultiInput;
