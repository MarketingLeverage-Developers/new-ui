import React from 'react';
import classNames from 'classnames';
import { FiChevronRight } from 'react-icons/fi';
import Text from '../Text/Text';
import styles from './DetailSceneHeader.module.scss';

export type DetailSceneHeaderTone = 'neutral' | 'success';

export type DetailSceneHeaderProps = {
    title: React.ReactNode;
    value?: React.ReactNode;
    icon?: React.ReactNode;
    onBack?: () => void;
    accessory?: React.ReactNode;
    tone?: DetailSceneHeaderTone;
    className?: string;
    summaryClassName?: string;
};

const DetailSceneHeader = ({
    title,
    value,
    icon,
    onBack,
    accessory = <FiChevronRight size={18} />,
    tone = 'success',
    className,
    summaryClassName,
}: DetailSceneHeaderProps) => {
    const content = (
        <>
            <div className={styles.SummaryMain}>
                <span className={styles.IconWrap} data-tone={tone}>
                    {icon}
                </span>

                <span className={styles.Copy}>
                    <Text as="span" className={styles.Title}>
                        {title}
                    </Text>
                    {value ? (
                        <Text as="strong" className={styles.Value} weight="bold">
                            {value}
                        </Text>
                    ) : null}
                </span>
            </div>

            <span className={styles.Accessory}>{accessory}</span>
        </>
    );

    return (
        <div className={classNames(styles.Root, className)}>
            {onBack ? (
                <button
                    type="button"
                    className={classNames(styles.Summary, summaryClassName)}
                    data-interactive="true"
                    onClick={onBack}
                    aria-label="상세보기 닫기"
                >
                    {content}
                </button>
            ) : (
                <div className={classNames(styles.Summary, summaryClassName)} data-interactive="false">
                    {content}
                </div>
            )}
        </div>
    );
};

export default DetailSceneHeader;
