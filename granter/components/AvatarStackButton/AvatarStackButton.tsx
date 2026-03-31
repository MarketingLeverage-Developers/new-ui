import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import classNames from 'classnames';
import type { ButtonHTMLAttributes } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';
import styles from './AvatarStackButton.module.scss';

export type AvatarStackButtonItem = {
    id: string | number;
    label: string;
    imageSrc?: string | null;
};

export type AvatarStackButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
    items: AvatarStackButtonItem[];
    maxVisibleAvatars?: number;
    avatarSize?: number;
    avatarFontSize?: number;
};

const AvatarStackButton = ({
    items,
    maxVisibleAvatars = 3,
    avatarSize = 40,
    avatarFontSize = 13,
    className,
    type = 'button',
    ...props
}: AvatarStackButtonProps) => {
    const visibleItems = items.slice(0, Math.max(1, maxVisibleAvatars));
    const hiddenCount = Math.max(0, items.length - visibleItems.length);

    return (
        <button type={type} className={classNames(styles.Button, className)} {...props}>
            <span className={styles.Stack}>
                <span className={styles.AddBadge} aria-hidden="true">
                    <HiOutlinePlus size={18} />
                </span>
                <span className={styles.AvatarCluster}>
                    {visibleItems.map((item) => (
                        <MemberProfileAvatar
                            key={item.id}
                            className={styles.Avatar}
                            name={item.label}
                            src={item.imageSrc}
                            size={avatarSize}
                            fontSize={avatarFontSize}
                        />
                    ))}
                    {hiddenCount > 0 ? <span className={styles.Overflow}>+{hiddenCount}</span> : null}
                </span>
            </span>
        </button>
    );
};

export default AvatarStackButton;
