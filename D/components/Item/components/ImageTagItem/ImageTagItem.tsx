import React from 'react';
import styles from './ImageTagItem.module.scss';
import CheckBoxToggle from '@/shared/primitives/CheckBoxToggle/CheckBoxToggle';
import { Common } from '@/shared/primitives/C/Common';

export type ImageTagItemTag = {
    id?: string | number;
    label: string;
};

export type ImageTagItemProps = {
    imageSrc?: string;
    imageAlt?: string;
    imagePrefix?: string;
    title: string;
    count: number;
    subtitle: string;
    tags: ImageTagItemTag[];
    selectable?: boolean;
    checkboxValue?: boolean;
    onCheckboxClick?: (value: boolean) => void;
    onClick?: () => void;
    actions?: React.ReactNode;
};

const ImageTagItem = ({
    imageSrc,
    imageAlt,
    imagePrefix,
    title,
    count,
    subtitle,
    tags,
    selectable = false,
    checkboxValue = false,
    onCheckboxClick,
    onClick,
    actions,
}: ImageTagItemProps) => (
    <div
        className={styles.ImageTagItem}
        onClick={() => {
            if (selectable) return;
            onClick?.();
        }}
    >
        <div className={styles.ImageContainer}>
            {selectable && (
                <div
                    className={styles.CheckBoxWrapper}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <CheckBoxToggle value={checkboxValue} onTriggerClick={onCheckboxClick} />
                </div>
            )}
            {actions ? (
                <>
                    <div className={styles.ImageDim} />
                    <div
                        className={styles.ActionOverlay}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {actions}
                    </div>
                </>
            ) : null}
            <Common.Image
                src={imageSrc}
                prefix={imagePrefix}
                alt={imageAlt ?? ''}
                className={styles.Image}
                width="100%"
                height="100%"
                // fit="cover"
                block
            />
        </div>
        <div className={styles.InfoContainer}>
            <span className={styles.Title}>
                <span>{title}</span>&nbsp;
                <span className={styles.Count}>({count})</span>
            </span>
            <span className={styles.SubTitle}>{subtitle}</span>
        </div>
        <div className={styles.TagContainer}>
            {tags.map((tag, index) => (
                <span className={styles.Tag} key={tag.id ?? `${tag.label}-${index}`}>
                    {tag.label}
                </span>
            ))}
        </div>
    </div>
);

export default ImageTagItem;
