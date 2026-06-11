import React from 'react';
import classNames from 'classnames';
import { FiClipboard, FiImage, FiInfo, FiMail, FiPhone, FiPlus, FiTarget, FiX } from 'react-icons/fi';
import DetailInfoRow from '../DetailInfoRow/DetailInfoRow';
import DetailInfoSection from '../DetailInfoSection/DetailInfoSection';
import PanelHeader from '../PanelHeader/PanelHeader';
import RequestDescriptionBox from '../RequestDescriptionBox/RequestDescriptionBox';
import RequestScheduleInfoCard from '../RequestScheduleInfoCard/RequestScheduleInfoCard';
import type { RequestScheduleInfoCardProps } from '../RequestScheduleInfoCard/RequestScheduleInfoCard';
import styles from './CreativeRequestDetailScene.module.scss';

export type CreativeRequestDetailScenePerson = {
    label: React.ReactNode;
    name: React.ReactNode;
    meta?: React.ReactNode;
    tag?: React.ReactNode;
    headerActions?: React.ReactNode;
    email?: React.ReactNode;
    phone?: React.ReactNode;
    avatarSrc?: string | null;
    avatarText?: React.ReactNode;
};

export type CreativeRequestDetailSceneMaterial = {
    id: string | number;
    title: React.ReactNode;
    meta?: React.ReactNode;
    imageSrc?: string | null;
};

export type CreativeRequestDetailScenePointItem = {
    id: string | number;
    label: React.ReactNode;
    meta?: React.ReactNode;
};

export type CreativeRequestDetailSceneRow = {
    key: string;
    label: React.ReactNode;
    value: React.ReactNode;
    icon?: React.ReactNode;
    tone?: 'default' | 'muted' | 'accent' | 'danger';
    wide?: boolean;
};

export type CreativeRequestDetailSceneProps = {
    className?: string;
    requester: CreativeRequestDetailScenePerson;
    assignee: CreativeRequestDetailScenePerson;
    evaluation: CreativeRequestDetailScenePerson;
    progress: React.ReactNode;
    onClose?: () => void;
    viewerTitle: React.ReactNode;
    viewer: React.ReactNode;
    materials: CreativeRequestDetailSceneMaterial[];
    selectedMaterialId?: string | number | null;
    onSelectMaterial?: (id: string | number) => void;
    pointItems?: CreativeRequestDetailScenePointItem[];
    selectedPointId?: string | number | null;
    onSelectPoint?: (id: string | number) => void;
    onAddMaterialRequest?: () => void;
    addMaterialLabel?: React.ReactNode;
    pointTitle?: React.ReactNode;
    pointPreview?: React.ReactNode;
    materialRequestRows: CreativeRequestDetailSceneRow[];
    pointRows: CreativeRequestDetailSceneRow[];
    requestScheduleInfo: RequestScheduleInfoCardProps;
    requestExtraRows: CreativeRequestDetailSceneRow[];
};

const renderEmpty = (value: React.ReactNode) => {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    return value;
};

const getInitial = (value: React.ReactNode) => {
    if (typeof value !== 'string' && typeof value !== 'number') {
        return '-';
    }

    const text = String(value).trim();
    return text ? text.slice(0, 1) : '-';
};

const PersonSummary = ({ person }: { person: CreativeRequestDetailScenePerson }) => (
    <section className={styles.PersonSummary}>
        <div className={styles.PersonHeaderLine}>
            <span className={styles.PersonLabel}>{person.label}</span>
            {person.headerActions ? <div className={styles.PersonHeaderActions}>{person.headerActions}</div> : null}
        </div>
        <div className={styles.PersonBody}>
            <span className={styles.PersonAvatar} aria-hidden="true">
                {person.avatarSrc ? <img src={person.avatarSrc} alt="" /> : <span>{person.avatarText ?? getInitial(person.name)}</span>}
            </span>
            <div className={styles.PersonCopy}>
                <div className={styles.PersonNameLine}>
                    <strong>{renderEmpty(person.name)}</strong>
                </div>
                {person.email !== undefined || person.phone !== undefined ? (
                    <div className={styles.PersonContactLine}>
                        <span>
                            <FiMail aria-hidden="true" />
                            {renderEmpty(person.email)}
                        </span>
                        <span>
                            <FiPhone aria-hidden="true" />
                            {renderEmpty(person.phone)}
                        </span>
                    </div>
                ) : (
                    <div className={styles.PersonMetaLine}>
                        {person.tag ? <span className={styles.PersonTag}>{person.tag}</span> : null}
                        <span>{renderEmpty(person.meta)}</span>
                    </div>
                )}
            </div>
        </div>
    </section>
);

const InfoRows = ({ rows }: { rows: CreativeRequestDetailSceneRow[] }) => (
    <>
        {rows.map((row) => (
            <DetailInfoRow key={row.key} icon={row.icon ?? null} label={row.label} wide={row.wide}>
                <strong className={styles.RowValue} data-tone={row.tone ?? 'default'}>
                    {renderEmpty(row.value)}
                </strong>
            </DetailInfoRow>
        ))}
    </>
);

const CreativeRequestDetailScene = ({
    className,
    requester,
    assignee,
    evaluation,
    progress,
    onClose,
    viewerTitle,
    viewer,
    materials,
    selectedMaterialId,
    onSelectMaterial,
    pointItems = [],
    selectedPointId,
    onSelectPoint,
    onAddMaterialRequest,
    addMaterialLabel = '소재 추가 요청',
    pointTitle = '제작 포인트 상세',
    pointPreview,
    materialRequestRows,
    pointRows,
    requestScheduleInfo,
    requestExtraRows,
}: CreativeRequestDetailSceneProps) => {
    const visibleMaterials = materials.slice(0, 7);
    const hiddenMaterialCount = Math.max(materials.length - visibleMaterials.length, 0);
    const materialDescriptionRow = materialRequestRows[0] ?? null;
    const additionalMaterialRequestRows = materialRequestRows.slice(1);

    return (
        <div className={classNames(styles.Root, className)}>
            {onClose ? (
                <button type="button" className={styles.CloseButton} aria-label="닫기" onClick={onClose}>
                    <FiX aria-hidden="true" />
                </button>
            ) : null}

            <header className={styles.TopCard}>
                <PersonSummary person={requester} />
                <PersonSummary person={assignee} />
                <PersonSummary person={evaluation} />
                <div className={styles.ProgressSlot}>{progress}</div>
            </header>

            <section className={styles.InfoGrid}>
                <RequestScheduleInfoCard
                    {...requestScheduleInfo}
                    icon={requestScheduleInfo.icon ?? <FiClipboard aria-hidden="true" />}
                    className={classNames(styles.RequestScheduleCard, requestScheduleInfo.className)}
                />
                <DetailInfoSection
                    icon={<FiInfo />}
                    title="추가 정보"
                    tone="blue"
                    className={styles.RequestExtraCard}
                    boxClassName={styles.RequestExtraBox}
                >
                    <InfoRows rows={requestExtraRows} />
                </DetailInfoSection>
            </section>

            <main className={styles.MainGrid}>
                <DetailInfoSection
                    icon={<FiImage />}
                    title={viewerTitle}
                    tone="indigo"
                    className={styles.ViewerCard}
                    boxClassName={styles.ViewerBox}
                >
                    <div className={styles.ViewerWorkspace}>
                        <div className={styles.ViewerSlot}>{viewer}</div>
                        <aside className={styles.ViewerPointPanel} aria-label="제작 포인트 목록">
                            <div className={styles.ViewerPointPanelHeader}>
                                <span>제작 포인트</span>
                                <strong>총 {pointItems.length}개</strong>
                            </div>
                            <div className={styles.ViewerPointList}>
                                {pointItems.length > 0 ? (
                                    pointItems.map((point, index) => {
                                        const selected = String(point.id) === String(selectedPointId);

                                        return (
                                            <button
                                                key={point.id}
                                                type="button"
                                                className={styles.ViewerPointButton}
                                                data-selected={selected ? 'true' : 'false'}
                                                onClick={() => onSelectPoint?.(point.id)}
                                            >
                                                <span className={styles.ViewerPointIndex}>{index + 1}</span>
                                                <span className={styles.ViewerPointText}>
                                                    <strong>{renderEmpty(point.label)}</strong>
                                                    {point.meta ? <small>{point.meta}</small> : null}
                                                </span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className={styles.ViewerPointEmpty}>지정된 제작 포인트가 없습니다.</div>
                                )}
                            </div>
                        </aside>
                    </div>
                    <div className={styles.MaterialTray}>
                        <div className={styles.MaterialTrayHeader}>
                            <span>
                                소재 목록 <strong>총 {materials.length}개</strong>
                            </span>
                            {onAddMaterialRequest ? (
                                <button type="button" className={styles.AddMaterialButton} onClick={onAddMaterialRequest}>
                                    <FiPlus aria-hidden="true" />
                                    {addMaterialLabel}
                                </button>
                            ) : null}
                        </div>
                        <div className={styles.MaterialList} aria-label="소재 목록">
                            {visibleMaterials.map((material, index) => {
                                const selected = String(material.id) === String(selectedMaterialId);

                                return (
                                    <button
                                        key={material.id}
                                        type="button"
                                        className={styles.MaterialButton}
                                        data-selected={selected ? 'true' : 'false'}
                                        onClick={() => onSelectMaterial?.(material.id)}
                                    >
                                        <span className={styles.MaterialThumb}>
                                            {material.imageSrc ? <img src={material.imageSrc} alt="" /> : null}
                                        </span>
                                        <strong>{material.title}</strong>
                                        <span>{material.meta ?? `소재 ${index + 1}`}</span>
                                    </button>
                                );
                            })}
                            {hiddenMaterialCount > 0 ? (
                                <span className={styles.MoreMaterialTile}>+{hiddenMaterialCount}</span>
                            ) : null}
                        </div>
                    </div>
                </DetailInfoSection>

                <div className={styles.RightColumn}>
                    <DetailInfoSection
                        icon={<FiTarget />}
                        title="소재 요청 상세"
                        tone="orange"
                        className={styles.MaterialRequestDetailCard}
                        boxClassName={styles.MaterialRequestDetailBox}
                    >
                        <div className={styles.DetailGroup}>
                            <PanelHeader title="소재 요청" />
                            {materialDescriptionRow ? (
                                <RequestDescriptionBox
                                    label={materialDescriptionRow.label}
                                    icon={materialDescriptionRow.icon}
                                    description={materialDescriptionRow.value}
                                />
                            ) : null}
                            {additionalMaterialRequestRows.length > 0 ? (
                                <div className={styles.DetailRows}>
                                    <InfoRows rows={additionalMaterialRequestRows} />
                                </div>
                            ) : null}
                        </div>

                        <div className={styles.DetailGroup}>
                            <PanelHeader title={pointTitle} />
                            <div className={styles.PointPreviewSlot}>{pointPreview}</div>
                            <div className={styles.PointRows}>
                                <InfoRows rows={pointRows} />
                            </div>
                        </div>
                    </DetailInfoSection>
                </div>
            </main>
        </div>
    );
};

export default CreativeRequestDetailScene;
