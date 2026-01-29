import React from 'react';
import Box from '@/shared/primitives/D/components/Box/Box';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

export type RequestDetailTemplateProps = {
    left?: React.ReactNode;
    rightHeader: React.ReactNode;
    rightMain: React.ReactNode;
    leftFlex?: number;
    rightFlex?: number;
};

const RequestDetailTemplate = ({
    left,
    rightHeader,
    rightMain,
    leftFlex = 1,
    rightFlex = 1,
}: RequestDetailTemplateProps) => (
    <Box width="100%" height="100%" wrap="wrap">
        <Box direction="column" flex={leftFlex} style={{ borderRight: `1px solid ${getThemeColor('Gray6')}` }}>
            {left}
        </Box>
        <Box direction="column" flex={rightFlex} height="100%" style={{ minHeight: 0 }}>
            <Box
                flex="0 0 auto"
                gap={8}
                background={getThemeColor('White1')}
                padding={{ x: 32, y: 14 }}
                style={{ borderBottom: `1px solid ${getThemeColor('Gray6')}` }}
            >
                {rightHeader}
            </Box>
            <Box flex={1} style={{ overflow: 'auto', minHeight: 0 }}>
                {rightMain}
            </Box>
        </Box>
    </Box>
);

export default RequestDetailTemplate;
