import React, { useState } from 'react';
import classNames from 'classnames';
import { MdKeyboardArrowDown } from 'react-icons/md';
import type { IconType } from 'react-icons';
import styles from './ExpandableItem.module.scss';

type ExpandableItemMaxHeightProps = {
    icon?: IconType;
    label?: string;
    isActive?: boolean; // true → 열림
    children?: React.ReactNode;
};

/**
 * 원리(아주 쉽게):
 * - 상자의 '최대 높이'를 0에서 큰 숫자로 바꾸면(예: 600px),
 *   그 사이를 부드럽게 움직일 수 있어요.
 * - 진짜 높이보다 $MAX가 커야 내용이 잘리지 않아요.
 * - 계산 안 하고도 간단히 적용 가능!
 */
export const ExpandableItem: React.FC<ExpandableItemMaxHeightProps> = ({
    icon: Icon,
    label,
    isActive: isActiveProp = false,
    children,
}) => {
    const [isActive, setIsActive] = useState(isActiveProp);

    const handleExpandableItemClick = () => {
        setIsActive((prev) => !prev);
    };

    const expandableItemClassName = classNames(styles.Visible, {
        [styles.Active]: isActive,
        [styles.Open]: isActive,
    });

    return (
        <div className={styles.ExpandableItem}>
            <div
                className={expandableItemClassName}
                onClick={handleExpandableItemClick}
                role="button"
                aria-expanded={isActive}
                aria-controls="expandable-panel-max"
                tabIndex={0}
            >
                <span className={styles.IconLabel}>
                    {Icon && <Icon className={styles.Icon} aria-hidden />}
                    {label && <span className={styles.Label}>{label}</span>}
                </span>
                <MdKeyboardArrowDown className={styles.ArrowIcon} aria-hidden />
            </div>

            {/* max-height: 0 ↔ 큰값(px) 전환 */}
            <div id="expandable-panel-max" className={classNames(styles.Hidden, { [styles.Open]: isActive })}>
                <div className={styles.HiddenInner}>{children}</div>
            </div>
        </div>
    );
};
