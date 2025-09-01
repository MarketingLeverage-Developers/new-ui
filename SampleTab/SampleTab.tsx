import Select from '@/shared/headless/Select/Select';
import React from 'react';
import { Item } from './components';

type SampleTabProps = React.ComponentProps<typeof Select>;

const SampleTab = ({ children }: SampleTabProps) => <Select>{children}</Select>;

export default SampleTab;

SampleTab.Item = Item;
