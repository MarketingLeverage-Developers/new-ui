import React from 'react';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';

export type BaseDropdownProps = React.ComponentProps<typeof Dropdown>;

const BaseDropdown: React.FC<BaseDropdownProps> = ({ children }) => <Dropdown>{children}</Dropdown>;

export default BaseDropdown;
