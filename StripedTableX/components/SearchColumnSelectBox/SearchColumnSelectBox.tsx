import classNames from 'classnames';
import React, { useLayoutEffect, useState } from 'react';
import styles from './SearchColumnSelectBox.module.scss';
import { FaCheck } from 'react-icons/fa';
import Table from '@/shared/headless/TableX/Table';
import { createPortal } from 'react-dom';

const SearchColumnSelectBox = (props: React.ComponentProps<typeof Table.ColumnSelectBox>) => {
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useLayoutEffect(() => {
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
        <Table.SearchColumnSelectBox
            {...props}
            triggerClassName={styles.Trigger}
            contentClassName={styles.Content}
            itemClassName={styles.Item}
            checkboxWrapperClassName={styles.CheckboxWrapper}
            checkboxWrapperCheckedClassName={styles.Checked}
            labelClassName={styles.Label}
            itemNode={(label, checked) => <Checkbox label={label} checked={checked} />}
            inputClassName={styles.Input}
            bottomClassName={styles.Bottom}
            topClassName={styles.Top}
        />
    );

    // Portal이 있으면 거기에 렌더링, 없으면 기본 위치에 렌더링
    if (portalTarget) {
        return createPortal(content, portalTarget);
    }

    return content;
};

export default SearchColumnSelectBox;

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
