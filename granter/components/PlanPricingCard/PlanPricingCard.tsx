import React from 'react';
import classNames from 'classnames';
import styles from './PlanPricingCard.module.scss';
import Text from '../Text/Text';
import Button from '../Button/Button';
import Flex from '../Flex/Flex';

export interface PlanPricingCardProps {
    title?: string;
    price?: string;
    chargeText?: string;
    services?: string[];
    buttonText?: string;
    footerText?: string;
    onButtonClick?: () => void;
    className?: string;
}

const PlanPricingCard = ({
    title = 'Basic',
    price = '$14.99',
    chargeText = 'Monthly Charge',
    services = [
        'Free Setup',
        '20 User Connection',
        'Bandwidth Limit 10 GB',
        'Analytics Report',
        'Public API Access',
        'Custom Content Management',
        'Plugins Intregation',
    ],
    buttonText = 'Get Started',
    footerText = 'Start Your 30 Day Free Trial',
    onButtonClick,
    className,
}: PlanPricingCardProps) => (
    <div className={classNames(styles.PlanPricingCard, className)}>
        <div className={styles.bg}>
            <div className={styles.pattern} />
        </div>

        <Flex direction="column" align="center" className={styles.content}>
            {/* Plan Header Info */}
            <Flex direction="column" align="center" className={styles.plan_info}>
                <Text className={styles.title_text}>{title}</Text>
                <Text className={styles.price_text}>{price}</Text>
                <Text size="md" tone="subtle" className={styles.monthly_charge}>{chargeText}</Text>
            </Flex>

            <div className={styles.line} />

            {/* Feature Checklist */}
            <Flex direction="column" align="center" gap={18} className={styles.services}>
                {services.map((service, index) => (
                    <Text key={index} size="md" weight="medium" className={styles.service_item}>
                        {service}
                    </Text>
                ))}
            </Flex>

            {/* Bottom Actions */}
            <Flex direction="column" align="center" gap={32} className={styles.actions} width="100%">
                <Button
                    onClick={onButtonClick}
                    className={styles.button}
                >
                    {buttonText}
                </Button>
                <Text size="sm" weight="bold" className={styles.footer_text}>
                    {footerText}
                </Text>
            </Flex>
        </Flex>
    </div>
);

export default PlanPricingCard;
