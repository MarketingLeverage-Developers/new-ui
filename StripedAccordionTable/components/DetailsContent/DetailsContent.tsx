import classNames from 'classnames';
import React from 'react';
import styles from './DetailsContent.module.scss';
import { IoCellular } from 'react-icons/io5';
import { GoQuestion } from 'react-icons/go';
import IpContent from './components/IpContent';
import StripedTable from '@/shared/primitives/StripedTable/StripedTable';
import { VisitCustomerColumns, type VisitCustomer } from './VisitCustomerColumns';

type DetailsContentProps = {} & React.HTMLAttributes<HTMLDivElement>;

const DetailsContent = ({ ...props }: DetailsContentProps) => {
    const visitCustomerSample: VisitCustomer[] = [
        {
            id: '1755',
            visits: 2,
            adClicks: 2,
            firstVisit: '2025-07-10 02:43:46',
            lastVisit: '2025-07-10 02:43:46',
            conversions: 0,
            revenue: 0,
            environment: '2',
        },
        {
            id: '1752',
            visits: 2,
            adClicks: 2,
            firstVisit: '2025-07-10 02:43:46',
            lastVisit: '2025-07-10 02:43:46',
            conversions: 0,
            revenue: 0,
            environment: '3',
        },
    ];

    const columns = VisitCustomerColumns();
    return (
        <div {...props} className={classNames(styles.props, styles.DetailsContent)}>
            <div className={styles.Header}>
                <span>{'106.102.142.235'}</span>
                <div>
                    <IoCellular />
                </div>
                <div className={styles.QuestionIcon}>
                    <GoQuestion />
                </div>
            </div>

            <div className={styles.IpContentWrapper}>
                <IpContent label="IP 보유기관명">
                    <span className={styles.IpContentText}>{'(주)엘지유플러스'}</span>
                </IpContent>

                <IpContent label="IP 주소 (위치 정보)">
                    <span className={styles.IpContentText}>{'해당 IP에 대한 주소를 찾을 수 없습니다.'}</span>
                </IpContent>

                <IpContent label="IP 통계">
                    <span className={styles.IpContentText}>{'해당 IP에 대한 주소를 찾을 수 없습니다.'}</span>
                </IpContent>

                <IpContent label="IP 상태">
                    <span className={styles.IpContentText}>{'해당 IP에 대한 주소를 찾을 수 없습니다.'}</span>
                </IpContent>
            </div>

            <div className={styles.ContentDivider} />

            <div className={styles.visitWrapper}>
                <div className={styles.visitContent}>
                    <div className={styles.VisitTitle}>방문고객</div>
                    <StripedTable columns={columns} data={visitCustomerSample}>
                        <StripedTable.ColGroup />
                        <StripedTable.Header>
                            <StripedTable.HeaderRows></StripedTable.HeaderRows>
                        </StripedTable.Header>

                        <StripedTable.Body>
                            <StripedTable.BodyRows />
                        </StripedTable.Body>
                    </StripedTable>
                </div>
                <div className={styles.visitContent}>
                    <div className={styles.VisitTitle}>방문기록</div>
                    <StripedTable columns={columns} data={visitCustomerSample}>
                        <StripedTable.ColGroup />
                        <StripedTable.Header>
                            <StripedTable.HeaderRows></StripedTable.HeaderRows>
                        </StripedTable.Header>

                        <StripedTable.Body>
                            <StripedTable.BodyRows />
                        </StripedTable.Body>
                    </StripedTable>
                </div>
            </div>
        </div>
    );
};

export default DetailsContent;
