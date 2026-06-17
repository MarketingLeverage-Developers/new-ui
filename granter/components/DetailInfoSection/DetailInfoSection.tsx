import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './DetailInfoSection.module.scss';

export type DetailInfoSectionTone =
    | 'blue'
    | 'sky'
    | 'violet'
    | 'amber'
    | 'orange'
    | 'emerald'
    | 'indigo'
    | 'rose'
    | 'pink'
    | 'cyan';

export type DetailInfoSectionProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
    icon?: React.ReactNode;
    title: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
    tone?: DetailInfoSectionTone;
    columns?: 1 | 2;
    showHeader?: boolean;
    className?: string;
    boxClassName?: string;
    contentClassName?: string;
};

const DetailInfoSection = ({
    icon: _icon,
    title,
    children,
    actions,
    tone: _tone,
    columns = 1,
    showHeader = true,
    className,
    boxClassName,
    contentClassName,
    ...props
}: DetailInfoSectionProps) => {
    void _icon;
    void _tone;

    return (
        <section className={classNames(styles.Root, className)} {...props}>
            <div className={classNames(styles.Box, boxClassName)} data-columns={columns}>
                {showHeader ? (
                    <div className={styles.Header}>
                        <div className={styles.Title}>
                            <Text size="lg" weight="medium">
                                {title}
                            </Text>
                        </div>
                        {actions ? <div className={styles.Actions}>{actions}</div> : null}
                    </div>
                ) : null}
                {contentClassName ? <div className={contentClassName}>{children}</div> : children}
            </div>
        </section>
    );
};

export default DetailInfoSection;
