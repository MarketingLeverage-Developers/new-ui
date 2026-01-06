import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import React from 'react';
import { Content, Trigger } from './components';

type BasicDropDownProps = {
    children: React.ReactNode;
};

const BasicDropDown = ({ children }: BasicDropDownProps) => <Dropdown>{children}</Dropdown>;

export default BasicDropDown;

BasicDropDown.Trigger = Trigger;
BasicDropDown.Content = Content;
