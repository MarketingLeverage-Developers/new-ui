import React from 'react';

import Flex from '../../../../../Flex/Flex';
import type { PaddingSize } from '../../../../../shared/types/css/PaddingSize';
import { Sidebar } from './components/Sidebar/Sidebar';
import { SubSidebar } from './components/SubSidebar/SubSidebar';
import { Header } from './components/Header/Header';
import { Main } from './components/Main/Main';
import { Overlays } from './components/Overlays/Overlays';
import styles from './PageTemplate.module.scss';

const DEFAULT_MAIN_PADDING: PaddingSize = { y: 20, x: 24 };

const normalizePadding = (padding: PaddingSize | number): PaddingSize => {
    if (typeof padding === 'number') {
        return { y: padding, x: padding };
    }

    return padding;
};

export type PageTemplateProps = {
    sidebar: React.ReactNode;
    subSidebar?: React.ReactNode;
    header: React.ReactNode;
    overlay?: React.ReactNode;
    main: React.ReactNode;
    mainPadding?: PaddingSize | number;
    mainScrollable?: boolean;
};

const PageTemplate = ({
    sidebar,
    subSidebar,
    header,
    main,
    overlay,
    mainPadding = DEFAULT_MAIN_PADDING,
    mainScrollable = true,
}: PageTemplateProps) => (
    <div className={styles.PageTemplate}>
        <Sidebar>{sidebar}</Sidebar>

        {subSidebar ? <SubSidebar>{subSidebar}</SubSidebar> : null}

        <Header>{header}</Header>

        <Main scrollable={mainScrollable}>
            <Flex
                padding={normalizePadding(mainPadding)}
                direction="column"
                gap={24}
                style={{ height: '100%' }}
            >
                {main}
            </Flex>
        </Main>

        <Overlays>{overlay}</Overlays>
    </div>
);

export default PageTemplate;
