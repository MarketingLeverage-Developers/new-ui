import React from 'react';

import Flex from '../../../../../Flex/Flex';
import type { PaddingSize } from '../../../../../shared/types/css/PaddingSize';
import styles from './MobilePageTemplate.module.scss';

const DEFAULT_MAIN_PADDING: PaddingSize = { y: 16, x: 8 };

const normalizePadding = (padding: PaddingSize | number): PaddingSize => {
    if (typeof padding === 'number') {
        return { y: padding, x: padding };
    }

    return padding;
};

export type MobilePageTemplateProps = {
    header?: React.ReactNode;
    main: React.ReactNode;
    footer?: React.ReactNode;
    overlay?: React.ReactNode;
    mainPadding?: PaddingSize | number;
    mainScrollable?: boolean;
    mainLayout?: 'auto' | 'fill';
    showFooter?: boolean;
};

const MobilePageTemplate = ({
    header,
    main,
    footer,
    overlay,
    mainPadding = DEFAULT_MAIN_PADDING,
    mainScrollable = true,
    mainLayout = 'auto',
    showFooter = true,
}: MobilePageTemplateProps) => {
    const hasFooter = showFooter && footer !== null && typeof footer !== 'undefined';

    return (
        <div className={styles.PageTemplate}>
            {header ? <header className={styles.Header}>{header}</header> : null}

            <main className={`${styles.Main} ${hasFooter ? styles.WithFooter : ''}`}>
                <div className={`${styles.MainScroller} ${!mainScrollable ? styles.NonScrollable : ''}`}>
                    <Flex
                        padding={normalizePadding(mainPadding)}
                        direction="column"
                        gap={24}
                        style={mainLayout === 'fill' ? { height: '100%' } : undefined}
                    >
                        {main}
                    </Flex>
                </div>
            </main>

            <div className={styles.Overlays}>{overlay}</div>

            {hasFooter ? <footer className={styles.Footer}>{footer}</footer> : null}
        </div>
    );
};

export default MobilePageTemplate;
