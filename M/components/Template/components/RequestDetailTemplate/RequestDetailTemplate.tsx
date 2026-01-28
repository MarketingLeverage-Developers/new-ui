import React from 'react';
import styles from './RequestDetailTemplate.module.scss';

export type RequestDetailTemplateProps = {
    summary?: React.ReactNode;
    header?: React.ReactNode;
    list?: React.ReactNode;
    className?: string;
};

const RequestDetailTemplate = ({ summary, header, list, className }: RequestDetailTemplateProps) => (
    <div className={[styles.RequestDetailTemplate, className].filter(Boolean).join(' ')}>
        {summary ? <div className={styles.Summary}>{summary}</div> : null}
        {header ? <div className={styles.Header}>{header}</div> : null}
        {list ? <div className={styles.List}>{list}</div> : null}
    </div>
);

export default RequestDetailTemplate;
