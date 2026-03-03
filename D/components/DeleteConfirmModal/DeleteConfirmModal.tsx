import Modal from '../../../shared/headless/Modal/Modal';
import Portal from '../../../shared/headless/Portal/Portal';
import RoundedBox from '../../../RoundedBox/RoundedBox';
import Confirm from '../../../Confirm/Confirm';
import { useToast } from '@/shared/headless/ToastProvider/ToastProvider';
import type { Result } from '@/shared/types';

type Props<T> = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<Result<T>>;
    toastText?: string;
    zIndex?: number;
};

export const DeleteConfirmModal = <T,>({ open, onClose, onConfirm, toastText = '내역', zIndex }: Props<T>) => {
    const { addToast } = useToast();
    const zIndexOffset = zIndex ?? 0;

    const handleConfirm = async () => {
        const res = await onConfirm();

        if (res.ok) {
            addToast({
                icon: '😊',
                message: `${toastText} 삭제가 완료되었습니다.`,
                duration: 1600,
                dismissible: true,
            });
        } else {
            addToast({
                icon: '❌',
                message: `${toastText} 삭제에 실패하였습니다.`,
                duration: 2400,
                dismissible: true,
            });
        }

        return res;
    };

    return (
        <Modal value={open} onChange={onClose} enterAction={handleConfirm}>
            <Portal>
                <Modal.Backdrop style={{ zIndex: 999 + zIndexOffset }} />
                <Modal.Content style={{ zIndex: 1000 + zIndexOffset }}>
                    <RoundedBox padding={20} width={320} height="auto">
                        <Confirm
                            onCancel={onClose}
                            onConfirm={handleConfirm}
                            title={
                                <>
                                    이 내역을 <span>삭제</span>하시겠습니까?
                                </>
                            }
                            description={<>삭제한 내역은 휴지통에서 확인하실 수 있습니다.</>}
                        />
                    </RoundedBox>
                </Modal.Content>
            </Portal>
        </Modal>
    );
};
