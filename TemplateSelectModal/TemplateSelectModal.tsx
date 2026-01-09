import Modal from '@/shared/headless/Modal/Modal';
import React from 'react';
import { Content, Trigger, Layout, Template, Item, TopPortal } from './components/intdex';

type TemplateSelectModalProps = {
    children: React.ReactNode;
    value?: boolean;
    onChange?: (val: boolean) => void;
};

const TemplateSelectModal = ({ children, value, onChange }: TemplateSelectModalProps) => (
    <Modal value={value} onChange={onChange}>
        {children}
    </Modal>
);

export default TemplateSelectModal;

TemplateSelectModal.Trigger = Trigger;
TemplateSelectModal.Content = Content;
TemplateSelectModal.Item = Item;
TemplateSelectModal.Layout = Layout;
TemplateSelectModal.TopPortal = TopPortal;
TemplateSelectModal.Template = Template;
