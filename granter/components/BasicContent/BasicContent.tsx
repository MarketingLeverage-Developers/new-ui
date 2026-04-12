import React from 'react';
import classNames from 'classnames';
import { FiInfo, FiPlus, FiX } from 'react-icons/fi';
import styles from './BasicContent.module.scss';

export type BasicContentProps = {
    children: React.ReactNode;
    className?: string;
};

export type BasicContentHeaderProps = {
    children: React.ReactNode;
    className?: string;
    showBorder?: boolean;
};

export type BasicContentTitleProps = {
    children: React.ReactNode;
    className?: string;
};

export type BasicContentCloseButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> & {
    icon?: React.ReactNode;
};

export type BasicContentBodyProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    bodyRef?: React.Ref<HTMLDivElement>;
};

export type BasicContentHeroProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export type BasicContentHeroMetaProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export type BasicContentHeroFigureProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export type BasicContentHeroIconProps = {
    src: string;
    alt?: string;
    className?: string;
};

export type BasicContentHeroBodyProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export type BasicContentHeroTitleRowProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export type BasicContentHeroTitleProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export type BasicContentHeroValueProps = {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
};

export type BasicContentHeroSuffixProps = {
    children: React.ReactNode;
    className?: string;
};

export type BasicContentAlertTone = 'danger' | 'neutral';

export type BasicContentAlertProps = {
    children: React.ReactNode;
    tone?: BasicContentAlertTone;
    className?: string;
};

export type BasicContentAlertMainProps = {
    children: React.ReactNode;
    className?: string;
};

export type BasicContentAlertTextProps = {
    children: React.ReactNode;
    className?: string;
};

export type BasicContentAlertActionProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    type?: 'button' | 'submit' | 'reset';
};

export type BasicContentListProps = {
    children: React.ReactNode;
    className?: string;
};

export type BasicContentItemProps = {
    children?: React.ReactNode;
    className?: string;
    size?: 'md' | 'lg';
    label?: React.ReactNode;
    required?: boolean;
    labelHint?: React.ReactNode;
    value?: React.ReactNode;
    valueLayout?: 'inline' | 'between';
    valueSide?: React.ReactNode;
    valueSideVariant?: 'plain' | 'button';
    valueSideTone?: 'default' | 'muted' | 'danger';
};

export type BasicContentLabelProps = {
    children: React.ReactNode;
    className?: string;
};

export type BasicContentValueProps = {
    children: React.ReactNode;
    className?: string;
    layout?: 'inline' | 'between';
};

export type BasicContentValueTextProps = {
    children: React.ReactNode;
    className?: string;
};

export type BasicContentValueSideProps = {
    children: React.ReactNode;
    className?: string;
    variant?: 'plain' | 'button';
    tone?: 'default' | 'muted' | 'danger';
};

export type BasicContentFooterProps = {
    children: React.ReactNode;
    className?: string;
};

export type BasicContentHintIconProps = {
    icon?: React.ReactNode;
    className?: string;
};

export type BasicContentInlineMetaProps = {
    children: React.ReactNode;
    className?: string;
};

export type BasicContentAvatarProps = {
    src: string;
    alt?: string;
    className?: string;
};

export type BasicContentDashedButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> & {
    icon?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
};

export type BasicContentSwitchProps = {
    checked?: boolean;
    defaultChecked?: boolean;
    onChange?: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
};

export type BasicContentActionButtonVariant = 'primary' | 'secondary';

export type BasicContentActionButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> & {
    variant?: BasicContentActionButtonVariant;
    type?: 'button' | 'submit' | 'reset';
};

const BasicContentHeader = ({
    children,
    className,
    showBorder = true,
}: BasicContentHeaderProps) => (
    <header className={classNames(styles.Header, className)} data-border={showBorder ? 'true' : 'false'}>
        {children}
    </header>
);

const BasicContentTitle = ({ children, className }: BasicContentTitleProps) => (
    <h2 className={classNames(styles.Title, className)}>{children}</h2>
);

const BasicContentCloseButton = ({
    className,
    icon,
    onClick,
    type = 'button',
    ...props
}: BasicContentCloseButtonProps) => (
    <button type={type} className={classNames(styles.CloseButton, className)} onClick={onClick} {...props}>
        {icon ?? <FiX size={18} />}
    </button>
);

const BasicContentBody = ({ children, className, style, bodyRef }: BasicContentBodyProps) => (
    <div ref={bodyRef} className={classNames(styles.Body, className)} style={style}>
        {children}
    </div>
);

const BasicContentHero = ({ children, className, style }: BasicContentHeroProps) => (
    <div className={classNames(styles.Hero, className)} style={style}>
        {children}
    </div>
);

const BasicContentHeroMeta = ({ children, className, style }: BasicContentHeroMetaProps) => (
    <div className={classNames(styles.HeroMeta, className)} style={style}>
        {children}
    </div>
);

const BasicContentHeroFigure = ({ children, className, style }: BasicContentHeroFigureProps) => (
    <div className={classNames(styles.HeroFigure, className)} style={style}>
        {children}
    </div>
);

const BasicContentHeroIcon = ({ src, alt = '', className }: BasicContentHeroIconProps) => (
    <img src={src} alt={alt} className={classNames(styles.HeroIcon, className)} />
);

const BasicContentHeroBody = ({ children, className, style }: BasicContentHeroBodyProps) => (
    <div className={classNames(styles.HeroBody, className)} style={style}>
        {children}
    </div>
);

const BasicContentHeroTitleRow = ({ children, className, style }: BasicContentHeroTitleRowProps) => (
    <div className={classNames(styles.HeroTitleRow, className)} style={style}>
        {children}
    </div>
);

const BasicContentHeroTitle = ({ children, className, style }: BasicContentHeroTitleProps) => (
    <h3 className={classNames(styles.HeroTitle, className)} style={style}>
        {children}
    </h3>
);

const BasicContentHeroValue = ({ children, className, style }: BasicContentHeroValueProps) => (
    <strong className={classNames(styles.HeroValue, className)} style={style}>
        {children}
    </strong>
);

const BasicContentHeroSuffix = ({ children, className }: BasicContentHeroSuffixProps) => (
    <span className={classNames(styles.HeroSuffix, className)}>{children}</span>
);

const BasicContentAlert = ({ children, tone = 'danger', className }: BasicContentAlertProps) => (
    <div className={classNames(styles.Alert, className)} data-tone={tone}>
        {children}
    </div>
);

const BasicContentAlertMain = ({ children, className }: BasicContentAlertMainProps) => (
    <div className={classNames(styles.AlertMain, className)}>{children}</div>
);

const BasicContentAlertText = ({ children, className }: BasicContentAlertTextProps) => (
    <p className={classNames(styles.AlertText, className)}>{children}</p>
);

const BasicContentAlertAction = ({
    children,
    className,
    type = 'button',
    ...props
}: BasicContentAlertActionProps) => (
    <button type={type} className={classNames(styles.AlertAction, className)} {...props}>
        {children}
    </button>
);

const BasicContentList = ({ children, className }: BasicContentListProps) => (
    <section className={classNames(styles.List, className)}>{children}</section>
);

const BasicContentItem = ({
    children,
    className,
    size = 'md',
    label,
    required = false,
    labelHint,
    value,
    valueLayout = 'inline',
    valueSide,
    valueSideVariant = 'plain',
    valueSideTone = 'default',
}: BasicContentItemProps) => {
    const hasPreset =
        label !== undefined ||
        labelHint !== undefined ||
        value !== undefined ||
        valueSide !== undefined;

    if (!hasPreset) {
        return (
            <div className={classNames(styles.Item, className)} data-size={size}>
                {children}
            </div>
        );
    }

    const computedValue = value ?? children;
    const valueNode =
        typeof computedValue === 'string' || typeof computedValue === 'number' ? (
            <span className={styles.ValueText}>{computedValue}</span>
        ) : (
            computedValue
        );

    return (
        <div className={classNames(styles.Item, className)} data-size={size}>
            <span className={styles.Label}>
                {label}
                {required ? <span className={styles.RequiredMark}>*</span> : null}
                {labelHint !== undefined ? <span className={styles.HintIcon}>{labelHint}</span> : null}
            </span>

            <span className={styles.Value} data-layout={valueLayout}>
                {valueNode}
                {valueSide !== undefined ? (
                    <span className={styles.ValueSide} data-variant={valueSideVariant} data-tone={valueSideTone}>
                        {valueSide}
                    </span>
                ) : null}
            </span>
        </div>
    );
};

const BasicContentLabel = ({ children, className }: BasicContentLabelProps) => (
    <span className={classNames(styles.Label, className)}>{children}</span>
);

const BasicContentValue = ({ children, className, layout = 'inline' }: BasicContentValueProps) => (
    <span className={classNames(styles.Value, className)} data-layout={layout}>
        {children}
    </span>
);

const BasicContentValueText = ({ children, className }: BasicContentValueTextProps) => (
    <span className={classNames(styles.ValueText, className)}>{children}</span>
);

const BasicContentValueSide = ({
    children,
    className,
    variant = 'plain',
    tone = 'default',
}: BasicContentValueSideProps) => (
    <span className={classNames(styles.ValueSide, className)} data-variant={variant} data-tone={tone}>
        {children}
    </span>
);

const BasicContentFooter = ({ children, className }: BasicContentFooterProps) => (
    <footer className={classNames(styles.Footer, className)}>{children}</footer>
);

const BasicContentHintIcon = ({ icon, className }: BasicContentHintIconProps) => (
    <span className={classNames(styles.HintIcon, className)}>{icon ?? <FiInfo size={12} />}</span>
);

const BasicContentInlineMeta = ({ children, className }: BasicContentInlineMetaProps) => (
    <span className={classNames(styles.InlineMeta, className)}>{children}</span>
);

const BasicContentAvatar = ({ src, alt = '', className }: BasicContentAvatarProps) => (
    <img src={src} alt={alt} className={classNames(styles.Avatar, className)} />
);

const BasicContentDashedButton = ({
    className,
    icon,
    onClick,
    type = 'button',
    ...props
}: BasicContentDashedButtonProps) => (
    <button type={type} className={classNames(styles.DashedButton, className)} onClick={onClick} {...props}>
        {icon ?? <FiPlus size={14} />}
    </button>
);

const BasicContentSwitch = ({
    checked,
    defaultChecked = false,
    onChange,
    disabled = false,
    className,
}: BasicContentSwitchProps) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isOn = isControlled ? checked : internalChecked;

    const handleClick = () => {
        if (disabled) return;
        const nextChecked = !isOn;
        if (!isControlled) setInternalChecked(nextChecked);
        onChange?.(nextChecked);
    };

    return (
        <button
            type="button"
            role="switch"
            aria-checked={isOn}
            className={classNames(styles.Switch, className)}
            data-checked={isOn ? 'true' : 'false'}
            onClick={handleClick}
            disabled={disabled}
        >
            <span className={styles.SwitchThumb} />
        </button>
    );
};

const BasicContentActionButton = ({
    children,
    className,
    variant = 'secondary',
    type = 'button',
    ...props
}: BasicContentActionButtonProps) => (
    <button type={type} className={classNames(styles.ActionButton, className)} data-variant={variant} {...props}>
        {children}
    </button>
);

type BasicContentComponent = ((props: BasicContentProps) => React.ReactElement) & {
    Header: typeof BasicContentHeader;
    Title: typeof BasicContentTitle;
    CloseButton: typeof BasicContentCloseButton;
    Body: typeof BasicContentBody;
    Hero: typeof BasicContentHero;
    HeroMeta: typeof BasicContentHeroMeta;
    HeroFigure: typeof BasicContentHeroFigure;
    HeroIcon: typeof BasicContentHeroIcon;
    HeroBody: typeof BasicContentHeroBody;
    HeroTitleRow: typeof BasicContentHeroTitleRow;
    HeroTitle: typeof BasicContentHeroTitle;
    HeroValue: typeof BasicContentHeroValue;
    HeroSuffix: typeof BasicContentHeroSuffix;
    Alert: typeof BasicContentAlert;
    AlertMain: typeof BasicContentAlertMain;
    AlertText: typeof BasicContentAlertText;
    AlertAction: typeof BasicContentAlertAction;
    List: typeof BasicContentList;
    Item: typeof BasicContentItem;
    Label: typeof BasicContentLabel;
    Value: typeof BasicContentValue;
    ValueText: typeof BasicContentValueText;
    ValueSide: typeof BasicContentValueSide;
    Footer: typeof BasicContentFooter;
    HintIcon: typeof BasicContentHintIcon;
    InlineMeta: typeof BasicContentInlineMeta;
    Avatar: typeof BasicContentAvatar;
    DashedButton: typeof BasicContentDashedButton;
    Switch: typeof BasicContentSwitch;
    ActionButton: typeof BasicContentActionButton;
};

const BasicContent = (({ children, className }: BasicContentProps) => (
    <section className={classNames(styles.BasicContent, className)}>{children}</section>
)) as BasicContentComponent;

export default BasicContent;

BasicContent.Header = BasicContentHeader;
BasicContent.Title = BasicContentTitle;
BasicContent.CloseButton = BasicContentCloseButton;
BasicContent.Body = BasicContentBody;
BasicContent.Hero = BasicContentHero;
BasicContent.HeroMeta = BasicContentHeroMeta;
BasicContent.HeroFigure = BasicContentHeroFigure;
BasicContent.HeroIcon = BasicContentHeroIcon;
BasicContent.HeroBody = BasicContentHeroBody;
BasicContent.HeroTitleRow = BasicContentHeroTitleRow;
BasicContent.HeroTitle = BasicContentHeroTitle;
BasicContent.HeroValue = BasicContentHeroValue;
BasicContent.HeroSuffix = BasicContentHeroSuffix;
BasicContent.Alert = BasicContentAlert;
BasicContent.AlertMain = BasicContentAlertMain;
BasicContent.AlertText = BasicContentAlertText;
BasicContent.AlertAction = BasicContentAlertAction;
BasicContent.List = BasicContentList;
BasicContent.Item = BasicContentItem;
BasicContent.Label = BasicContentLabel;
BasicContent.Value = BasicContentValue;
BasicContent.ValueText = BasicContentValueText;
BasicContent.ValueSide = BasicContentValueSide;
BasicContent.Footer = BasicContentFooter;
BasicContent.HintIcon = BasicContentHintIcon;
BasicContent.InlineMeta = BasicContentInlineMeta;
BasicContent.Avatar = BasicContentAvatar;
BasicContent.DashedButton = BasicContentDashedButton;
BasicContent.Switch = BasicContentSwitch;
BasicContent.ActionButton = BasicContentActionButton;
