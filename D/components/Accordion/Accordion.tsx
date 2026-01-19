import React, { createContext, useContext } from 'react';

import BaseAccordion, { type BaseAccordionExtraProps } from './components/BaseAccordion/BaseAccordion';
import type { BaseAccordionHeaderProps } from './components/BaseAccordion/components/BaseAccordionHeader/BaseAccordionHeader';
import BaseAccordionHeader from './components/BaseAccordion/components/BaseAccordionHeader/BaseAccordionHeader';
import type { BaseAccordionContentProps } from './components/BaseAccordion/components/BaseAccordionContent/BaseAccordionContent';
import BaseAccordionContent from './components/BaseAccordion/components/BaseAccordionContent/BaseAccordionContent';

import type { Accordion as AccordionHeadless } from '@/shared/headless/Accordion/Accordion';

export type AccordionVariant = 'base';

export type AccordionCommonProps = React.ComponentProps<typeof AccordionHeadless>;

export type AccordionProps =
    | ({ variant?: 'base' } & AccordionCommonProps & BaseAccordionExtraProps)
    | AccordionCommonProps;

/** Accordion 내부에서 variant 공유 */
type AccordionVariantContextValue = {
    variant: AccordionVariant;
};

const AccordionVariantContext = createContext<AccordionVariantContextValue | null>(null);

const useAccordionVariant = () => {
    const ctx = useContext(AccordionVariantContext);
    if (!ctx) {
        throw new Error("Accordion.* must be used inside <Accordion variant='base'>");
    }
    return ctx;
};

const AccordionRoot: React.FC<AccordionProps> = (props) => {
    const { variant = 'base', ...rest } = props as { variant?: AccordionVariant } & AccordionCommonProps &
        BaseAccordionExtraProps;

    if (variant === 'base') {
        return (
            <AccordionVariantContext.Provider value={{ variant }}>
                <BaseAccordion {...(rest as AccordionCommonProps & BaseAccordionExtraProps)} />
            </AccordionVariantContext.Provider>
        );
    }

    return (
        <AccordionVariantContext.Provider value={{ variant: 'base' }}>
            <BaseAccordion {...(rest as AccordionCommonProps & BaseAccordionExtraProps)} />
        </AccordionVariantContext.Provider>
    );
};

/** ✅ 사용처에서 Accordion.Header / Accordion.Content 하나로 통일 */
export type AccordionHeaderProps = BaseAccordionHeaderProps;
export type AccordionContentProps = BaseAccordionContentProps;

const AccordionHeader: React.FC<AccordionHeaderProps> = (props) => {
    const { variant } = useAccordionVariant();

    if (variant === 'base') return <BaseAccordionHeader {...props} />;

    return <BaseAccordionHeader {...props} />;
};

const AccordionContent: React.FC<AccordionContentProps> = (props) => {
    const { variant } = useAccordionVariant();

    if (variant === 'base') return <BaseAccordionContent {...props} />;

    return <BaseAccordionContent {...props} />;
};

type AccordionCompound = React.FC<AccordionProps> & {
    Header: React.FC<AccordionHeaderProps>;
    Content: React.FC<AccordionContentProps>;
};

const Accordion = Object.assign(AccordionRoot, {
    Header: AccordionHeader,
    Content: AccordionContent,
}) as AccordionCompound;

export default Accordion;
