import React from 'react';
import classNames from 'classnames';
import { FiChevronDown } from 'react-icons/fi';
import Text from '../Text/Text';
import styles from './DetailSubSection.module.scss';

export type DetailSubSectionTone =
    | 'blue'
    | 'indigo'
    | 'orange'
    | 'violet'
    | 'emerald'
    | 'amber'
    | 'slate';

export type DetailSubSectionProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
    title: React.ReactNode;
    children: React.ReactNode;
    icon?: React.ReactNode;
    description?: React.ReactNode;
    rightSlot?: React.ReactNode;
    tone?: DetailSubSectionTone;
    bodyClassName?: string;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    collapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
};

const DetailSubSection = ({
    title,
    children,
    icon,
    description,
    rightSlot,
    tone = 'indigo',
    className,
    bodyClassName,
    collapsible = false,
    defaultCollapsed = false,
    collapsed,
    onCollapsedChange,
    ...props
}: DetailSubSectionProps) => {
    const bodyId = React.useId();
    const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
    const isControlled = collapsed !== undefined;
    const isCollapsed = collapsible ? (isControlled ? collapsed : internalCollapsed) : false;
    const handleToggle = () => {
        if (!collapsible) return;

        const nextCollapsed = !isCollapsed;
        if (!isControlled) {
            setInternalCollapsed(nextCollapsed);
        }
        onCollapsedChange?.(nextCollapsed);
    };

    return (
        <section className={classNames(styles.Root, className)} data-collapsible={collapsible ? 'true' : 'false'} {...props}>
            <header className={styles.Header}>
                <div className={styles.TitleWrap}>
                    {icon ? (
                        <span className={styles.IconBox} data-tone={tone} aria-hidden="true">
                            {icon}
                        </span>
                    ) : null}
                    <div className={styles.TitleText}>
                        <Text as="strong" size="sm" weight="regular" className={styles.Title}>
                            {title}
                        </Text>
                        {description ? (
                            <Text as="span" size="xs" tone="muted" className={styles.Description}>
                                {description}
                            </Text>
                        ) : null}
                    </div>
                </div>
                {rightSlot || collapsible ? (
                    <div className={styles.Actions}>
                        {rightSlot ? <div className={styles.RightSlot}>{rightSlot}</div> : null}
                        {collapsible ? (
                            <button
                                type="button"
                                className={styles.ToggleButton}
                                aria-label={isCollapsed ? '섹션 펼치기' : '섹션 접기'}
                                aria-expanded={!isCollapsed}
                                aria-controls={bodyId}
                                data-collapsed={isCollapsed ? 'true' : 'false'}
                                onClick={handleToggle}
                            >
                                <FiChevronDown aria-hidden="true" />
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </header>
            <div id={bodyId} className={classNames(styles.Body, bodyClassName)} hidden={isCollapsed}>
                {children}
            </div>
        </section>
    );
};

export default DetailSubSection;
