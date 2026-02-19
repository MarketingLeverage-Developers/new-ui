import React from 'react';
import Modal from '../../../../headless/Modal/Modal';
import Portal from '../../../../headless/Portal/Portal';
import RoundedBox from '../../../../../RoundedBox/RoundedBox';
import Confirm from '../../../../../Confirm/Confirm';
import type { Result } from '../../../../types';
import { useToast } from '../../../../headless/ToastProvider/ToastProvider';

type Props<T> = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<Result<T>>;
    toastText?: string;
};

const RestoreConfirmModal = <T,>({ open, onClose, onConfirm, toastText = '내역' }: Props<T>) => {
    const { addToast } = useToast();

    const handleConfirm = async () => {
        const res = await onConfirm();

        if (res.ok) {
            addToast({
                icon: '😊',
                message: `${toastText} 복구가 완료되었습니다.`,
                duration: 1600,
                dismissible: true,
            });
        } else {
            addToast({
                icon: '❌',
                message: `${toastText} 복구에 실패하였습니다.`,
                duration: 2400,
                dismissible: true,
            });
        }

        return res;
    };

    return (
        <Modal value={open} onChange={onClose} enterAction={handleConfirm}>
            <Portal>
                <Modal.Backdrop />
                <Modal.Content>
                    <RoundedBox padding={20} width={320} height="auto">
                        <Confirm
                            onCancel={onClose}
                            onConfirm={handleConfirm}
                            title={
                                <>
                                    이 내역을 <span>복구</span>하시겠습니까?
                                </>
                            }
                            description={<>복구된 내역은 다시 목록에서 확인하실 수 있습니다.</>}
                        />
                    </RoundedBox>
                </Modal.Content>
            </Portal>
        </Modal>
    );
};

export default RestoreConfirmModal;
