import React from 'react';
import classNames from 'classnames';
import styles from './Item.module.scss';

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type ItemProps = {
    icon?: IconType; // react-icons도 컴포넌트 타입
    label?: string;
    isActive?: boolean;
    onClick?: () => void; // 클릭 이벤트 핸들러 추가
};

export const Item: React.FC<ItemProps> = ({ icon, label, isActive, onClick }) => {
    const Icon = icon;
    const itemClass = classNames(styles.Item, { [styles.Active]: isActive });

    return (
        <div className={itemClass} onClick={onClick}>
            {Icon && <Icon className={styles.Icon} />}
            <div className={styles.Label}>{label}</div>
        </div>
    );
};
