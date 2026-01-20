import React, { createContext, useContext } from 'react';

import BaseAccordion, { type BaseAccordionExtraProps } from './components/BaseAccordion/BaseAccordion';
import type { BaseAccordionHeaderProps } from './components/BaseAccordion/components/BaseAccordionHeader/BaseAccordionHeader';
import BaseAccordionHeader from './components/BaseAccordion/components/BaseAccordionHeader/BaseAccordionHeader';
import type { BaseAccordionContentProps } from './components/BaseAccordion/components/BaseAccordionContent/BaseAccordionContent';
import BaseAccordionContent from './components/BaseAccordion/components/BaseAccordionContent/BaseAccordionContent';

import type { Accordion as AccordionHeadless } from '@/shared/headless/Accordion/Accordion';

import type { LabelCommonProps } from '@/shared/primitives/D/components/Label/Label';
import StrongIconLabelAccordion from './components/StrongIconLabelAccordion/StrongIconLabelAccordion';

export type AccordionVariant = 'base' | 'strong-label';

export type AccordionCommonProps = React.ComponentProps<typeof AccordionHeadless>;

export type StrongLabelAccordionExtraProps = {
    icon?: LabelCommonProps['icon'];
    text?: LabelCommonProps['text'];
    direction?: LabelCommonProps['direction'];
    gap?: LabelCommonProps['gap'];
};

export type AccordionProps =
    | ({ variant?: 'base' } & AccordionCommonProps & BaseAccordionExtraProps)
    | ({ variant: 'strong-label' } & AccordionCommonProps & BaseAccordionExtraProps & StrongLabelAccordionExtraProps)
    | AccordionCommonProps;

/** Accordion 내부에서 variant 공유 */
type AccordionVariantContextValue = {
    variant: AccordionVariant;
};

const AccordionVariantContext = createContext<AccordionVariantContextValue | null>(null);

const useAccordionVariant = () => {
    const ctx = useContext(AccordionVariantContext);
    if (!ctx) {
        throw new Error("Accordion.* must be used inside <Accordion variant='...'>");
    }
    return ctx;
};

const AccordionRoot: React.FC<AccordionProps> = (props) => {
    const { variant = 'base' } = props as { variant?: AccordionVariant };

    // ✅ strong-label: "조립"은 StrongIconLabelAccordion에게 위임 (중복 제거)
    if (variant === 'strong-label') {
        const {
            icon,
            text,
            direction = 'row',
            gap = 12,
            children,
            className,
            ...rest
        } = props as AccordionCommonProps & BaseAccordionExtraProps & StrongLabelAccordionExtraProps;

        return (
            <AccordionVariantContext.Provider value={{ variant }}>
                <StrongIconLabelAccordion
                    {...(rest as React.ComponentProps<typeof AccordionHeadless> & BaseAccordionExtraProps)}
                    className={className}
                    icon={icon}
                    text={text ?? ''}
                    direction={direction}
                    gap={gap}
                >
                    {children}
                </StrongIconLabelAccordion>
            </AccordionVariantContext.Provider>
        );
    }

    // ✅ base: 기존처럼 Header/Content를 사용자가 조립
    const { children, ...rest } = props as AccordionCommonProps & BaseAccordionExtraProps;

    return (
        <AccordionVariantContext.Provider value={{ variant: 'base' }}>
            <BaseAccordion {...rest}>{children}</BaseAccordion>
        </AccordionVariantContext.Provider>
    );
};

/** ✅ 사용처에서 Accordion.Header / Accordion.Content 하나로 통일 */
export type AccordionHeaderProps = BaseAccordionHeaderProps;
export type AccordionContentProps = BaseAccordionContentProps;

const AccordionHeader: React.FC<AccordionHeaderProps> = (props) => {
    const { variant } = useAccordionVariant();

    // ✅ strong-label에서는 Header를 쓰면 안 됨 (Root가 이미 다 만듦)
    if (variant === 'strong-label') return null;

    return <BaseAccordionHeader {...props} />;
};

const AccordionContent: React.FC<AccordionContentProps> = (props) => {
    const { variant } = useAccordionVariant();

    // ✅ strong-label에서는 Content를 쓰면 안 됨 (Root가 이미 children으로 렌더)
    if (variant === 'strong-label') return null;

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
