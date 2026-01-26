import React, { useEffect, useState } from 'react';
import TemplateSelectModal from '../../TemplateSelectModal';
import type { TemplateListItem } from '@/features/template/list/logic/types';
import { BaseTooltip } from '@/shared/primitives/BaseTooltip/BaseTooltip';
import { Image } from '@/shared/primitives/Image/Image';
import { Desktop } from '@/shared/primitives/D/Desktop';
import Flex from '@/shared/primitives/Flex/Flex';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import { requestImageUpload } from '@/features/image-upload/logic/service';
import type { ServerImage } from '@/shared/types/common';

const { FileUploader, TextArea, Calendar, Box, Button, Text, MultiSelect } = Desktop;

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

    const handleUploadedSelect = (items: ServerImage[]) => {
        const first = items?.[0];
        if (!first) return;
        setTemplateId(null);
        setTemplateImageUUID(first.imageUUID ?? '');
        setTemplateImageUrl(first.imageUrl ?? '');
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
                    <Flex gap={8} direction="column">
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
                        <Flex gap={15} direction="column">
                            <Flex padding={{ b: 15 }} style={{ borderBottom: `1px solid ${getThemeColor('Gray5')}` }}>
                                <Text fontWeight={600} fontSize={18}>
                                    새로운 템플릿으로 요청하기
                                </Text>
                            </Flex>
                            <Flex padding={15}>
                                <FileUploader
                                    variant="base-stacked"
                                    type="image"
                                    multiple={false}
                                    onChange={(next) => {
                                        handleUploadedSelect(next as ServerImage[]);
                                    }}
                                    uploader={
                                        async ({ files }) => {
                                            const res = await requestImageUpload({
                                                files,
                                                meta: { category: 'image', referenceUUID: '' },
                                            });
                                            if (!res.ok) return [];
                                            const body = (res.data?.body ?? []) as Array<{
                                                fileUUID: string;
                                                originalFileName: string;
                                                storedFileName: string;
                                                filePath: string;
                                            }>;
                                            return body.map((item) => ({
                                                imageUUID: item.fileUUID,
                                                imageName: item.storedFileName || item.originalFileName,
                                                imageUrl: item.filePath,
                                            }));
                                        }

                                        // await uploadSingleTemplateImage(files)
                                    }
                                >
                                    <FileUploader.Dropzone
                                        placeholder="이미지 파일을 첨부해주세요"
                                        buttonText="파일첨부"
                                        message="안녕하세요"
                                    />
                                </FileUploader>
                            </Flex>
                        </Flex>
                    </Flex>
                </TemplateSelectModal.Layout>
            </TemplateSelectModal.TopPortal>
        </TemplateSelectModal>
    );
};
