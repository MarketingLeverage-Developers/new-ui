import React from 'react';
import { FaExclamation } from 'react-icons/fa6';
import Button from '../../../Button/Button';
import type { CSSLength } from '../../../../../shared/types';
import type { PaddingSize } from '../../../../../shared/types/css/PaddingSize';
import ModalTemplate from '../ModalTemplate/ModalTemplate';
import styles from './ConfirmTemplate.module.scss';

export type ConfirmTemplateProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    onCancel: () => unknown | Promise<unknown>;
    onConfirm: () => unknown | Promise<unknown>;
    icon?: React.ReactNode;
    cancelText?: string;
    confirmText?: string;
    width?: CSSLength;
    padding?: PaddingSize | number;
    className?: string;
};

const ConfirmTemplate = ({
    title,
    description,
    onCancel,
    onConfirm,
    icon,
    cancelText = '취소',
    confirmText = '확인',
    width = '100%',
    padding = 20,
    className,
}: ConfirmTemplateProps) => {
    const handleCancelClick = () => {
        void onCancel();
    };

    const handleConfirmClick = () => {
        void onConfirm();
    };

    return (
        <ModalTemplate className={className} width={width} padding={padding}>
            <div className={styles.ConfirmTemplate}>
                <div className={styles.IconWrapper}>{icon ?? <FaExclamation size={32} />}</div>

                <div className={styles.TextWrapper}>
                    <p className={styles.Title}>{title}</p>
                    <p className={styles.Description}>{description}</p>
                </div>

                <div className={styles.ButtonWrapper}>
                    <Button
                        variant="base"
                        height={48}
                        textColor="var(--Gray2)"
                        bgColor="var(--Gray6)"
                        radius={8}
                        style={{ flex: '1 1 0', minWidth: 0 }}
                        onClick={handleCancelClick}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant="base"
                        height={48}
                        textColor="var(--White1)"
                        bgColor="var(--Primary1)"
                        radius={8}
                        style={{ flex: '1 1 0', minWidth: 0 }}
                        onClick={handleConfirmClick}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </ModalTemplate>
    );
};

export default ConfirmTemplate;
