import React from 'react';
import styles from './Confirm.module.scss';
import BaseButton from '../BaseButton/BaseButton';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import { useModal } from '@/shared/headless/Modal/Modal';
import { FaExclamation } from 'react-icons/fa6';

type ConfirmProps = {
    onCancel: () => void;
    onConfirm: () => void;
    title: React.ReactNode;
    description?: React.ReactNode;
    icon?: string;
};

const Confirm = ({ onCancel, onConfirm, icon, title, description }: ConfirmProps) => {
    const { closeModal } = useModal();

    const handleCancelClick = () => {
        onCancel();
        closeModal();
    };

    const handleConfirmClick = () => {
        onConfirm();
        closeModal();
    };

    return (
        <div className={styles.Confirm}>
            <div className={styles.IconWrapper}>{icon ? <img src="" alt="" /> : <FaExclamation size={32} />}</div>
            <div className={styles.TextWrapper}>
                <p className={styles.Title}>{title}</p>
                <p className={styles.Description}>{description}</p>
            </div>
            <div className={styles.ButtonWrapper}>
                <BaseButton
                    height={48}
                    width={'100%'}
                    textColor={getThemeColor('Gray2')}
                    bgColor={getThemeColor('Gray6')}
                    radius={8}
                    onClick={handleCancelClick}
                >
                    취소
                </BaseButton>
                <BaseButton
                    height={48}
                    width={'100%'}
                    textColor={getThemeColor('White1')}
                    bgColor={getThemeColor('Primary1')}
                    radius={8}
                    onClick={handleConfirmClick}
                >
                    확인
                </BaseButton>
            </div>
        </div>
    );
};

export default Confirm;
