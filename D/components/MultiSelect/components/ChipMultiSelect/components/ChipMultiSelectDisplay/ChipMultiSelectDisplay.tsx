import React, { useMemo } from 'react';
import classNames from 'classnames';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import { useManySelect } from '@/shared/headless/ManySelect/ManySelect';
import styles from './ChipMultiSelectDisplay.module.scss';

export type ChipMultiSelectDisplayProps = {
    placeholder?: React.ReactNode;
    className?: string;
};

const ChipMultiSelectDisplay: React.FC<ChipMultiSelectDisplayProps> = (props) => {
    const { placeholder = '선택', className } = props;

    const { manySelectValue, toggleManySelectValue } = useManySelect();

    const chips = useMemo(() => manySelectValue, [manySelectValue]);

    const rootClassName = classNames(styles.Display, className);

    const handleRemoveChip = (value: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
        // ✅ Trigger 클릭(드롭다운 토글)로 이벤트가 퍼지는 걸 차단
        e.preventDefault();
        e.stopPropagation();

        toggleManySelectValue(value);
    };

    return (
        <Dropdown.Trigger className={rootClassName}>
            <div className={styles.Left}>
                {chips.length === 0 ? (
                    <span className={styles.Placeholder}>{placeholder}</span>
                ) : (
                    <div className={styles.ChipRow}>
                        {chips.map((v) => (
                            <button
                                key={v}
                                type="button"
                                className={styles.Chip}
                                onClick={handleRemoveChip(v)}
                                aria-label={`${String(v)} 선택 해제`}
                            >
                                <span className={styles.ChipText}>{v}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className={styles.Right} aria-hidden>
                <span className={styles.Chevron} />
            </div>
        </Dropdown.Trigger>
    );
};

export default ChipMultiSelectDisplay;
