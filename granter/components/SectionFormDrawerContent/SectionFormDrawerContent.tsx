import React from 'react';
import classNames from 'classnames';
import BasicContent from '../BasicContent/BasicContent';
import SectionIntro from '../SectionIntro/SectionIntro';
import styles from './SectionFormDrawerContent.module.scss';

export type SectionFormDrawerContentProps = {
    title: React.ReactNode;
    onClose: () => void;
    onConfirm: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
    introEyebrow?: React.ReactNode;
    introTitle?: React.ReactNode;
    introDescription?: React.ReactNode;
    introTitleAs?: React.ElementType;
    onCancel?: React.MouseEventHandler<HTMLButtonElement>;
    cancelLabel?: React.ReactNode;
    confirmLabel?: React.ReactNode;
    confirmDisabled?: boolean;
    bodyClassName?: string;
    introClassName?: string;
    sectionStackClassName?: string;
    headerShowBorder?: boolean;
    footer?: React.ReactNode | null;
};

const SectionFormDrawerContent = ({
    title,
    onClose,
    onConfirm,
    children,
    introEyebrow,
    introTitle,
    introDescription,
    introTitleAs = 'h3',
    onCancel,
    cancelLabel = '취소',
    confirmLabel = '저장',
    confirmDisabled = false,
    bodyClassName,
    introClassName,
    sectionStackClassName,
    headerShowBorder = true,
    footer,
}: SectionFormDrawerContentProps) => (
    <BasicContent>
        <BasicContent.Header showBorder={headerShowBorder}>
            <BasicContent.Title>{title}</BasicContent.Title>
            <BasicContent.CloseButton onClick={onClose} />
        </BasicContent.Header>

        <BasicContent.Body className={classNames(styles.Body, bodyClassName)}>
            {introTitle ? (
                <div className={classNames(styles.Intro, introClassName)}>
                    <SectionIntro
                        eyebrow={introEyebrow}
                        title={introTitle}
                        description={introDescription}
                        titleAs={introTitleAs}
                    />
                </div>
            ) : null}

            <div className={classNames(styles.SectionStack, sectionStackClassName)}>
                {children}
            </div>
        </BasicContent.Body>

        {footer === null ? null : footer ?? (
            <BasicContent.Footer>
                <BasicContent.ActionButton variant="secondary" onClick={onCancel ?? onClose}>
                    {cancelLabel}
                </BasicContent.ActionButton>
                <BasicContent.ActionButton variant="primary" onClick={onConfirm} disabled={confirmDisabled}>
                    {confirmLabel}
                </BasicContent.ActionButton>
            </BasicContent.Footer>
        )}
    </BasicContent>
);

export default SectionFormDrawerContent;
