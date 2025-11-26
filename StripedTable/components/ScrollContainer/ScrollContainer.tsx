// 가로 스크롤이 필요한 테이블을 감싸는 컨테이너
import React from 'react';

type ScrollTableContainerProps = {
    children: React.ReactNode;
    totalTableWidth?: number;
};

export const ScrollContainer = ({ children, totalTableWidth = 0 }: ScrollTableContainerProps) => (
    <div
        style={{
            width: '100%',
            overflowX: 'auto',
            paddingBottom: '10px',
            display: 'grid',
            overscrollBehavior: 'auto',
        }}
    >
        <div style={{ minWidth: `${totalTableWidth}px` }}>{children}</div>
    </div>
);
