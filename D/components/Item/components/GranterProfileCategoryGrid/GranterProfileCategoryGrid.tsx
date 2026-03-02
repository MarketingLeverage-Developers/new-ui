import React from 'react';
import classNames from 'classnames';
import { FiEdit2, FiEye, FiEyeOff, FiStar } from 'react-icons/fi';
import { MdStar } from 'react-icons/md';
import styles from './GranterProfileCategoryGrid.module.scss';

export type GranterProfileCategoryRow = {
    key: string;
    code: React.ReactNode;
    name: React.ReactNode;
    icon?: React.ReactNode;
    group?: React.ReactNode;
    costType?: React.ReactNode;
    description?: React.ReactNode;
    custom?: boolean;
    taxLabel?: React.ReactNode;
    taxHint?: React.ReactNode;
    hidden?: boolean;
    favorite?: boolean;
};

export type GranterProfileCategoryGridProps = {
    rows: GranterProfileCategoryRow[];
    className?: string;
    emptyText?: React.ReactNode;
    onRowClick?: (rowKey: string) => void;
    onEditClick?: (rowKey: string) => void;
    onToggleHidden?: (rowKey: string) => void;
    onToggleFavorite?: (rowKey: string) => void;
};

const getInitial = (value: React.ReactNode) => {
    if (typeof value !== 'string') return '?';
    const text = value.trim();
    if (text.length === 0) return '?';
    return text.charAt(0).toUpperCase();
};

const GranterProfileCategoryGrid = ({
    rows,
    className,
    emptyText,
    onRowClick,
    onEditClick,
    onToggleHidden,
    onToggleFavorite,
}: GranterProfileCategoryGridProps) => (
    <div className={classNames(styles.Grid, className)}>
        <div className={classNames(styles.Row, styles.Head)}>
            <div>Code</div>
            <div>Category</div>
            <div>Group</div>
            <div>Type</div>
            <div>Description</div>
            <div>Tax</div>
            <div className={styles.ActionsHead}>Actions</div>
        </div>

        {rows.length === 0 ? (
            <div className={styles.Empty}>{emptyText ?? 'No categories found'}</div>
        ) : (
            rows.map((row) => (
                <button
                    key={row.key}
                    type="button"
                    className={classNames(styles.RowButton, {
                        [styles.RowHidden]: row.hidden,
                    })}
                    onClick={() => onRowClick?.(row.key)}
                >
                    <div className={styles.Row}>
                        <div className={styles.Code}>{row.code}</div>
                        <div className={styles.NameCell}>
                            <span className={styles.Icon}>{row.icon ?? getInitial(row.name)}</span>
                            <span className={styles.Name}>{row.name}</span>
                        </div>
                        <div>{row.group}</div>
                        <div>{row.costType}</div>
                        <div className={styles.Description}>
                            {row.custom ? <span className={styles.CustomBadge}>Custom</span> : null}
                            <span>{row.description}</span>
                        </div>
                        <div className={styles.Tax} title={typeof row.taxHint === 'string' ? row.taxHint : undefined}>
                            {row.taxLabel}
                        </div>
                        <div className={styles.Actions}>
                            <button
                                type="button"
                                className={styles.ActionButton}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onEditClick?.(row.key);
                                }}
                                title="Edit"
                            >
                                <FiEdit2 size={14} />
                            </button>
                            <button
                                type="button"
                                className={styles.ActionButton}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onToggleHidden?.(row.key);
                                }}
                                title={row.hidden ? 'Unhide' : 'Hide'}
                            >
                                {row.hidden ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                            </button>
                            <button
                                type="button"
                                className={styles.ActionButton}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onToggleFavorite?.(row.key);
                                }}
                                title={row.favorite ? 'Unfavorite' : 'Favorite'}
                            >
                                {row.favorite ? <MdStar size={16} className={styles.FavoriteOn} /> : <FiStar size={14} />}
                            </button>
                        </div>
                    </div>
                </button>
            ))
        )}
    </div>
);

export default GranterProfileCategoryGrid;
