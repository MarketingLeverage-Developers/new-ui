import Modal from '@/shared/headless/Modal/Modal';
import React from 'react';
import Content from './Content/Content';
type SideModalProps = React.ComponentProps<typeof Modal>;
const SideModal = ({ ...props }: SideModalProps) => <Modal {...props}>{props.children}</Modal>;

export default SideModal;

SideModal.Content = Content;
