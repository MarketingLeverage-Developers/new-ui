import Modal from '../../../shared/headless/Modal/Modal';
import Portal from '../../../shared/headless/Portal/Portal';
import RoundedBox from '../../../RoundedBox/RoundedBox';
import Confirm from '../../../Confirm/Confirm';
import { useToast } from '../../../shared/headless/ToastProvider/ToastProvider';
import type { Result } from '../../../shared/types';

type Props<T> = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => Promise<Result<T>>;
    onCancelConfirm?: () => Promise<Result<T>>;
    toastText?: string;
    showToast?: boolean;
    boldText?: string;
    descriptionText?: string;
    subDescriptionText?: string;
};

export const ConfirmModal = <T,>({
    open,
    onClose,
    onConfirm,
    onCancelConfirm,
    toastText = '내역',
    showToast = true,
    boldText = '확인',
    descriptionText = '이 내역을',
    subDescriptionText,
}: Props<T>) => {
    const { addToast } = useToast();

    const showResultToast = (res: Result<T>) => {
        if (!showToast) return;

        if (res.ok) {
            addToast({
                icon: '😊',
                message: `${toastText} 가 완료되었습니다.`,
                duration: 1600,
                dismissible: true,
            });
            return;
        }

        addToast({
            icon: '❌',
            message: `${toastText} 에 실패하였습니다.`,
            duration: 2400,
            dismissible: true,
        });
    };

    const handleConfirm = async () => {
        const res = await onConfirm();
        showResultToast(res);
        return res;
    };

    const handleCancel = () => {
        if (!onCancelConfirm) {
            onClose();
            return;
        }

        void onCancelConfirm()
            .then((res) => {
                showResultToast(res);
            })
            .catch(() => {
                if (!showToast) return;
                addToast({
                    icon: '❌',
                    message: `${toastText} 에 실패하였습니다.`,
                    duration: 2400,
                    dismissible: true,
                });
            });

        onClose();
    };

    return (
        <Modal value={open} onChange={onClose} enterAction={handleConfirm}>
            <Portal>
                <Modal.Backdrop />
                <Modal.Content>
                    <RoundedBox padding={20} width={320} height="auto">
                        <Confirm
                            onCancel={handleCancel}
                            onConfirm={handleConfirm}
                            title={
                                <>
                                    {descriptionText} <span>{boldText}</span>하시겠습니까?
                                </>
                            }
                            description={ subDescriptionText ? <>{subDescriptionText}</> : <></>}
                        />
                    </RoundedBox>
                </Modal.Content>
            </Portal>
        </Modal>
    );
};
