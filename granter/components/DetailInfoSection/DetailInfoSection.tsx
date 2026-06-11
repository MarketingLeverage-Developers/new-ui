import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './DetailInfoSection.module.scss';

export type DetailInfoSectionTone =
    | 'blue'
    | 'sky'
    | 'violet'
    | 'amber'
    | 'orange'
    | 'emerald'
    | 'indigo'
    | 'rose'
    | 'pink'
    | 'cyan';

export type DetailInfoSectionProps = Omit<React.HTMLAttributes<HTMLElement>, 'title'> & {
    icon: React.ReactNode;
    title: React.ReactNode;
    children: React.ReactNode;
    actions?: React.ReactNode;
    tone?: DetailInfoSectionTone;
    columns?: 1 | 2;
    className?: string;
    boxClassName?: string;
    contentClassName?: string;
};

const getAutoTone = (title: React.ReactNode): DetailInfoSectionTone => {
    const text = typeof title === 'string' ? title : '';

    if (text.includes('요청자')) return 'sky';
    if (text.includes('업무자') || text.includes('디자이너')) return 'violet';
    if (text.includes('점수') || text.includes('평가') || text.includes('성과')) return 'amber';
    if (text.includes('일정') || text.includes('기간')) return 'emerald';
    if (text.includes('산출물') || text.includes('작업물') || text.includes('등록')) return 'indigo';
    if (text.includes('수정')) return 'orange';
    if (text.includes('반려')) return 'rose';
    if (text.includes('항목') || text.includes('소재')) return 'pink';
    if (text.includes('개발')) return 'cyan';

    return 'blue';
};

const DetailInfoSection = ({
    icon,
    title,
    children,
    actions,
    tone,
    columns = 1,
    className,
    boxClassName,
    contentClassName,
    ...props
}: DetailInfoSectionProps) => (
    <section className={classNames(styles.Root, className)} {...props}>
        <div className={classNames(styles.Box, boxClassName)} data-columns={columns}>
            <div className={styles.Header}>
                <div className={styles.Title}>
                    <span className={styles.IconBox} data-tone={tone ?? getAutoTone(title)}>
                        {icon}
                    </span>
                    <Text size="lg" weight="medium">
                        {title}
                    </Text>
                </div>
                {actions ? <div className={styles.Actions}>{actions}</div> : null}
            </div>
            {contentClassName ? <div className={contentClassName}>{children}</div> : children}
        </div>
    </section>
);

export default DetailInfoSection;
