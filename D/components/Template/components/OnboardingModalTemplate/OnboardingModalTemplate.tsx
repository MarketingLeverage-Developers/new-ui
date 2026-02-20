import React from 'react';
import classNames from 'classnames';
import { FiArrowLeft, FiArrowRight, FiEye } from 'react-icons/fi';
import type { CSSLength } from '../../../../../shared/types';
import Button from '../../../Button/Button';
import styles from './OnboardingModalTemplate.module.scss';

export type OnboardingModalGuide<GuideId extends string = string> = {
    id: GuideId;
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
};

export type OnboardingModalTemplateProps<GuideId extends string = string> = {
    className?: string;
    width?: CSSLength;
    height?: CSSLength;
    title: React.ReactNode;
    description?: React.ReactNode;
    onClose: () => void;
    onBack?: () => void;
    guides: OnboardingModalGuide<GuideId>[];
    onSelectGuide: (guideId: GuideId) => void;
    footerText?: React.ReactNode;
    closeText?: React.ReactNode;
    backText?: React.ReactNode;
    startText?: React.ReactNode;
};

const OnboardingModalTemplate = <GuideId extends string = string,>(
    props: OnboardingModalTemplateProps<GuideId>
) => {
    const {
        className,
        width,
        height,
        title,
        description,
        onClose,
        onBack,
        guides,
        onSelectGuide,
        footerText = '기능이 끝나면 스텝이 자동 진행되고 안내 모달이 다시 열려요.',
        closeText = '닫기',
        backText = '뒤로가기',
        startText = '시작하기',
    } = props;

    return (
        <div
            className={classNames(styles.OnboardingModalTemplate, className)}
            style={{
                width,
                height,
                paddingBottom: 16,
                borderRadius: 16,
                background: 'var(--White1)',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    padding: '20px 22px',
                    borderBottom: '1px solid var(--Gray6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--Gray1)' }}>{title}</div>
                    {description ? (
                        <div style={{ marginTop: 4, fontSize: 13, color: 'var(--Gray2)' }}>{description}</div>
                    ) : null}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {onBack ? (
                        <button
                            type="button"
                            onClick={onBack}
                            style={{
                                border: '1px solid var(--Gray6)',
                                background: 'var(--White1)',
                                borderRadius: 8,
                                height: 32,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '0 10px',
                                cursor: 'pointer',
                                color: 'var(--Gray2)',
                                fontSize: 12,
                            }}
                        >
                            <FiArrowLeft size={14} />
                            <span>{backText}</span>
                        </button>
                    ) : null}
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            color: 'var(--Gray2)',
                        }}
                        aria-label="닫기"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {guides.map((guide) => (
                    <button
                        type="button"
                        key={guide.id}
                        onClick={() => onSelectGuide(guide.id)}
                        style={{
                            textAlign: 'left',
                            border: '1px solid var(--Gray6)',
                            borderRadius: 12,
                            padding: 16,
                            display: 'flex',
                            gap: 12,
                            cursor: 'pointer',
                            background: 'var(--White1)',
                            alignItems: 'center',
                        }}
                    >
                        <span
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 10,
                                background: 'var(--Primary6)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 20,
                            }}
                        >
                            {guide.icon}
                        </span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--Gray1)' }}>{guide.title}</div>
                            {guide.description ? (
                                <div style={{ marginTop: 6, fontSize: 12, color: 'var(--Gray2)' }}>
                                    {guide.description}
                                </div>
                            ) : null}
                        </div>
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                color: 'var(--Primary1)',
                                fontSize: 12,
                            }}
                        >
                            <FiEye size={14} />
                            <span>{startText}</span>
                            <FiArrowRight size={13} />
                        </span>
                    </button>
                ))}
            </div>

            <div
                style={{
                    padding: '0 20px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    color: 'var(--Gray3)',
                    fontSize: 12,
                }}
            >
                <span style={{ flex: 1, minWidth: 0, wordBreak: 'keep-all' }}>{footerText}</span>
                <Button
                    variant="base"
                    type="button"
                    width="auto"
                    padding={{ x: 14, y: 9 }}
                    radius={10}
                    bgColor="var(--Primary1)"
                    textColor="var(--White1)"
                    onClick={onClose}
                >
                    {closeText}
                </Button>
            </div>
        </div>
    );
};

export default OnboardingModalTemplate;
