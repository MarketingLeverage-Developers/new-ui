import React from 'react';
import { Item } from './components/Item';
import styles from './AgreementCheckBox.module.scss';
import CheckBoxToggle from '../CheckBoxToggle/CheckBoxToggle';

type AgreementCheckBoxProps = {
    allChecked: boolean;
    onToggleAll: (next: boolean) => void;
    allChekckedText?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
};

export const AgreementCheckBox = ({
    allChecked,
    onToggleAll,
    allChekckedText,
    children,
    footer,
}: AgreementCheckBoxProps) => (
    <div className={styles.AgreementCheckBox}>
        <div className={styles.AllChecked}>
            <CheckBoxToggle value={allChecked} onChange={onToggleAll} />
            <span>{allChekckedText ?? '약관 전체 동의하기 (선택 동의 포함)'}</span>
        </div>
        <div className={styles.ChekedListWrapper}>{children}</div>
        <div className={styles.InfoText}>
            {footer ?? (
                <>
                    정보주체의 개인정보 및 권리 보호를 위해 개인정보 보호법 「개인정보 보호법」 및 관계 법령이 정한 바를
                    준수하여 안전하게 관리하고 있습니다. <br />
                    자세한 사항은 개인정보처리방침에서 확인할 수 있습니다.
                </>
            )}
        </div>
    </div>
);

AgreementCheckBox.Item = Item;
