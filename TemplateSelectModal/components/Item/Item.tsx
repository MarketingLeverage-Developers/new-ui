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

    /** 외부에서 열린 상태를 제어 */
    opened: boolean;

    /** 헤더 클릭 시 어떤 item을 열지 부모에게 알림 */
    onOpen: (value: string) => void;
};

export const ItemInner = ({ value, label, children, opened, onOpen }: ItemProps) => {
    const { showAccordion, hideAccordion } = useAccordion();

    const isActive = opened;

    const boxClassName = classNames(styles.Box, { [styles.Active]: isActive });
    const buttonClassName = classNames(styles.Button, { [styles.Active]: isActive });
    const chevronClassName = classNames(styles.Chevron, { [styles.Active]: isActive });

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
                    return true; // 내부 toggle 막고, 외부 opened로만 제어
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
    <P extends object>(WrappedComponent: React.ComponentType<P>): React.FC<P> =>
    (props: P) =>
        (
            <Accordion>
                <WrappedComponent {...(props as any)} />
            </Accordion>
        );

export const Item = withProvider<ItemProps>(ItemInner);
