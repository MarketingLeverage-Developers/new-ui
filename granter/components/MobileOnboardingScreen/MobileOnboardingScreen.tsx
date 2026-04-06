import type { ReactNode, Ref } from 'react';
import classNames from 'classnames';
import { FiChevronLeft } from 'react-icons/fi';
import Text from '../Text/Text';
import styles from './MobileOnboardingScreen.module.scss';

export type MobileOnboardingScreenProps = {
    headerTitle?: ReactNode;
    onBack?: () => void;
    backAriaLabel?: string;
    headerRight?: ReactNode;
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    hero?: ReactNode;
    children?: ReactNode;
    notice?: ReactNode;
    footer?: ReactNode;
    copyAlign?: 'start' | 'center';
    className?: string;
    contentClassName?: string;
    bodyClassName?: string;
    footerClassName?: string;
    contentRef?: Ref<HTMLDivElement>;
};

const MobileOnboardingScreen = ({
    headerTitle,
    onBack,
    backAriaLabel = '뒤로가기',
    headerRight,
    eyebrow,
    title,
    description,
    hero,
    children,
    notice,
    footer,
    copyAlign = 'start',
    className,
    contentClassName,
    bodyClassName,
    footerClassName,
    contentRef,
}: MobileOnboardingScreenProps) => (
    <div
        className={classNames(styles.Root, className)}
        data-has-footer={footer ? 'true' : 'false'}
        data-copy-align={copyAlign}
    >
        <header className={styles.Header}>
            <div className={styles.HeaderSide} data-align="start">
                {onBack ? (
                    <button
                        type="button"
                        className={styles.BackButton}
                        onClick={onBack}
                        aria-label={backAriaLabel}
                    >
                        <FiChevronLeft size={24} />
                    </button>
                ) : (
                    <span className={styles.HeaderSpacer} aria-hidden="true" />
                )}
            </div>

            <div className={styles.HeaderCenter}>
                {headerTitle ? (
                    <Text as="h1" weight="bold" className={styles.HeaderTitle}>
                        {headerTitle}
                    </Text>
                ) : null}
            </div>

            <div className={styles.HeaderSide} data-align="end">
                {headerRight ?? <span className={styles.HeaderSpacer} aria-hidden="true" />}
            </div>
        </header>

        <div ref={contentRef} className={classNames(styles.Content, contentClassName)}>
            <div className={styles.Copy}>
                {eyebrow ? (
                    <Text size="sm" weight="semibold" className={styles.Eyebrow}>
                        {eyebrow}
                    </Text>
                ) : null}

                <Text as="h2" weight="bold" className={styles.Title}>
                    {title}
                </Text>

                {description ? (
                    <Text as="p" size="sm" tone="muted" className={styles.Description}>
                        {description}
                    </Text>
                ) : null}
            </div>

            {hero ? <div className={styles.Hero}>{hero}</div> : null}

            {children ? <div className={classNames(styles.Body, bodyClassName)}>{children}</div> : null}

            {notice ? <div className={styles.Notice}>{notice}</div> : null}
        </div>

        {footer ? (
            <footer className={classNames(styles.Footer, footerClassName)}>
                <div className={styles.FooterInner}>{footer}</div>
            </footer>
        ) : null}
    </div>
);

export default MobileOnboardingScreen;
