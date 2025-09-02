import Select from '@/shared/headless/Select/Select';
import React from 'react';
import { Item } from './components';
import Flex from '../Flex/Flex';

type ButtonTabProps = React.ComponentProps<typeof Select>;

const ButtonTab = ({ ...props }: ButtonTabProps) => (
    <Select {...props}>
        <Flex gap={8}>{props.children}</Flex>
    </Select>
);

export default ButtonTab;

ButtonTab.Item = Item;
