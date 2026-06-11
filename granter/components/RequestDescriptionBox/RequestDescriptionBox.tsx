import React from 'react';
import classNames from 'classnames';
import { FiMessageSquare } from 'react-icons/fi';
import styles from './RequestDescriptionBox.module.scss';

export type RequestDescriptionBoxProps = {
    className?: string;
    label?: React.ReactNode;
    icon?: React.ReactNode;
    description: React.ReactNode;
    collapsible?: boolean;
    lineClamp?: number;
    moreLabel?: React.ReactNode;
    lessLabel?: React.ReactNode;
};

const isEmpty = (value: React.ReactNode) => value === null || value === undefined || value === '';

const renderEmpty = (value: React.ReactNode) => (isEmpty(value) ? '-' : value);

const shouldShowToggle = (description: React.ReactNode, collapsible?: boolean) => {
    if (!collapsible) return false;
    if (typeof description === 'string') return description.trim().length > 90;
    if (typeof description === 'number') return String(description).length > 90;
    return Boolean(description);
};

const RequestDescriptionBox = ({
    className,
    label = '설명',
    icon = <FiMessageSquare aria-hidden="true" />,
    description,
    collapsible = true,
    lineClamp = 3,
    moreLabel = '더보기',
    lessLabel = '접기',
}: RequestDescriptionBoxProps) => {
    const [expanded, setExpanded] = React.useState(false);
    const hasToggle = shouldShowToggle(description, collapsible);
    const style = {
        '--request-description-lines': lineClamp,
    } as React.CSSProperties;

    return (
        <div className={classNames(styles.Root, className)}>
            <div className={styles.Header}>
                <span className={styles.Icon}>{icon}</span>
                <span>{label}</span>
            </div>
            <div className={styles.Text} data-expanded={expanded ? 'true' : 'false'} style={style}>
                {renderEmpty(description)}
            </div>
            {hasToggle ? (
                <button type="button" className={styles.ToggleButton} onClick={() => setExpanded((prev) => !prev)}>
                    {expanded ? lessLabel : moreLabel}
                </button>
            ) : null}
        </div>
    );
};

export default RequestDescriptionBox;
