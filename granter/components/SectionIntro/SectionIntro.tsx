import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './SectionIntro.module.scss';

export type SectionIntroProps = {
    eyebrow?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    titleAs?: React.ElementType;
    className?: string;
};

const SectionIntro = ({
    eyebrow,
    title,
    description,
    titleAs = 'h2',
    className,
}: SectionIntroProps) => (
    <div className={classNames(styles.SectionIntro, className)}>
        {eyebrow ? (
            <Text size="xs" weight="semibold" className={styles.Eyebrow}>
                {eyebrow}
            </Text>
        ) : null}
        <Text as={titleAs} size="xl" weight="bold" className={styles.Title}>
            {title}
        </Text>
        {description ? (
            <Text size="sm" tone="muted" className={styles.Description}>
                {description}
            </Text>
        ) : null}
    </div>
);

export default SectionIntro;
