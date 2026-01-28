import React, { createContext, useContext } from 'react';

import BaseDropdown, { type BaseDropdownProps } from './BaseDropdown/BaseDropdown';
import BaseDropdownTrigger, {
    type BaseDropdownTriggerProps,
} from './BaseDropdown/components/BaseDropdownTrigger/BaseDropdownTrigger';
import BaseDropdownDisplay, {
    type BaseDropdownDisplayProps,
} from './BaseDropdown/components/BaseDropdownDisplay/BaseDropdownDisplay';
import BaseDropdownContent, {
    type BaseDropdownContentProps,
} from './BaseDropdown/components/BaseDropdownContent/BaseDropdownContent';

export type DropdownVariant = 'base';

export type DropdownProps = { variant?: DropdownVariant } & BaseDropdownProps;

type DropdownVariantContextValue = {
    variant: DropdownVariant;
};

const DropdownVariantContext = createContext<DropdownVariantContextValue | null>(null);

const useDropdownVariant = () => {
    const ctx = useContext(DropdownVariantContext);
    if (!ctx) {
        throw new Error("Dropdown.* must be used inside <Dropdown variant='base' ...>");
    }
    return ctx;
};

export type DropdownTriggerProps = BaseDropdownTriggerProps;
export type DropdownDisplayProps = BaseDropdownDisplayProps;
export type DropdownContentProps = BaseDropdownContentProps;

type DropdownCompound = React.FC<DropdownProps> & {
    Trigger: React.FC<DropdownTriggerProps>;
    Display: React.FC<DropdownDisplayProps>;
    Content: React.FC<DropdownContentProps>;
};

const DropdownRoot: React.FC<DropdownProps> = (props) => {
    const { variant = 'base', ...rest } = props;

    return (
        <DropdownVariantContext.Provider value={{ variant }}>
            {variant === 'base' ? <BaseDropdown {...(rest as BaseDropdownProps)} /> : null}
        </DropdownVariantContext.Provider>
    );
};

const DropdownTrigger: React.FC<DropdownTriggerProps> = (props) => {
    const { variant } = useDropdownVariant();

    if (variant === 'base') return <BaseDropdownTrigger {...(props as BaseDropdownTriggerProps)} />;

    return null;
};

const DropdownDisplay: React.FC<DropdownDisplayProps> = (props) => {
    const { variant } = useDropdownVariant();

    if (variant === 'base') return <BaseDropdownDisplay {...(props as BaseDropdownDisplayProps)} />;

    return null;
};

const DropdownContent: React.FC<DropdownContentProps> = (props) => {
    const { variant } = useDropdownVariant();

    if (variant === 'base') return <BaseDropdownContent {...(props as BaseDropdownContentProps)} />;

    return null;
};

const Dropdown = Object.assign(DropdownRoot, {
    Trigger: DropdownTrigger,
    Display: DropdownDisplay,
    Content: DropdownContent,
}) as DropdownCompound;

export default Dropdown;
