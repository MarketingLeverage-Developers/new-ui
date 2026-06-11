import React from 'react';
import classNames from 'classnames';
import { FiCheck, FiClipboard, FiEdit3, FiImage, FiMail, FiMessageSquare, FiPhone, FiPlus, FiTarget, FiX } from 'react-icons/fi';
import DetailInfoSection from '../DetailInfoSection/DetailInfoSection';
import DetailSubField from '../DetailSubField/DetailSubField';
import DetailSubSection from '../DetailSubSection/DetailSubSection';
import RequestScheduleInfoCard, { RequestScheduleTimeline } from '../RequestScheduleInfoCard/RequestScheduleInfoCard';
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

export type CreativeRequestDetailSceneImageItem = {
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
    layoutMode?: 'standard' | 'immersive';
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
    imageItems?: CreativeRequestDetailSceneImageItem[];
    selectedImageId?: string | number | null;
    onSelectImage?: (id: string | number) => void;
    pointItems?: CreativeRequestDetailScenePointItem[];
    selectedPointId?: string | number | null;
    onSelectPoint?: (id: string | number) => void;
    onAddMaterialRequest?: () => void;
    addMaterialLabel?: React.ReactNode;
    pointPreview?: React.ReactNode;
    outputContent?: React.ReactNode;
    resultSummaryContent?: React.ReactNode;
    materialRequestRows: CreativeRequestDetailSceneRow[];
    pointRows: CreativeRequestDetailSceneRow[];
    requestScheduleInfo: RequestScheduleInfoCardProps;
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

const DetailSubFields = ({ rows }: { rows: CreativeRequestDetailSceneRow[] }) => (
    <>
        {rows.map((row) => (
            <DetailSubField key={row.key} icon={row.icon ?? null} label={row.label} tone={row.tone}>
                {renderEmpty(row.value)}
            </DetailSubField>
        ))}
    </>
);

const CreativeRequestDetailScene = ({
    className,
    layoutMode = 'standard',
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
    imageItems = [],
    selectedImageId,
    onSelectImage,
    pointItems = [],
    selectedPointId,
    onSelectPoint,
    onAddMaterialRequest,
    addMaterialLabel = '소재 추가 요청',
    pointPreview,
    outputContent,
    resultSummaryContent,
    materialRequestRows,
    pointRows,
    requestScheduleInfo,
}: CreativeRequestDetailSceneProps) => {
    const visibleMaterials = materials.slice(0, 7);
    const hiddenMaterialCount = Math.max(materials.length - visibleMaterials.length, 0);
    const visibleImages = imageItems.slice(0, 7);
    const hiddenImageCount = Math.max(imageItems.length - visibleImages.length, 0);
    const materialDescriptionRow = materialRequestRows[0] ?? null;
    const additionalMaterialRequestRows = materialRequestRows.slice(1);
    const selectedPointIndex = pointItems.findIndex((point) => String(point.id) === String(selectedPointId));
    const selectedPoint = selectedPointIndex >= 0 ? pointItems[selectedPointIndex] : pointItems[0] ?? null;
    const selectedPointNumber = selectedPointIndex >= 0 ? selectedPointIndex + 1 : selectedPoint ? 1 : null;
    const pointListPanel = (
        <DetailSubSection
            title="포인트"
            icon={<FiTarget />}
            tone="orange"
            className={styles.PointListCard}
            bodyClassName={styles.PointListBox}
            collapsible
        >
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
                                aria-label={`제작 포인트 ${index + 1} 선택`}
                                onClick={() => onSelectPoint?.(point.id)}
                            >
                                <span className={styles.ViewerPointIndex}>{index + 1}</span>
                            </button>
                        );
                    })
                ) : (
                    <div className={styles.ViewerPointEmpty} aria-label="지정된 제작 포인트가 없습니다.">
                        -
                    </div>
                )}
            </div>
        </DetailSubSection>
    );
    const materialTray = (
        <DetailSubSection
            title="소재"
            icon={<FiImage />}
            tone="indigo"
            className={styles.MaterialTray}
            bodyClassName={styles.MaterialTrayBox}
            collapsible
            rightSlot={
                onAddMaterialRequest ? (
                    <button type="button" className={styles.AddMaterialButton} onClick={onAddMaterialRequest}>
                        <FiPlus aria-hidden="true" />
                        {addMaterialLabel}
                    </button>
                ) : null
            }
        >
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
                            <span className={styles.MaterialThumb}>{material.imageSrc ? <img src={material.imageSrc} alt="" /> : null}</span>
                            <span className={styles.MaterialCopy}>
                                <strong>{material.title}</strong>
                                <span>{material.meta ?? `소재 ${index + 1}`}</span>
                            </span>
                            {selected ? (
                                <span className={styles.MaterialSelectedIcon} aria-hidden="true">
                                    <FiCheck />
                                </span>
                            ) : null}
                        </button>
                    );
                })}
                {hiddenMaterialCount > 0 ? <span className={styles.MoreMaterialTile}>+{hiddenMaterialCount}</span> : null}
            </div>
        </DetailSubSection>
    );
    const imageListPanel = (
        <DetailSubSection
            title="이미지"
            icon={<FiImage />}
            tone="indigo"
            className={styles.ImageListCard}
            bodyClassName={styles.ImageListBox}
            collapsible
        >
            <div className={styles.ImageList} aria-label="이미지 목록">
                {visibleImages.length > 0 ? (
                    visibleImages.map((image, index) => {
                        const selected = String(image.id) === String(selectedImageId);

                        return (
                            <button
                                key={image.id}
                                type="button"
                                className={styles.ImageButton}
                                data-selected={selected ? 'true' : 'false'}
                                onClick={() => onSelectImage?.(image.id)}
                            >
                                <span className={styles.ImageThumb}>{image.imageSrc ? <img src={image.imageSrc} alt="" /> : null}</span>
                                <span className={styles.ImageCopy}>
                                    <strong>{image.title}</strong>
                                    <span>{image.meta ?? `이미지 ${index + 1}`}</span>
                                </span>
                                {selected ? (
                                    <span className={styles.MaterialSelectedIcon} aria-hidden="true">
                                        <FiCheck />
                                    </span>
                                ) : null}
                            </button>
                        );
                    })
                ) : (
                    <div className={styles.ImageListEmpty}>연결된 이미지가 없습니다.</div>
                )}
                {hiddenImageCount > 0 ? <span className={styles.MoreMaterialTile}>+{hiddenImageCount}</span> : null}
            </div>
        </DetailSubSection>
    );
    const reviewPanel = (
        <DetailInfoSection
            icon={<FiEdit3 />}
            title="소재 검토"
            tone="violet"
            className={styles.ReviewPanel}
            boxClassName={styles.ReviewPanelBox}
            contentClassName={styles.ReviewPanelScrollBody}
        >
            {materialTray}
            {imageListPanel}
            {pointListPanel}
        </DetailInfoSection>
    );
    const materialDetailPanel = (
        <div className={styles.ViewerDetailPanel}>
            <DetailSubSection title="소재 설명" icon={<FiMessageSquare />} tone="indigo">
                {materialDescriptionRow ? (
                    <p className={styles.MaterialDescriptionText}>{renderEmpty(materialDescriptionRow.value)}</p>
                ) : null}
                {additionalMaterialRequestRows.length > 0 ? (
                    <div className={styles.DetailRows}>
                        <DetailSubFields rows={additionalMaterialRequestRows} />
                    </div>
                ) : null}
            </DetailSubSection>

            <DetailSubSection title="제작 포인트 상세" icon={<FiTarget />} tone="orange">
                {selectedPoint ? (
                    <div className={styles.PointDetailHeading}>
                        <span className={styles.PointDetailIndex}>{selectedPointNumber}</span>
                        <strong>{renderEmpty(selectedPoint.label)}</strong>
                    </div>
                ) : null}
                <div className={styles.PointPreviewSlot}>{pointPreview}</div>
                <div className={styles.PointRows}>
                    <DetailSubFields rows={pointRows} />
                </div>
            </DetailSubSection>

            {outputContent ? (
                <DetailSubSection title="작업물" icon={<FiImage />} tone="slate">
                    {outputContent}
                </DetailSubSection>
            ) : null}
        </div>
    );

    return (
        <div className={classNames(styles.Root, className)} data-layout-mode={layoutMode}>
            {onClose ? (
                <button type="button" className={styles.CloseButton} aria-label="닫기" onClick={onClose}>
                    <FiX aria-hidden="true" />
                </button>
            ) : null}

            <header className={styles.TopCard}>
                <PersonSummary person={requester} />
                <PersonSummary person={assignee} />
                <PersonSummary person={evaluation} />
                <div className={styles.TopStatusSchedule}>
                    <div className={styles.ProgressSlot}>{progress}</div>
                    <RequestScheduleTimeline
                        startDateTime={requestScheduleInfo.startDateTime}
                        startLabel={requestScheduleInfo.startLabel}
                        startBadge={requestScheduleInfo.startBadge}
                        startValue={requestScheduleInfo.startValue}
                        endDateTime={requestScheduleInfo.endDateTime}
                        endLabel={requestScheduleInfo.endLabel}
                        endBadge={requestScheduleInfo.endBadge}
                        endValue={requestScheduleInfo.endValue}
                        className={styles.TopScheduleTimeline}
                    />
                </div>
            </header>

            <section className={styles.InfoGrid}>
                <RequestScheduleInfoCard
                    {...requestScheduleInfo}
                    hideSchedule
                    icon={requestScheduleInfo.icon ?? <FiClipboard aria-hidden="true" />}
                    className={classNames(styles.RequestScheduleCard, requestScheduleInfo.className)}
                />
                {resultSummaryContent}
            </section>

            <main className={styles.MainGrid}>
                {layoutMode === 'standard' ? (
                    <div className={styles.LeftColumn}>
                        {reviewPanel}
                    </div>
                ) : null}
                <DetailInfoSection
                    icon={<FiImage />}
                    title={viewerTitle}
                    tone="indigo"
                    className={styles.ViewerCard}
                    boxClassName={styles.ViewerBox}
                >
                    <div className={styles.ViewerWorkspace}>
                        {layoutMode === 'immersive' ? (
                            <div className={styles.ViewerOverlayLayer}>
                                {materialTray}
                            </div>
                        ) : null}
                        <div className={styles.ViewerSlot}>{viewer}</div>
                        {materialDetailPanel}
                    </div>
                </DetailInfoSection>
            </main>
        </div>
    );
};

export default CreativeRequestDetailScene;
