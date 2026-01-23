import React, { useEffect, useState } from 'react';
import TemplateSelectModal from '../../TemplateSelectModal';
import type { TemplateListItem } from '@/features/template/list/logic/types';
import { BaseTooltip } from '@/shared/primitives/BaseTooltip/BaseTooltip';
import { Image } from '@/shared/primitives/Image/Image';

type Props = {
    data: TemplateListItem[];
    templateId: number | null;
    setTemplateId: (id: number | null) => void;

    templateImageUUID: string;
    setTemplateImageUUID: (uuid: string) => void;

    templateImageUrl: string;
    setTemplateImageUrl: (url: string) => void;

    onDeleteClick?: () => void;
    onSetClick?: () => void;
};

export const Template = ({
    data,
    templateId,
    setTemplateId,
    templateImageUUID,
    templateImageUrl,
    setTemplateImageUrl,
    setTemplateImageUUID,
    onDeleteClick,
    onSetClick,
}: Props) => {
    const [modalValue, setModalValue] = useState(false);
    const [openSet, setOpenSet] = useState<Set<string>>(new Set());
    // const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!modalValue) return;
        if (!data?.length) return;

        // 모달 열릴 때마다: 전부 열기
        setOpenSet(new Set(data.map((d) => String(d.id))));
    }, [modalValue, data]);

    const toggle = (key: string) => {
        setOpenSet((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    // 선택된 템플릿으로 Trigger 이미지 보여주기
    // const selected = useMemo(() => data.find((t) => t.id === templateId) ?? null, [data, templateId]);

    const triggerUrl = templateImageUrl ? `${import.meta.env.VITE_API_URL}/api${templateImageUrl}` : '';
    const canDelete = Boolean(templateImageUUID || templateImageUrl);

    const handleSelect = (item: TemplateListItem) => {
        setTemplateId(item.id);
        setTemplateImageUUID(item?.images?.[0]?.imageUUID ?? '');
        setTemplateImageUrl(item?.images?.[0]?.imageUrl ?? '');
        setModalValue(false);
    };

    return (
        <TemplateSelectModal value={modalValue} onChange={setModalValue}>
            <div
                onClickCapture={() => {
                    onSetClick?.();
                }}
                style={{ width: '100%' }}
            >
                <TemplateSelectModal.Trigger
                    imageUrl={triggerUrl}
                    templateImageUUID={templateImageUUID}
                    onDeleteClick={
                        canDelete
                            ? () => {
                                  if (onDeleteClick) {
                                      onDeleteClick();
                                      return;
                                  }
                                  setTemplateId(null);
                                  setTemplateImageUUID('');
                                  setTemplateImageUrl('');
                              }
                            : undefined
                    }
                />
            </div>

            <TemplateSelectModal.TopPortal active>
                <TemplateSelectModal.Layout noBorder header={'템플릿 선택'}>
                    {data.map((item) => (
                        <TemplateSelectModal.Item
                            key={item.id}
                            value={item.id.toString()}
                            label={item.name}
                            opened={openSet.has(item.id.toString())}
                            onOpen={toggle}
                        >
                            {item.description ? (
                                <BaseTooltip label={item.description}>
                                    <Image
                                        width={'100%'}
                                        radius={8}
                                        src={`${import.meta.env.VITE_API_URL}/api${item?.images[0]?.imageUrl ?? ''}`}
                                        alt={item.name}
                                        onClick={() => handleSelect(item)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </BaseTooltip>
                            ) : (
                                <Image
                                    width={'100%'}
                                    radius={8}
                                    src={`${import.meta.env.VITE_API_URL}/api${item?.images[0]?.imageUrl ?? ''}`}
                                    alt={item.name}
                                    onClick={() => handleSelect(item)}
                                />
                            )}
                        </TemplateSelectModal.Item>
                    ))}
                </TemplateSelectModal.Layout>
            </TemplateSelectModal.TopPortal>
        </TemplateSelectModal>
    );
};
