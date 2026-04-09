import React from 'react';
import classNames from 'classnames';
import SectionFieldVisualSelect, {
    type SectionFieldVisualSelectProps,
} from '../SectionFieldVisualSelect/SectionFieldVisualSelect';
import styles from './SectionFieldVisualSelectPair.module.scss';

const DEFAULT_EMPTY_BADGE_STYLE = {
    minHeight: 34,
    padding: '0 14px',
    fontSize: 14,
    fontWeight: 500,
    lineHeight: '18px',
} satisfies React.CSSProperties;

export type SectionFieldVisualSelectPairProps<
    TStart extends string = string,
    TEnd extends string = string,
> = {
    startProps: SectionFieldVisualSelectProps<TStart>;
    endProps: SectionFieldVisualSelectProps<TEnd>;
    className?: string;
    startClassName?: string;
    endClassName?: string;
    divider?: boolean;
};

const SectionFieldVisualSelectPair = <TStart extends string = string, TEnd extends string = string>({
    startProps,
    endProps,
    className,
    startClassName,
    endClassName,
    divider = true,
}: SectionFieldVisualSelectPairProps<TStart, TEnd>) => {
    const resolvedStartProps = {
        ...startProps,
        emptyBadgeStyle: startProps.emptyBadgeStyle ?? DEFAULT_EMPTY_BADGE_STYLE,
    };
    const resolvedEndProps = {
        ...endProps,
        emptyBadgeStyle: endProps.emptyBadgeStyle ?? DEFAULT_EMPTY_BADGE_STYLE,
    };

    return (
        <div className={classNames(styles.Root, className)}>
            <div className={classNames(styles.Item, startClassName)}>
                <SectionFieldVisualSelect {...resolvedStartProps} />
            </div>
            {divider ? <span className={styles.Divider} aria-hidden="true" /> : null}
            <div className={classNames(styles.Item, endClassName)}>
                <SectionFieldVisualSelect {...resolvedEndProps} />
            </div>
        </div>
    );
};

export default SectionFieldVisualSelectPair;
