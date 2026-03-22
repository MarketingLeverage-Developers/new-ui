import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './SectionBlock.module.scss';

export type SectionBlockProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
    title: React.ReactNode;
    description?: React.ReactNode;
    headerSide?: React.ReactNode;
    headerClassName?: string;
    bodyClassName?: string;
    bodyStyle?: React.CSSProperties;
};

const SectionBlock = ({
    title,
    description,
    headerSide,
    className,
    headerClassName,
    bodyClassName,
    style,
    bodyStyle,
    children,
    ...props
}: SectionBlockProps) => (
    <div className={classNames(styles.Root, className)} style={style} {...props}>
        <div className={classNames(styles.Header, headerClassName)}>
            <div className={styles.HeaderMain}>
                <Text size="sm" weight="bold">
                    {title}
                </Text>
                {description ? (
                    <Text size="xs" tone="muted">
                        {description}
                    </Text>
                ) : null}
            </div>
            {headerSide ? <div className={styles.HeaderSide}>{headerSide}</div> : null}
        </div>
        <div className={classNames(styles.Body, bodyClassName)} style={bodyStyle}>
            {children}
        </div>
    </div>
);

export default SectionBlock;
