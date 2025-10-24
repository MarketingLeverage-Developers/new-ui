import type React from 'react';
import { createContext, useContext } from 'react';

export type CheckboxGroupContextType = {
    checked: Set<string>;
    setChecked: React.Dispatch<React.SetStateAction<Set<string>>>;
    allIds: Set<string>;
    disabledIds: Set<string>;
    registerId: (id: string, disabled?: boolean) => void;
    unregisterId: (id: string) => void;
};

export const CheckboxGroupCtx = createContext<CheckboxGroupContextType | null>(null);

export const useCheckboxGroup = () => {
    const ctx = useContext(CheckboxGroupCtx);
    if (!ctx) throw new Error('CheckboxGroup components must be used within <CheckboxGroup />');
    return ctx;
};
