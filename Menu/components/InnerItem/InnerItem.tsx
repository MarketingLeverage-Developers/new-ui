import React from 'react';
import styles from './InnerItem.module.scss';
import classNames from 'classnames';

type InnerItemProps = {
    label?: string;
    isActive?: boolean;
    onClick?: () => void; // 클릭 이벤트 핸들러 추가
};

export const InnerItem = ({ label, isActive, onClick }: InnerItemProps) => {
    const InnerItemClassName = classNames(styles.InnerItem, {
        [styles.Active]: isActive,
    });

    return (
        <div className={InnerItemClassName} onClick={() => onClick && onClick()}>
            <span>{label}</span>
        </div>
    );
};
