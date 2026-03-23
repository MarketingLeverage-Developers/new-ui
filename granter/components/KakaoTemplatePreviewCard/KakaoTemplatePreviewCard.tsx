import type { ReactNode } from 'react';
import Text from '../Text/Text';
import styles from './KakaoTemplatePreviewCard.module.scss';

const joinClassNames = (...values: Array<string | undefined>) => values.filter(Boolean).join(' ');

export type KakaoTemplatePreviewCardProps = {
    selected?: boolean;
    onClick?: () => void;
    eyebrow?: ReactNode;
    title?: ReactNode;
    subtitle?: ReactNode;
    children: ReactNode;
};

export type KakaoPreviewCardSectionProps = {
    children?: ReactNode;
    className?: string;
};

export type KakaoPreviewCardBubbleBodyProps = KakaoPreviewCardSectionProps & {
    preserveWhitespace?: boolean;
};

export type KakaoPreviewCardInfoIconProps = {
    className?: string;
    variant: 'person' | 'phone';
};

const KakaoPreviewCardPhone = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <div className={joinClassNames(styles.Phone, className)}>{children}</div>
);

const KakaoPreviewCardDay = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <div className={joinClassNames(styles.Day, className)}>{children}</div>
);

const KakaoPreviewCardChannel = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <div className={joinClassNames(styles.Channel, className)}>{children}</div>
);

const KakaoPreviewCardChannelName = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <span className={joinClassNames(styles.ChannelName, className)}>{children}</span>
);

const KakaoPreviewCardAvatar = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <span className={joinClassNames(styles.Avatar, className)}>{children}</span>
);

const KakaoPreviewCardBubbleGroup = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <div className={joinClassNames(styles.BubbleGroup, className)}>{children}</div>
);

const KakaoPreviewCardBadge = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <span className={joinClassNames(styles.Badge, className)}>{children}</span>
);

const KakaoPreviewCardBubble = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <div className={joinClassNames(styles.Bubble, className)}>{children}</div>
);

const KakaoPreviewCardBubbleHeader = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <div className={joinClassNames(styles.BubbleHeader, className)}>{children}</div>
);

const KakaoPreviewCardHeadline = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <p className={joinClassNames(styles.Headline, className)}>{children}</p>
);

const KakaoPreviewCardBubbleBody = ({
    children,
    className,
    preserveWhitespace = false,
}: KakaoPreviewCardBubbleBodyProps) => (
    <div
        className={joinClassNames(styles.BubbleBody, className)}
        data-preserve-whitespace={preserveWhitespace ? 'true' : 'false'}
    >
        {children}
    </div>
);

const KakaoPreviewCardInfoList = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <div className={joinClassNames(styles.InfoList, className)}>{children}</div>
);

const KakaoPreviewCardInfoIcon = ({ className, variant }: KakaoPreviewCardInfoIconProps) => (
    <span
        aria-hidden="true"
        className={joinClassNames(
            styles.InfoIcon,
            variant === 'person' ? styles.InfoIconPerson : styles.InfoIconPhone,
            className
        )}
    />
);

const KakaoPreviewCardInfoRow = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <div className={joinClassNames(styles.InfoRow, className)}>{children}</div>
);

const KakaoPreviewCardTime = ({ children, className }: KakaoPreviewCardSectionProps) => (
    <span className={joinClassNames(styles.Time, className)}>{children}</span>
);

const KakaoTemplatePreviewCardBase = ({
    selected = false,
    onClick,
    eyebrow,
    title,
    subtitle,
    children,
}: KakaoTemplatePreviewCardProps) => {
    const content = (
        <>
            {eyebrow || title || subtitle ? (
                <div className={styles.Header}>
                    {eyebrow ? (
                        <Text as="span" size="xs" weight="semibold" tone="muted" className={styles.Eyebrow}>
                            {eyebrow}
                        </Text>
                    ) : null}
                    {title ? (
                        <Text as="strong" size="sm" weight="semibold" className={styles.Title}>
                            {title}
                        </Text>
                    ) : null}
                    {subtitle ? (
                        <Text as="span" size="xs" tone="muted" className={styles.Subtitle}>
                            {subtitle}
                        </Text>
                    ) : null}
                </div>
            ) : null}
            <div className={styles.Canvas}>{children}</div>
            <span className={styles.Selection} data-visible={selected ? 'true' : 'false'}>
                선택됨
            </span>
        </>
    );

    if (onClick) {
        return (
            <button
                type="button"
                className={styles.Root}
                data-selected={selected ? 'true' : 'false'}
                onClick={onClick}
            >
                {content}
            </button>
        );
    }

    return (
        <div className={styles.Root} data-selected={selected ? 'true' : 'false'}>
            {content}
        </div>
    );
};

const KakaoTemplatePreviewCard = Object.assign(KakaoTemplatePreviewCardBase, {
    Phone: KakaoPreviewCardPhone,
    Day: KakaoPreviewCardDay,
    Channel: KakaoPreviewCardChannel,
    ChannelName: KakaoPreviewCardChannelName,
    Avatar: KakaoPreviewCardAvatar,
    BubbleGroup: KakaoPreviewCardBubbleGroup,
    Badge: KakaoPreviewCardBadge,
    Bubble: KakaoPreviewCardBubble,
    BubbleHeader: KakaoPreviewCardBubbleHeader,
    Headline: KakaoPreviewCardHeadline,
    BubbleBody: KakaoPreviewCardBubbleBody,
    InfoList: KakaoPreviewCardInfoList,
    InfoIcon: KakaoPreviewCardInfoIcon,
    InfoRow: KakaoPreviewCardInfoRow,
    Time: KakaoPreviewCardTime,
});

export type KakaoPreviewCardProps = KakaoTemplatePreviewCardProps;
export type { KakaoPreviewCardBubbleBodyProps, KakaoPreviewCardInfoIconProps };

export default KakaoTemplatePreviewCard;
