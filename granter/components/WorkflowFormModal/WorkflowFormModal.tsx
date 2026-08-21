import classNames from 'classnames';
import { FiX } from 'react-icons/fi';
import type { ReactNode } from 'react';
import BasicModal from '../BasicModal/BasicModal';
import styles from './WorkflowFormModal.module.scss';

export type WorkflowFormModalSectionProps = {
    title?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    bodyClassName?: string;
};

export type WorkflowFormModalProps = {
    open: boolean;
    onClose: () => void;
    headerControl?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    closeLabel: string;
    closeDisabled?: boolean;
    width?: string | number;
    height?: string | number;
    maxHeight?: string | number;
    className?: string;
    bodyClassName?: string;
    footerClassName?: string;
};

type WorkflowFormModalComponent = ((props: WorkflowFormModalProps) => React.JSX.Element) & {
    Section: React.FC<WorkflowFormModalSectionProps>;
};

const WorkflowFormModalSection = ({
    title,
    action,
    children,
    className,
    bodyClassName,
}: WorkflowFormModalSectionProps) => (
    <section className={classNames(styles.Section, className)}>
        {title || action ? (
            <header className={styles.SectionHeader}>
                {title ? <h2>{title}</h2> : <span />}
                {action ? <div className={styles.SectionAction}>{action}</div> : null}
            </header>
        ) : null}
        <div className={classNames(styles.SectionBody, bodyClassName)}>{children}</div>
    </section>
);

const WorkflowFormModal = (({
    open,
    onClose,
    headerControl,
    children,
    footer,
    closeLabel,
    closeDisabled = false,
    width = 640,
    height = 'min(850px, calc(100vh - 40px))',
    maxHeight = 'calc(100vh - 40px)',
    className,
    bodyClassName,
    footerClassName,
}: WorkflowFormModalProps) => (
    <BasicModal
        open={open}
        onChange={onClose}
        width={width}
        height={height}
        maxHeight={maxHeight}
        closeOnEsc={!closeDisabled}
        contentClassName={classNames(styles.ModalContent, className)}
        content={(
            <section className={styles.Root}>
                <header className={styles.Header}>
                    <div className={styles.HeaderControl}>{headerControl}</div>
                    <button
                        type="button"
                        className={styles.CloseButton}
                        aria-label={closeLabel}
                        disabled={closeDisabled}
                        onClick={onClose}
                    >
                        <FiX aria-hidden="true" />
                    </button>
                </header>
                <div className={classNames(styles.Body, bodyClassName)}>{children}</div>
                {footer ? (
                    <footer className={classNames(styles.Footer, footerClassName)}>{footer}</footer>
                ) : null}
            </section>
        )}
    />
)) as WorkflowFormModalComponent;

WorkflowFormModal.Section = WorkflowFormModalSection;

export default WorkflowFormModal;
