import type React from 'react';
import MultiInput, { useMultiInput } from '@/shared/headless/MultiInput/MultiInput';
import Trigger from './components/Trigger/Trigger';
import InputList from './components/InputList/InputList';

// RoundedAddInput용 Context re-export (하위 컴포넌트에서 사용)
export const useRoundedAddInputContext = useMultiInput;

// Root 컴포넌트 Props
type RoundedAddInputProps = {
    children: React.ReactNode;
    value?: string;
    onChange?: (combinedValue: string) => void;
    separator?: string;
    minCount?: number;
    maxCount?: number;
};

type Compound = React.FC<RoundedAddInputProps> & {
    Trigger: typeof Trigger;
    InputList: typeof InputList;
};

const RoundedAddInput: Compound = ({ children, ...props }) => <MultiInput {...props}>{children}</MultiInput>;

RoundedAddInput.Trigger = Trigger;
RoundedAddInput.InputList = InputList;

export default RoundedAddInput;
