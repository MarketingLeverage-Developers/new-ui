import React from 'react';
import classNames from 'classnames';
import styles from './ModalTemplateHeader.module.scss';

export type ModalTemplateHeaderProps = {
    className?: string;
    title?: string;
    subTitle?: string;
    onTitleChange?: (title: string) => void;
};

const ModalTemplateHeader: React.FC<ModalTemplateHeaderProps> = (props) => {
    const { className, title, subTitle, onTitleChange } = props;

    const rootClassName = classNames(styles.ModalTemplateHeader, className);

    return (
        <div className={rootClassName}>
            <div className={styles.SubTitle}>{subTitle}</div>
            {onTitleChange ? (
                <input value={title} onChange={(e) => onTitleChange?.(e.target.value)} className={styles.TitleInput} />
            ) : (
                <div className={styles.Title}>{title}</div>
            )}
        </div>
    );
};

export default ModalTemplateHeader;
