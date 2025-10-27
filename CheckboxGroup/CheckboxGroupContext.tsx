import { createContext, useContext } from 'react';

export type CheckboxGroupContextType = {
    // 선택 상태
    checked: Set<string>;
    setChecked: React.Dispatch<React.SetStateAction<Set<string>>>;
    // 카테고리별 레지스트리
    categories: Map<string, Set<string>>;
    registerItem: (category: string, id: string) => void;
    unregisterItem: (category: string, id: string) => void;
    // Category 안에서만 세팅되는 현재 카테고리 키
    currentCategory?: string;
};

export const CheckboxGroupCtx = createContext<CheckboxGroupContextType | null>(null);

export const useCheckboxGroup = () => {
    const ctx = useContext(CheckboxGroupCtx);
    if (!ctx) throw new Error('CheckboxGroup components must be used within <CheckboxGroup />');
    return ctx;
};
