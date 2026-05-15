import React from 'react';
import classNames from 'classnames';
import styles from './IconHeaderSection.module.scss';

export type IconHeaderSectionProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
    title: React.ReactNode;
    icon?: React.ReactNode;
    description?: React.ReactNode;
    headerSide?: React.ReactNode;
    bodyClassName?: string;
};

const IconHeaderSection = ({
    title,
    icon,
    description,
    headerSide,
    children,
    className,
    bodyClassName,
    ...props
}: IconHeaderSectionProps) => (
    <section className={classNames(styles.Root, className)} {...props}>
        <div className={styles.Header}>
            <div className={styles.HeaderMain}>
                {icon ? <span className={styles.Icon}>{icon}</span> : null}
                <div className={styles.HeaderText}>
                    <h3 className={styles.Title}>{title}</h3>
                    {description ? <p className={styles.Description}>{description}</p> : null}
                </div>
            </div>
            {headerSide ? <div className={styles.HeaderSide}>{headerSide}</div> : null}
        </div>
        <div className={classNames(styles.Body, bodyClassName)}>{children}</div>
    </section>
);

export default IconHeaderSection;
