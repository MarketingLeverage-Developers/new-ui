import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import React from 'react';

type ContentProps = React.ComponentProps<typeof Dropdown.Content>;

export const Content = ({ ...props }: ContentProps) => <Dropdown.Content {...props} />;
