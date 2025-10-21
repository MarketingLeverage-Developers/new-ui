import React, { type MouseEventHandler } from 'react';
import { useFloatingBox } from '../FloatingBox';

type TriggerProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
};

const Trigger = ({ children, ...props }: TriggerProps) => {
    const { triggerRef, toggleFloatingBox } = useFloatingBox();
    const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
        props.onClick?.(e);
        toggleFloatingBox();
    };

    // 기본: 래퍼
    return (
        <div
            {...props}
            ref={triggerRef as React.RefObject<HTMLDivElement>}
            onClick={handleClick}
            style={{ display: 'inline-block', cursor: 'pointer' }}
        >
            {children}
        </div>
    );
};

export default Trigger;
