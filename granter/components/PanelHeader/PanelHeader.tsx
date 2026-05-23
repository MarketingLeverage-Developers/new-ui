import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './PanelHeader.module.scss';

export type PanelHeaderProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    rightSlot?: React.ReactNode;
};

const PanelHeader = ({
    title,
    description,
    rightSlot,
    className,
    ...props
}: PanelHeaderProps) => (
    <div className={classNames(styles.PanelHeader, className)} {...props}>
        <div className={styles.Content}>
            <Text as="strong" size="md" weight="semibold" className={styles.Title}>
                {title}
            </Text>
            {description != null ? (
                <>
                    <span className={styles.Separator} aria-hidden="true" />
                    <Text as="span" size="xs" tone="muted" className={styles.Description}>
                        {description}
                    </Text>
                </>
            ) : null}
        </div>
        {rightSlot != null ? <div className={styles.RightSlot}>{rightSlot}</div> : null}
    </div>
);

export default PanelHeader;
