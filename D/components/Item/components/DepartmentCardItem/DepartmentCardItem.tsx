import { type CSSProperties, type ReactNode } from 'react';
import type { DepartmentCardChipStyle } from '@/shared/types/DepartmentCardChipStyle';
import styles from './DepartmentCardItem.module.scss';

export type DepartmentCardItemProps = {
    name: string;
    leader?: string;
    description?: string;
    membersCount?: number;
    onClick?: () => void;
    actionNode?: ReactNode;
    chipStyle?: DepartmentCardChipStyle;
};

const defaultChipStyle: DepartmentCardChipStyle = {
    bgColor: '#EEEEEE',
    textColor: '#555555',
};

const MemberIcon = () => (
    <svg className={styles.MemberIcon} viewBox="0 0 16 16" role="presentation" aria-hidden>
        <path
            d="M8 8c1.657 0 3-1.343 3-3S9.657 2 8 2 5 3.343 5 5s1.343 3 3 3Zm0 1c-2.333 0-7 1.167-7 3.5V15h14v-2.5C15 10.167 10.333 9 8 9Z"
            fill="currentColor"
        />
    </svg>
);

const DepartmentCardItem = ({
    name,
    leader,
    description,
    membersCount,
    onClick,
    actionNode,
    chipStyle = defaultChipStyle,
}: DepartmentCardItemProps) => {
    const chipGradientStyle = 'gradientStyle' in chipStyle ? chipStyle.gradientStyle : undefined;

    const chipInlineStyle: CSSProperties = {
        color: chipStyle.textColor,
        ...('bgColor' in chipStyle && chipStyle.bgColor ? { background: chipStyle.bgColor } : {}),
        ...(chipGradientStyle ?? {}),
    };

    const cardClassName = [styles.DepartmentCard];
    if (onClick) cardClassName.push(styles['DepartmentCard--clickable']);

    return (
        <div className={cardClassName.join(' ')} onClick={onClick}>
            <div className={styles.Header}>
                <div className={styles.HeaderGroup}>
                    <span className={styles.Chip} style={chipInlineStyle}>
                        {name}
                    </span>
                    <span className={styles.DepartmentName}>{name}</span>
                </div>
                <div className={styles.MemberGroup}>
                    <MemberIcon />
                    <span>{membersCount ?? 0}</span>
                    {actionNode && <div className={styles.ActionSlot}>{actionNode}</div>}
                </div>
            </div>
            <div className={styles.Content}>
                <div className={styles.ContentRow}>
                    <span className={styles.ContentLabel}>부서장</span>
                    <span className={styles.ContentValue}>{leader ?? '-'}</span>
                </div>
                <div className={styles.ContentRow}>
                    <span className={styles.ContentLabel}>설명</span>
                    <span className={styles.ContentValue}>{description ?? '-'}</span>
                </div>
            </div>
        </div>
    );
};

export default DepartmentCardItem;
