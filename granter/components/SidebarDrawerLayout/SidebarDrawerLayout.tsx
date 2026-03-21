import React from 'react';
import type { ReactNode } from 'react';
import BasicContent from '../BasicContent/BasicContent';
import Flex from '../Flex/Flex';
import Text from '../Text/Text';

export type SidebarDrawerTab<T extends string = string> = {
    id: T;
    label: string;
};

export type SidebarDrawerLayoutProps<T extends string = string> = {
    eyebrow?: ReactNode;
    title: ReactNode;
    statusBadge?: ReactNode;
    onClose: () => void;
    tabs: SidebarDrawerTab<T>[];
    activeTab: T;
    onTabChange: (id: T) => void;
    contentHeader?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
};

export const SidebarDrawerLayout = <T extends string>({
    eyebrow,
    title,
    statusBadge,
    onClose,
    tabs,
    activeTab,
    onTabChange,
    contentHeader,
    footer,
    children,
}: SidebarDrawerLayoutProps<T>) => (
        <BasicContent>
            <BasicContent.Header>
                <Flex direction="column" gap={4}>
                    {eyebrow && (
                        <Text size="sm" tone="muted">
                            {eyebrow}
                        </Text>
                    )}
                    <Flex align="center" gap={10}>
                        <BasicContent.Title>{title}</BasicContent.Title>
                        {statusBadge}
                    </Flex>
                </Flex>
                <BasicContent.CloseButton onClick={onClose} />
            </BasicContent.Header>

            <BasicContent.Body style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                    <div
                        style={{
                            width: 200,
                            flexShrink: 0,
                            borderRight: '1px solid #e5e7eb',
                            background: '#f8fafc',
                            padding: '24px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            overflowY: 'auto',
                        }}
                    >
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => onTabChange(tab.id)}
                                    style={{
                                        width: '100%',
                                        border: isActive ? '1px solid #111827' : '1px solid #E5E7EB',
                                        background: isActive ? '#F8FAFC' : '#FFFFFF',
                                        borderRadius: 10,
                                        padding: '12px 14px',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', minHeight: 20 }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: isActive ? '#111827' : '#475569' }}>
                                            {tab.label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
                        {contentHeader}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>{children}</div>
                    </div>
                </div>
            </BasicContent.Body>

            {footer}
        </BasicContent>
    );

export default SidebarDrawerLayout;
