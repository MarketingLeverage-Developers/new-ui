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
    middleContent?: React.ReactNode;
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
    middleContent,
    tone = 'success',
    className,
    summaryClassName,
}: DetailSceneHeaderProps) => (
    <div className={classNames(styles.Root, className)}>
        <div
            className={classNames(styles.Summary, summaryClassName)}
            data-interactive={onBack ? 'true' : 'false'}
            role={onBack ? 'button' : undefined}
            tabIndex={onBack ? 0 : undefined}
            onClick={onBack}
            onKeyDown={
                onBack
                    ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              onBack();
                          }
                      }
                    : undefined
            }
        >
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

            {middleContent ? (
                <>
                    <span className={styles.MiddleDivider} aria-hidden="true" />
                    <div
                        className={styles.MiddleContent}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                    >
                        {middleContent}
                    </div>
                </>
            ) : null}

            {accessory !== null
                ? onBack
                  ? (
                        <button
                            type="button"
                            className={classNames(styles.Accessory, styles.AccessoryButton)}
                            onClick={(event) => {
                                event.stopPropagation();
                                onBack();
                            }}
                            aria-label="상세보기 닫기"
                        >
                            {accessory}
                        </button>
                    )
                  : <span className={styles.Accessory}>{accessory}</span>
                : null}
        </div>
    </div>
);

export default DetailSceneHeader;
