import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './SurfacePanel.module.scss';

export type SurfacePanelProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
    as?: React.ElementType;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    headerClassName?: string;
    bodyClassName?: string;
};

const SurfacePanel = ({
    as: Component = 'section',
    title,
    description,
    action,
    className,
    headerClassName,
    bodyClassName,
    children,
    ...props
}: SurfacePanelProps) => {
    const hasHeader = title !== undefined || description !== undefined || action !== undefined;

    return (
        <Component className={classNames(styles.Root, className)} {...props}>
            {hasHeader ? (
                <div className={classNames(styles.Header, headerClassName)}>
                    <div className={styles.TitleGroup}>
                        {title !== undefined ? (
                            <Text as="h3" size="xl" weight="regular" className={styles.Title}>
                                {title}
                            </Text>
                        ) : null}
                        {description !== undefined ? (
                            <Text size="sm" tone="muted" className={styles.Description}>
                                {description}
                            </Text>
                        ) : null}
                    </div>

                    {action ? <div className={styles.Action}>{action}</div> : null}
                </div>
            ) : null}

            <div className={classNames(styles.Body, bodyClassName)}>{children}</div>
        </Component>
    );
};

export default SurfacePanel;
