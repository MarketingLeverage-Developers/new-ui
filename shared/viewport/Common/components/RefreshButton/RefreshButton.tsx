import BaseButton from '../../../../../BaseButton/BaseButton';
import Flex from '../../../../../Flex/Flex';
import { getThemeColor } from '../../../../utils/css/getThemeColor';
import { MdOutlineRefresh } from 'react-icons/md';
import { useToast } from '../../../../headless/ToastProvider/ToastProvider';

type RefreshButtonProps = {
    totalCount: number;
    onRefresh: () => Promise<{ isSuccess: boolean }>;
};

export const RefreshButton = ({ totalCount, onRefresh }: RefreshButtonProps) => {
    const { addToast } = useToast();

    // 이 버튼에서 문의 목록을 새로고침하는 기능을 하는 코드
    const refreshHandler = async () => {
        try {
            const refetchRes = await onRefresh();

            if (refetchRes.isSuccess) {
                addToast({
                    icon: '✅',
                    message: '목록을 최신화하였습니다.',
                    duration: 2400,
                    dismissible: true,
                });
            } else {
                addToast({
                    icon: '❌',
                    message: '목록 최신화에 실패하였습니다.',
                    duration: 2400,
                    dismissible: true,
                });
            }
        } catch {
            addToast({
                icon: '❌',
                message: '목록 최신화에 실패하였습니다.',
                duration: 2400,
                dismissible: true,
            });
        }
    };
    return (
        <BaseButton
            onClick={refreshHandler}
            padding={{ y: 8, x: 12 }}
            bgColor={getThemeColor('Primary2')}
            textColor={getThemeColor('Primary1')}
            radius={6}
            fontSize={15}
        >
            <Flex align="center" gap={8}>
                {`총 ${totalCount ?? 0}개`} <MdOutlineRefresh size={16} />
            </Flex>
        </BaseButton>
    );
};
