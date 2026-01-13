import type React from 'react';
import type { InputHTMLAttributes } from 'react';
import classNames from 'classnames';
import { IoCloseOutline } from 'react-icons/io5';
import styles from './InputList.module.scss';
import { useMultiInput } from '@/shared/headless/MultiInput/MultiInput';
import { STATUS, type Status } from '@/shared/types/css/Status';

type InputListProps = {
    width?: React.CSSProperties['width'];
    status?: Status;
    helperText?: React.ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>;

const InputList: React.FC<InputListProps> = ({
    width = '100%',
    status = STATUS.DEFAULT,
    helperText,
    className,
    ...inputProps
}) => {
    const { inputValues, setInputValue, removeInput, canRemove } = useMultiInput();

    return (
        <div className={styles.InputListWrapper} style={{ width }}>
            {inputValues.map((value, idx) => {
                const cn = classNames(styles.InputItem, className, {
                    [styles.Error]: status === STATUS.ERROR,
                    [styles.Success]: status === STATUS.SUCCESS,
                    [styles.Disabled]: inputProps.disabled,
                });

                return (
                    <div key={idx} className={cn}>
                        <input {...inputProps} value={value} onChange={(e) => setInputValue(idx, e.target.value)} />
                        {canRemove && (
                            <button
                                type="button"
                                className={styles.RemoveButton}
                                onClick={() => removeInput(idx)}
                                aria-label="삭제"
                            >
                                <IoCloseOutline size={18} />
                            </button>
                        )}
                    </div>
                );
            })}
            {status !== STATUS.DEFAULT && helperText && <span className={styles.Helper}>{helperText}</span>}
        </div>
    );
};

export default InputList;
