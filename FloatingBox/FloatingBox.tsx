import React, { createContext, useContext, useRef, useState } from 'react';
import Trigger from './Trigger/Trigger';
import Content from './Content/Content';

export type FBPosition = 'top' | 'bottom' | 'left' | 'right';

type FloatingBoxContextType = {
    floatingBoxValue: boolean;
    toggleFloatingBox: () => void;
    openFloatingBox: () => void;
    closeFloatingBox: () => void;
    triggerRef: React.RefObject<HTMLElement | null>;
};

const FloatingBoxContext = createContext<FloatingBoxContextType>({
    floatingBoxValue: false,
    toggleFloatingBox: () => {},
    openFloatingBox: () => {},
    closeFloatingBox: () => {},
    triggerRef: { current: null },
});

// 컨트롤드/언컨트롤드 지원
export type FloatingBoxProps = {
    children: React.ReactNode;
};

type FloatingBoxComponent = React.FC<FloatingBoxProps> & {
    Trigger: typeof Trigger;
    Content: typeof Content;
};

const FloatingBox = (({ children }: FloatingBoxProps) => {
    const [floatingBoxValue, setFloatingBoxValue] = useState(false);
    const triggerRef = useRef<HTMLElement>(null);
    const toggleFloatingBox = () => setFloatingBoxValue((v) => !v);
    const openFloatingBox = () => setFloatingBoxValue(true);
    const closeFloatingBox = () => setFloatingBoxValue(false);
    return (
        <FloatingBoxContext.Provider
            value={{
                floatingBoxValue,
                toggleFloatingBox,
                openFloatingBox,
                closeFloatingBox,
                triggerRef,
                // position,
            }}
        >
            {children}
        </FloatingBoxContext.Provider>
    );
}) as FloatingBoxComponent;

export const useFloatingBox = () => useContext(FloatingBoxContext);

export default FloatingBox;

FloatingBox.Content = Content;
FloatingBox.Trigger = Trigger;
