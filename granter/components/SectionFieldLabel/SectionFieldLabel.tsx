import type { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './SectionFieldLabel.module.scss';

export type SectionFieldLabelProps = {
    children: ReactNode;
    required?: boolean;
    htmlFor?: string;
    labelId?: string;
    hint?: ReactNode;
    trailingContent?: ReactNode;
    bordered?: boolean;
    className?: string;
};

const SectionFieldLabel = ({
    children,
    required = false,
    htmlFor,
    labelId,
    hint,
    trailingContent,
    bordered = false,
    className,
}: SectionFieldLabelProps) => {
    const content = (
        <>
            <span className={styles.Main}>
                <span id={labelId} className={styles.Text}>
                    {children}
                </span>
                {required ? <span className={styles.RequiredMark}>*</span> : null}
                {hint ? <span className={styles.Hint}>{hint}</span> : null}
            </span>
            {trailingContent ? <span className={styles.TrailingContent}>{trailingContent}</span> : null}
        </>
    );

    if (htmlFor) {
        return (
            <label
                className={classNames(styles.Root, className)}
                data-border={bordered ? 'true' : undefined}
                htmlFor={htmlFor}
            >
                {content}
            </label>
        );
    }

    return (
        <div className={classNames(styles.Root, className)} data-border={bordered ? 'true' : undefined}>
            {content}
        </div>
    );
};

export default SectionFieldLabel;
