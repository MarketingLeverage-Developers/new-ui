import React from 'react';
import { Content, Trigger } from './components';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';

type RoundedDropDownProps = {
    children: React.ReactNode;
};
const RoundedDropDown = ({ children }: RoundedDropDownProps) => <Dropdown>{children}</Dropdown>;

export default RoundedDropDown;

RoundedDropDown.Trigger = Trigger;
RoundedDropDown.Content = Content;
