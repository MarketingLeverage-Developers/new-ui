import Modal from '@/shared/headless/Modal/Modal';
import React from 'react';

type TriggerProps = {
    children: React.ReactNode;
};

const Trigger = ({ children }: TriggerProps) => <Modal.Trigger>{children}</Modal.Trigger>;

export default Trigger;
