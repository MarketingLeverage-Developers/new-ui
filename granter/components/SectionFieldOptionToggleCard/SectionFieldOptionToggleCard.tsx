import React from 'react';
import classNames from 'classnames';
import BasicContent from '../BasicContent/BasicContent';
import Text from '../Text/Text';
import styles from './SectionFieldOptionToggleCard.module.scss';

export type SectionFieldOptionToggleCardProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
};

const SectionFieldOptionToggleCard = ({
    title,
    description,
    checked,
    defaultChecked,
    onChange,
    disabled = false,
    className,
}: SectionFieldOptionToggleCardProps) => (
    <div className={classNames(styles.Root, className)} data-disabled={disabled ? 'true' : 'false'}>
        <div className={styles.Main}>
            <div className={styles.Copy}>
                <Text as="strong" className={styles.Title} weight="bold">
                    {title}
                </Text>
                {description ? (
                    <Text as="p" className={styles.Description} size="sm" tone="muted">
                        {description}
                    </Text>
                ) : null}
            </div>

            <BasicContent.Switch
                checked={checked}
                defaultChecked={defaultChecked}
                onChange={onChange}
                disabled={disabled}
                className={styles.Switch}
            />
        </div>
    </div>
);

export default SectionFieldOptionToggleCard;
