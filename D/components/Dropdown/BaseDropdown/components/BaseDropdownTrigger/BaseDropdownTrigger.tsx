import React from 'react';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';

export type BaseDropdownTriggerProps = React.ComponentProps<typeof Dropdown.Trigger>;

const BaseDropdownTrigger: React.FC<BaseDropdownTriggerProps> = ({ ...props }) => <Dropdown.Trigger {...props} />;

export default BaseDropdownTrigger;
