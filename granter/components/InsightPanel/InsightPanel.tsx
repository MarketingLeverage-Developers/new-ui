import classNames from 'classnames';
import type { ReactNode } from 'react';
import Text from '../Text/Text';
import styles from './InsightPanel.module.scss';

export type InsightPanelProps = {
    title?: ReactNode;
    subtitle?: ReactNode;
    extra?: ReactNode;
    children: ReactNode;
    className?: string;
    bodyClassName?: string;
};

const InsightPanel = ({
    title,
    subtitle,
    extra,
    children,
    className,
    bodyClassName,
}: InsightPanelProps) => (
    <section className={classNames(styles.Panel, className)}>
        {title || subtitle || extra ? (
            <header className={styles.Header}>
                <div className={styles.Copy}>
                    {title ? (
                        <Text as="h3" weight="semibold" className={styles.Title}>
                            {title}
                        </Text>
                    ) : null}
                    {subtitle ? (
                        <Text as="p" tone="muted" className={styles.Subtitle}>
                            {subtitle}
                        </Text>
                    ) : null}
                </div>
                {extra ? <div className={styles.Extra}>{extra}</div> : null}
            </header>
        ) : null}

        <div className={classNames(styles.Body, bodyClassName)}>{children}</div>
    </section>
);

export default InsightPanel;
