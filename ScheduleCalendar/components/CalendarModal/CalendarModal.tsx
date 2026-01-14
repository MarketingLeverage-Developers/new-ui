import Flex from '@/shared/primitives/Flex/Flex';
import Modal from '@/shared/headless/Modal/Modal';
import BaseModalLayout from '@/shared/primitives/BaseModalLayout/BaseModalLayout';
import Form from '@/shared/primitives/Form/Form';
import RoundedInput from '@/shared/primitives/RoundedInput/RoundedInput';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import Text from '@/shared/primitives/Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type Draft = {
    title: string;
    allDay: boolean;
    startDate: Date;
    endDate?: Date;
    category: string;
    badge?: string;
};

type CalendarModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    draft: Draft | null;
    onChangeTitle: (title: string) => void;

    onSubmit: () => void;

    title?: string;
};

export const CalendarModal = ({
    open,
    onOpenChange,
    draft,
    onChangeTitle,
    onSubmit,
    title = '일정등록',
}: CalendarModalProps) => (
    <Modal value={open} onChange={onOpenChange}>
        <Modal.Backdrop />
        <Modal.Content maxHeight={'80%'}>
            <BaseModalLayout padding={32} width={450} height={'100%'}>
                <BaseModalLayout.Header title={title} direction="row" fontSize={15} />
                <BaseModalLayout.Content>
                    <BaseModalLayout.ScrollerWrapper>
                        <Form.Label text="일정등록" marginBottom={40} gap={12}>
                            <RoundedInput
                                value={draft?.title ?? ''}
                                onChange={(e) => onChangeTitle(e.target.value)}
                                wrapperStyle={{
                                    flex: 1,
                                    border: 0,
                                    padding: 0,
                                    fontSize: '24px',
                                    fontWeight: 600,
                                    color: '#A3A3A3',
                                }}
                                placeholder="일정을 입력해주세요."
                            />
                        </Form.Label>

                        <Form.Label text="기간" marginBottom={40} gap={12}>
                            <RoundedInput
                                wrapperStyle={{
                                    flex: 1,
                                    border: 0,
                                    padding: 0,
                                    fontSize: '24px',
                                    fontWeight: 600,
                                    color: '#A3A3A3',
                                }}
                                placeholder="기간을 입력해주세요."
                            />
                        </Form.Label>

                        <Flex justify="end" width={'100%'}>
                            <BaseButton
                                padding={{ x: 14, y: 13 }}
                                radius={8}
                                bgColor={getThemeColor('Primary2')}
                                onClick={onSubmit}
                            >
                                <Text fontSize={15} fontWeight={600} textColor={getThemeColor('Primary1')}>
                                    일정 추가
                                </Text>
                            </BaseButton>
                        </Flex>
                    </BaseModalLayout.ScrollerWrapper>
                </BaseModalLayout.Content>
            </BaseModalLayout>
        </Modal.Content>
    </Modal>
);

export default CalendarModal;
