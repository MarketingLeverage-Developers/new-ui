import React from 'react';
import Flex from '../../Flex/Flex';
import { IoIosArrowBack } from 'react-icons/io';
import { useModal } from '@/shared/headless/Modal/Modal';

const Close = () => {
    const { closeModal } = useModal();
    const handleCloseClick = () => closeModal();
    return (
        <Flex padding={12}>
            <IoIosArrowBack size={20} onClick={handleCloseClick} />
        </Flex>
    );
};

export default Close;
