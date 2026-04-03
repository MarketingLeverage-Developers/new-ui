import React from 'react';
import classNames from 'classnames';
import { FiChevronRight } from 'react-icons/fi';
import styles from './HeaderBreadcrumb.module.scss';

export type HeaderBreadcrumbItem = {
    key?: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
};

export type HeaderBreadcrumbProps = React.HTMLAttributes<HTMLDivElement> & {
    items: HeaderBreadcrumbItem[];
    separator?: React.ReactNode;
    itemClassName?: string;
};

const HeaderBreadcrumb = ({
    items,
    separator = <FiChevronRight size={14} />,
    className,
    itemClassName,
    ...props
}: HeaderBreadcrumbProps) => (
    <div className={classNames(styles.Root, className)} {...props}>
        {items.map((item, index) => {
            const isCurrent = index === items.length - 1;
            const commonClassName = classNames(styles.Item, itemClassName);

            return (
                <React.Fragment key={item.key ?? `${String(item.label)}-${index}`}>
                    {item.onClick && !item.disabled ? (
                        <button
                            type="button"
                            className={commonClassName}
                            data-current={isCurrent ? 'true' : 'false'}
                            onClick={item.onClick}
                        >
                            {item.icon ? <span className={styles.ItemIcon}>{item.icon}</span> : null}
                            <span className={styles.ItemLabel}>{item.label}</span>
                        </button>
                    ) : (
                        <span className={commonClassName} data-current={isCurrent ? 'true' : 'false'}>
                            {item.icon ? <span className={styles.ItemIcon}>{item.icon}</span> : null}
                            <span className={styles.ItemLabel}>{item.label}</span>
                        </span>
                    )}

                    {!isCurrent ? <span className={styles.Separator}>{separator}</span> : null}
                </React.Fragment>
            );
        })}
    </div>
);

export default HeaderBreadcrumb;
