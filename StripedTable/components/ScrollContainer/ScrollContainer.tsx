type ScrollTableContainerProps = {
    children: React.ReactNode;
    totalTableWidth: number;
};

export const ScrollContainer = ({ children, totalTableWidth }: ScrollTableContainerProps) => (
    <div
        style={{ width: '100%', overflowX: 'auto', paddingBottom: '10px', display: 'grid', overscrollBehavior: 'auto' }}
    >
        <div style={{ minWidth: `${totalTableWidth}px` }}>{children}</div>
    </div>
);
