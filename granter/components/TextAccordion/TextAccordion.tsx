import React from 'react';
import { Accordion } from '../../../shared/headless/Accordion/Accordion';
import LightButton from '../Button/LightButton';
import Text from '../Text/Text';
import styles from './TextAccordion.module.scss';

const noop = () => undefined;

export type TextAccordionProps = {
    title: string;
    countLabel: string;
    children: React.ReactNode;
    viewAllLabel?: string;
    onViewAllClick?: () => void;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (next: boolean) => void;
};

const TextAccordion = ({
    title,
    countLabel,
    children,
    viewAllLabel = '전체내역',
    onViewAllClick = noop,
    defaultOpen = true,
    open,
    onOpenChange,
}: TextAccordionProps) => {
    const isControlled = typeof open === 'boolean';
    const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
    const accordionOpen = isControlled ? (open as boolean) : internalOpen;

    const handleOpenChange = (next: boolean) => {
        if (!isControlled) {
            setInternalOpen(next);
        }
        onOpenChange?.(next);
    };

    return (
        <Accordion value={accordionOpen} onValueChange={handleOpenChange}>
            <section className={styles.TextAccordion} data-open={accordionOpen ? 'true' : 'false'}>
                <div className={styles.Header}>
                    <Accordion.Button className={styles.TitleButton}>
                        <h3 className={styles.Title}>
                            <Text as="span" className={styles.TitleText}>
                                {title}
                            </Text>
                            <Text as="span" className={styles.TitleCount}>
                                {countLabel}
                            </Text>
                        </h3>
                    </Accordion.Button>

                    <LightButton size="sm" className={styles.ViewAllButton} onClick={onViewAllClick}>
                        {viewAllLabel}
                    </LightButton>
                </div>

                <Accordion.Hidden className={styles.Content} transitionMs={220}>
                    <div className={styles.Grid}>{children}</div>
                </Accordion.Hidden>
            </section>
        </Accordion>
    );
};

export default TextAccordion;
