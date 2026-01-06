// StripedTable/components/ColumnSelectBox/ColumnSelectBox.tsx
// <ColumnSelectBox> + 데이터 컬럼 <col> 정의 (토글 컬럼도 그냥 일반 컬럼으로 포함)
import Table from '@/shared/headless/Table/Table';
import React from 'react';
import styles from './ColumnSelectBox.module.scss';

export const ColumnSelectBox = (props: React.ComponentProps<typeof Table.ColumnSelectBox>) => {
    return (
        <Table.ColumnSelectBox
            {...props}
            triggerClassName={styles.Trigger}
            contentClassName={styles.Content}
            itemClassName={styles.Item}
            checkboxWrapperClassName={styles.CheckboxWrapper}
            checkboxWrapperCheckedClassName={styles.Checked}
            labelClassName={styles.Label}
        />
    );
};
