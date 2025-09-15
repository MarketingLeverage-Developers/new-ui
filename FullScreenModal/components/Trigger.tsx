import Modal from '@/shared/headless/Modal/Modal';
import React from 'react';

type TriggerProps = {
    trigger: React.ReactNode;
};

const Trigger = ({ trigger }: TriggerProps) => <Modal.Trigger>{trigger}</Modal.Trigger>;

export default Trigger;
