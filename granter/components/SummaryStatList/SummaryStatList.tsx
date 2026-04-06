import type { ReactNode } from 'react';
import Text from '../Text/Text';
import styles from './SummaryStatList.module.scss';

export type SummaryStatListItem = {
    key: string;
    label: ReactNode;
    value: ReactNode;
    valueTone?: 'default' | 'up' | 'down';
    iconSrc?: string;
    icon?: ReactNode;
};

export type SummaryStatListProps = {
    items: SummaryStatListItem[];
};

const SummaryStatList = ({ items }: SummaryStatListProps) => (
    <div className={styles.List}>
        {items.map((item) => (
            <div key={item.key} className={styles.Item}>
                <div className={styles.Left}>
                    {item.iconSrc || item.icon ? (
                        <span className={styles.IconWrap}>
                            {item.iconSrc ? <img src={item.iconSrc} alt="" /> : item.icon}
                        </span>
                    ) : null}

                    <div className={styles.Copy}>
                        <Text as="span" className={styles.Label}>
                            {item.label}
                        </Text>
                    </div>
                </div>

                <Text as="strong" weight="semibold" className={styles.Value} data-tone={item.valueTone ?? 'default'}>
                    {item.value}
                </Text>
            </div>
        ))}
    </div>
);

export default SummaryStatList;
