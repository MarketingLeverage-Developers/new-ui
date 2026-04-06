import type { ReactNode } from 'react';
import Text from '../Text/Text';
import styles from './RankedMetricList.module.scss';

export type RankedMetricListItem = {
    key: string;
    label: ReactNode;
    value: ReactNode;
    valueTone?: 'default' | 'up' | 'down';
    meta?: ReactNode;
    iconSrc?: string;
    icon?: ReactNode;
};

export type RankedMetricListProps = {
    items: RankedMetricListItem[];
    emptyText?: ReactNode;
};

const RankedMetricList = ({
    items,
    emptyText = '표시할 항목이 없습니다.',
}: RankedMetricListProps) => {
    if (items.length === 0) {
        return (
            <Text as="p" className={styles.Empty} tone="muted">
                {emptyText}
            </Text>
        );
    }

    return (
        <div className={styles.List}>
            {items.map((item) => (
                <div key={item.key} className={styles.Item}>
                    <span className={styles.Left}>
                        {item.iconSrc || item.icon ? (
                            <span className={styles.IconWrap}>
                                {item.iconSrc ? <img src={item.iconSrc} alt="" /> : item.icon}
                            </span>
                        ) : null}
                        <span className={styles.LabelWrap}>
                            <Text as="span" className={styles.Label}>
                                {item.label}
                            </Text>
                            {item.meta ? (
                                <Text as="span" className={styles.Meta} tone="subtle" weight="medium">
                                    {item.meta}
                                </Text>
                            ) : null}
                        </span>
                    </span>

                    <Text as="strong" weight="medium" className={styles.Value} data-tone={item.valueTone ?? 'default'}>
                        {item.value}
                    </Text>
                </div>
            ))}
        </div>
    );
};

export default RankedMetricList;
