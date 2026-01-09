import React from 'react';
import TemplateSelectModal from '../../TemplateSelectModal';

export const Template = () => {
    const test = '';
    const [open, setOpen] = React.useState<string>('group-1');
    return (
        <TemplateSelectModal>
            <TemplateSelectModal.Trigger imageUrl="" onDeleteClick={() => {}} />
            <TemplateSelectModal.TopPortal active>
                <TemplateSelectModal.Layout noBorder header={'템플릿 선택'}>
                    <TemplateSelectModal.Item
                        value="group-1"
                        label="카테고리 1"
                        opened={open === 'group-1'}
                        onOpen={(v) => setOpen((prev) => (prev === v ? '' : v))}
                    >
                        <div>안에 카드/이미지 리스트</div>
                    </TemplateSelectModal.Item>
                </TemplateSelectModal.Layout>
            </TemplateSelectModal.TopPortal>
        </TemplateSelectModal>
    );
};
