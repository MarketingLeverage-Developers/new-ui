import type { ReactNode, Ref } from 'react';
import classNames from 'classnames';
import styles from './ActionModalContent.module.scss';

export type ActionModalContentProps = {
    title: ReactNode;
    description?: ReactNode;
    children?: ReactNode;
    footerHint?: ReactNode;
    actions?: ReactNode;
    scrollHint?: ReactNode;
    closeText?: ReactNode;
    onClose?: () => void;
    className?: string;
    bodyRef?: Ref<HTMLDivElement>;
    bodyClassName?: string;
    footerClassName?: string;
    actionsClassName?: string;
};

const ActionModalContent = ({
    title,
    description,
    children,
    footerHint,
    actions,
    scrollHint,
    closeText = '닫기',
    onClose,
    className,
    bodyRef,
    bodyClassName,
    footerClassName,
    actionsClassName,
}: ActionModalContentProps) => (
    <div className={classNames(styles.Root, className)}>
        <div className={styles.Header}>
            <div className={styles.HeaderCopy}>
                <h2 className={styles.Title}>{title}</h2>
                {description ? <p className={styles.Description}>{description}</p> : null}
            </div>
            {onClose ? (
                <button type="button" className={styles.CloseButton} onClick={onClose}>
                    {closeText}
                </button>
            ) : null}
        </div>

        {children ? (
            <div ref={bodyRef} className={classNames(styles.Body, bodyClassName)}>
                {children}
            </div>
        ) : null}
        {scrollHint}

        {footerHint || actions ? (
            <div className={classNames(styles.Footer, footerClassName)}>
                <div className={styles.FooterHint}>{footerHint}</div>
                {actions ? <div className={classNames(styles.Actions, actionsClassName)}>{actions}</div> : null}
            </div>
        ) : null}
    </div>
);

export default ActionModalContent;
