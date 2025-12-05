import Table from '@/shared/headless/TableX/Table';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ColumnSelectBox.module.scss';
import { FaCheck } from 'react-icons/fa';
import classNames from 'classnames';

export const ColumnSelectBox = (props: React.ComponentProps<typeof Table.ColumnSelectBox>) => {
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
        const portalId = 'column-select-box-portal';

        const findPortal = () => {
            const target = document.getElementById(portalId);
            if (target) {
                setPortalTarget(target);
                return true;
            }
            return false;
        };

        // 먼저 현재 DOM에서 찾기
        if (findPortal()) {
            return;
        }

        // 없으면 MutationObserver로 Portal이 추가될 때까지 기다리기
        const observer = new MutationObserver(() => {
            if (findPortal()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const content = (
        <Table.ColumnSelectBox
            {...props}
            triggerClassName={styles.Trigger}
            contentClassName={styles.Content}
            itemClassName={styles.Item}
            checkboxWrapperClassName={styles.CheckboxWrapper}
            checkboxWrapperCheckedClassName={styles.Checked}
            labelClassName={styles.Label}
            itemNode={(label, checked) => <Checkbox label={label} checked={checked} />}
        />
    );

    // Portal이 있으면 거기에 렌더링, 없으면 기본 위치에 렌더링
    if (portalTarget) {
        return createPortal(content, portalTarget);
    }

    return content;
};

const Checkbox = ({ label, checked }: { label: string; checked: boolean }) => {
    const triggerClassName = classNames(styles.Checkbox, {
        [styles.Active]: checked,
    });
    return (
        <div className={styles.CheckboxWrapper}>
            <div className={triggerClassName}>{checked && <FaCheck />}</div>
            <div className={styles.Label}>{label}</div>
        </div>
    );
};
