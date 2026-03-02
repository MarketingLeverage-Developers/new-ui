import React from 'react';
import styles from './GranterHomeAssetMetricGrid.module.scss';

export type GranterHomeAssetMetricItem = {
    key: string;
    title: React.ReactNode;
    value: React.ReactNode;
    accent: string;
    info?: React.ReactNode;
};

export type GranterHomeAssetMetricGridProps = {
    items: GranterHomeAssetMetricItem[];
};

const GranterHomeAssetMetricGrid = ({ items }: GranterHomeAssetMetricGridProps) => (
    <div className={styles.AssetMetricGrid}>
        {items.map((item) => (
            <button key={item.key} type="button" className={styles.AssetMetricCard}>
                <span className={styles.AssetMetricAccent} style={{ backgroundColor: item.accent }} />
                <div>
                    <p className={styles.AssetMetricTitle}>{item.title}</p>
                    <p className={styles.AssetMetricValue}>{item.value}</p>
                    {item.info ? <p className={styles.AssetMetricInfo}>{item.info}</p> : null}
                </div>
            </button>
        ))}
    </div>
);

export default GranterHomeAssetMetricGrid;
