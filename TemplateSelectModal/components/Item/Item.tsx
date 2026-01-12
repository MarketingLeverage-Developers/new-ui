import React, { useEffect } from 'react';
import styles from './Item.module.scss';
import { Accordion, useAccordion } from '@/shared/headless/Accordion/Accordion';
import classNames from 'classnames';
import Text from '@/shared/primitives/Text/Text';
import { FaChevronDown } from 'react-icons/fa';

type ItemProps = {
    value: string;
    label: React.ReactNode;
    children: React.ReactNode;
    opened: boolean;
    onOpen: (value: string) => void;
};

const ItemInner = ({ value, label, children, opened, onOpen }: ItemProps) => {
    const { showAccordion, hideAccordion } = useAccordion();

    const boxClassName = classNames(styles.Box, { [styles.Active]: opened });
    const buttonClassName = classNames(styles.Button, { [styles.Active]: opened });
    const chevronClassName = classNames(styles.Chevron, { [styles.Active]: opened });

    useEffect(() => {
        if (opened) showAccordion();
        else hideAccordion();
    }, [opened, showAccordion, hideAccordion]);

    return (
        <Accordion.Box className={boxClassName}>
            <Accordion.Button
                className={buttonClassName}
                onBeforeToggle={() => {
                    onOpen(value);
                    return true;
                }}
            >
                <Accordion.Visible className={styles.Visible}>
                    <Text fontWeight={600} fontSize={18}>
                        {label}
                    </Text>
                    <FaChevronDown size={12} className={chevronClassName} />
                </Accordion.Visible>
            </Accordion.Button>

            <Accordion.Hidden className={styles.Hidden}>
                <div className={styles.Content}>{children}</div>
            </Accordion.Hidden>
        </Accordion.Box>
    );
};

const withProvider =
    <P extends object>(Wrapped: React.ComponentType<P>): React.FC<P> =>
    (props: P) =>
        (
            <Accordion>
                <Wrapped {...(props as any)} />
            </Accordion>
        );

export const Item = withProvider<ItemProps>(ItemInner);
