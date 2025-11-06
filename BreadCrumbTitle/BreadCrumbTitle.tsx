import React from 'react';
import styles from './BreadCrumbTitle.module.scss';
import { MdNavigateNext } from 'react-icons/md';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

export type BreadCrumbItem = {
    label: string;
    href?: string;
};

type BreadCrumbTitleProps = {
    items: BreadCrumbItem[];
    /** 라우터 링크를 커스텀하고 싶을 때 (예: react-router-dom의 Link 사용) */
    renderLink?: (href: string, label: string, className: string) => React.ReactNode;
};

const BreadCrumbTitle = ({ items, renderLink }: BreadCrumbTitleProps) => {
    if (!items?.length) return null;

    return (
        <div className={(styles.wrap, styles.text)}>
            <div className={styles.list}>
                {items.map((item, idx) => {
                    const isLast = idx === items.length - 1;

                    let content: React.ReactNode = <span className={styles.text}>{item.label}</span>;

                    if (!isLast && item.href) {
                        content = renderLink ? (
                            renderLink(item.href, item.label, styles.link)
                        ) : (
                            <a href={item.href} className={styles.link}>
                                {item.label}
                            </a>
                        );
                    }

                    return (
                        <div key={`${item.label}-${idx}`} className={styles.item}>
                            {content}
                            {!isLast && <MdNavigateNext color={getThemeColor('Gray4')} />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BreadCrumbTitle;
