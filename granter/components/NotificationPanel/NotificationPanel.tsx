import React from 'react';
import styles from './NotificationPanel.module.scss';

export type NotificationPanelItem = {
    key: string;
    title: string;
    description?: string;
    timeLabel?: string;
    tone?: 'neutral' | 'positive' | 'warning';
};

export type NotificationPanelProps = {
    title?: string;
    items?: NotificationPanelItem[];
    emptyLabel?: string;
};

const NotificationPanel = ({ title = '알림', items = [], emptyLabel = '새로운 알림이 없습니다.' }: NotificationPanelProps) => (
    <div className={styles.NotificationPanel}>
        <header className={styles.Header}>
            <h2 className={styles.Title}>{title}</h2>
        </header>

        <div className={styles.List}>
            {items.length ? (
                items.map((item) => (
                    <article key={item.key} className={styles.Item} data-tone={item.tone ?? 'neutral'}>
                        <strong className={styles.ItemTitle}>{item.title}</strong>
                        {item.description ? <p className={styles.ItemDescription}>{item.description}</p> : null}
                        {item.timeLabel ? <span className={styles.ItemTime}>{item.timeLabel}</span> : null}
                    </article>
                ))
            ) : (
                <p className={styles.Empty}>{emptyLabel}</p>
            )}
        </div>
    </div>
);

export default NotificationPanel;
