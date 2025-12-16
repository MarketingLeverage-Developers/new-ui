import React, { useMemo } from 'react';
import styles from './BaseModalLayout.module.scss';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import ScrollerWrapper from './components/ScrollerWrapper/ScrollerWrapper';
import Content from './components/Content/Content';
import BaseModalFormTemplate from './components/BaseModalFormTemplate/BaseModalFormTemplate';

type BaseModalLayoutProps = {
    children: React.ReactNode;
    width?: string | number;
    height?: string | number;
    padding?: PaddingSize | number;
} & React.HTMLAttributes<HTMLDivElement>;

const BaseModalLayout = ({
    children,
    width = '100%',
    height = '100%',
    padding = 32,
    style,
    ...props
}: BaseModalLayoutProps) => {
    const cssVariables: CSSVariables = useMemo(
        () => ({
            '--width': toCssUnit(width),
            '--height': toCssUnit(height),
            '--padding': toCssPadding(padding),
        }),
        [width, height, padding]
    );
    return (
        <div {...props} className={styles.BaseModalLayout} style={{ ...cssVariables, ...style }}>
            {children}
        </div>
    );
};

export default BaseModalLayout;

BaseModalLayout.Header = Header;
BaseModalLayout.Footer = Footer;
BaseModalLayout.Content = Content;
BaseModalLayout.ScrollerWrapper = ScrollerWrapper;
BaseModalLayout.FormTemplate = BaseModalFormTemplate;
