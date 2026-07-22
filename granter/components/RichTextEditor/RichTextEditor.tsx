import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import {
    EditorContent,
    Extension,
    Mark,
    Node as TipTapNode,
    NodeViewWrapper,
    ReactNodeViewRenderer,
    useEditor,
    type Editor,
    type ReactNodeViewProps,
} from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import Image from '@tiptap/extension-image';
import { TaskItem, TaskList } from '@tiptap/extension-list';
import StarterKit from '@tiptap/starter-kit';
import { DOMParser as ProseMirrorDOMParser, DOMSerializer as ProseMirrorDOMSerializer } from '@tiptap/pm/model';
import { Plugin, PluginKey, TextSelection } from '@tiptap/pm/state';
import { Decoration, DecorationSet, type EditorView } from '@tiptap/pm/view';
import classNames from 'classnames';
import { FiAlertCircle, FiBold, FiCode, FiImage, FiItalic, FiList, FiPlus, FiX } from 'react-icons/fi';
import {
    getRichTextPlainText,
    isRichTextEmpty,
    toRichTextEditorContent,
} from './richTextUtils';
import {
    NOTION_CLIPBOARD_IMAGE_MARKER_ATTR,
    normalizeNotionClipboardDom,
    notionPlainTextToCanonicalHtml,
} from './notionClipboardNormalizer';
import {
    parseNotionClipboardAttachmentCandidates,
    resolveNotionClipboardAttachment,
    type NotionClipboardCustomData,
} from './notionClipboardAttachmentResolver';
import styles from './RichTextEditor.module.scss';

const MIN_IMAGE_WIDTH_PERCENT = 20;
const MAX_IMAGE_WIDTH_PERCENT = 100;
const IMAGE_UPLOAD_PLACEHOLDER_KEY = new PluginKey<DecorationSet>('richTextImageUploadPlaceholder');

type ImageUploadPlaceholder = {
    id: string;
    position: number;
    label: string;
    order: number;
};

type ImageUploadPlaceholderMeta = {
    add?: ImageUploadPlaceholder[];
    removeIds?: string[];
};

type EditorImageUploadJob = {
    files: File[] | Promise<ResolvedImageUploadFiles>;
    expectedCount: number;
    position: number;
    positions?: number[];
    warning?: string;
};

type ClipboardImageSource = {
    src: string;
    alt: string;
    marker: string;
    isNotionAttachment: boolean;
};

type ClipboardContent = {
    htmlWithImageMarkers: string;
    originalHtmlWithImageMarkers: string;
    text: string;
    imageSources: ClipboardImageSource[];
    isNotionContent: boolean;
};

type ResolvedImageUploadFiles = {
    files: File[];
    uploadIndexes: number[];
    failedCount: number;
    failureMessage?: string;
};

type ClipboardImageUpload = {
    files: Promise<ResolvedImageUploadFiles>;
    expectedCount: number;
    sourceIndexes: Array<number | null>;
};

type TransferredTextInsertResult = {
    position: number;
    imagePositions: Array<number | undefined>;
    retainedImageSourceIndexes: number[];
};

type SlashCommandId =
    | 'paragraph'
    | 'heading1'
    | 'heading2'
    | 'heading3'
    | 'bulletList'
    | 'orderedList'
    | 'blockquote'
    | 'codeBlock'
    | 'horizontalRule'
    | 'image';

type SlashCommand = {
    id: SlashCommandId;
    label: string;
    description: string;
    keywords: string;
    icon: string;
};

type SlashMenuState = {
    from: number;
    to: number;
    left: number;
    top: number;
    selectedIndex: number;
    commands: SlashCommand[];
};

const SLASH_COMMANDS: SlashCommand[] = [
    { id: 'paragraph', label: '텍스트', description: '일반 문단을 작성합니다.', keywords: 'text paragraph 본문 문단', icon: 'T' },
    { id: 'heading1', label: '제목 1', description: '가장 큰 제목을 추가합니다.', keywords: 'h1 heading title 제목', icon: 'H1' },
    { id: 'heading2', label: '제목 2', description: '중간 제목을 추가합니다.', keywords: 'h2 heading title 제목', icon: 'H2' },
    { id: 'heading3', label: '제목 3', description: '작은 제목을 추가합니다.', keywords: 'h3 heading title 제목', icon: 'H3' },
    { id: 'bulletList', label: '글머리 목록', description: '순서 없는 목록을 만듭니다.', keywords: 'bullet list ul 목록', icon: '•' },
    { id: 'orderedList', label: '번호 목록', description: '순서 있는 목록을 만듭니다.', keywords: 'number ordered list ol 목록', icon: '1.' },
    { id: 'blockquote', label: '인용', description: '인용문 블록을 추가합니다.', keywords: 'quote blockquote 인용', icon: '“' },
    { id: 'codeBlock', label: '코드 블록', description: '코드 내용을 작성합니다.', keywords: 'code pre 코드', icon: '</>' },
    { id: 'horizontalRule', label: '구분선', description: '내용 사이에 구분선을 추가합니다.', keywords: 'divider horizontal rule hr 구분선', icon: '—' },
    { id: 'image', label: '이미지', description: '이미지를 업로드해 추가합니다.', keywords: 'image photo upload 이미지 사진', icon: '▧' },
];

let imageUploadSequence = 0;
let clipboardMarkerSequence = 0;

const createImageUploadId = () => {
    imageUploadSequence += 1;
    return `rich-text-image-${Date.now()}-${imageUploadSequence}`;
};

const createClipboardImageMarker = (index: number) => {
    clipboardMarkerSequence += 1;
    return `\ue000rte-image-${Date.now()}-${clipboardMarkerSequence}-${index}\ue001`;
};

const RichTextImageUploadPlaceholder = Extension.create({
    name: 'richTextImageUploadPlaceholder',

    addProseMirrorPlugins() {
        return [
            new Plugin<DecorationSet>({
                key: IMAGE_UPLOAD_PLACEHOLDER_KEY,
                state: {
                    init: () => DecorationSet.empty,
                    apply: (transaction, decorations) => {
                        let nextDecorations = decorations.map(transaction.mapping, transaction.doc);
                        const meta = transaction.getMeta(IMAGE_UPLOAD_PLACEHOLDER_KEY) as
                            | ImageUploadPlaceholderMeta
                            | undefined;

                        if (meta?.removeIds?.length) {
                            const removeIds = new Set(meta.removeIds);
                            nextDecorations = nextDecorations.remove(
                                nextDecorations.find(
                                    undefined,
                                    undefined,
                                    (spec) => typeof spec.id === 'string' && removeIds.has(spec.id)
                                )
                            );
                        }

                        if (meta?.add?.length) {
                            const uploadDecorations = meta.add.map((placeholder) =>
                                Decoration.widget(
                                    Math.min(placeholder.position, transaction.doc.content.size),
                                    () => {
                                        const element = document.createElement('span');
                                        element.className = styles.UploadPlaceholder;
                                        element.setAttribute('role', 'status');
                                        element.setAttribute('aria-label', placeholder.label);
                                        element.innerHTML = '<span aria-hidden="true"></span><span>이미지 업로드 중</span>';
                                        return element;
                                    },
                                    {
                                        id: placeholder.id,
                                        side: placeholder.order + 1,
                                    }
                                )
                            );
                            nextDecorations = nextDecorations.add(transaction.doc, uploadDecorations);
                        }

                        return nextDecorations;
                    },
                },
                props: {
                    decorations: (state) => IMAGE_UPLOAD_PLACEHOLDER_KEY.getState(state) ?? null,
                },
            }),
        ];
    },
});

export type RichTextEditorUploadedImage = {
    src: string;
    alt?: string;
    fileUUID?: string;
};

export type RichTextEditorExternalImageSource = {
    src: string;
    alt?: string;
};

export type RichTextEditorProps = {
    value: string;
    onChange: (nextValue: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    minHeight?: number;
    maxHeight?: number;
    maxTextLength?: number;
    showCounter?: boolean;
    onUploadImages?: (files: File[]) => Promise<RichTextEditorUploadedImage[]>;
    onResolveExternalImage?: (source: RichTextEditorExternalImageSource, index: number) => Promise<File>;
    onUploadStateChange?: (isUploading: boolean) => void;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
    ariaInvalid?: boolean;
};

const getSelectionTextLength = (from: number, to: number, doc: { textBetween: (from: number, to: number) => string }) =>
    Math.max(0, doc.textBetween(from, to).length);

const clampImageWidthPercent = (value: number) =>
    Math.min(MAX_IMAGE_WIDTH_PERCENT, Math.max(MIN_IMAGE_WIDTH_PERCENT, Math.round(value)));

const getValidImageWidthPercent = (value?: string | number | null) => {
    const parsedValue = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
    if (!Number.isFinite(parsedValue)) return String(MAX_IMAGE_WIDTH_PERCENT);

    return String(clampImageWidthPercent(parsedValue));
};

const getStyleImageWidthPercent = (style?: string | null) => {
    const match = String(style ?? '').match(/(?:^|;)\s*width\s*:\s*([0-9]+(?:\.[0-9]+)?)%\s*(?:;|$)/i);
    return match?.[1] ?? null;
};

const getImageWidthPercentFromElement = (element: HTMLElement) =>
    getValidImageWidthPercent(element.getAttribute('data-width') ?? getStyleImageWidthPercent(element.getAttribute('style')));

const RichTextImageNodeView: React.FC<ReactNodeViewProps<HTMLDivElement>> = ({
    editor,
    node,
    selected,
    updateAttributes,
}) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const widthPercent = getValidImageWidthPercent(node.attrs.widthPercent);

    const handleResizePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!editor.isEditable) return;

        const wrapperElement = wrapperRef.current;
        const parentElement = wrapperElement?.parentElement;
        if (!wrapperElement || !parentElement) return;

        event.preventDefault();
        event.stopPropagation();

        const parentRect = parentElement.getBoundingClientRect();
        const parentStyle = window.getComputedStyle(parentElement);
        const parentPaddingLeft = Number.parseFloat(parentStyle.paddingLeft) || 0;
        const parentPaddingRight = Number.parseFloat(parentStyle.paddingRight) || 0;
        const resizeAreaLeft = parentRect.left + parentPaddingLeft;
        const resizeAreaWidth = parentRect.width - parentPaddingLeft - parentPaddingRight;
        if (resizeAreaWidth <= 0) return;

        const previousCursor = document.body.style.cursor;
        const previousUserSelect = document.body.style.userSelect;
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        setIsResizing(true);

        let lastWidthPercent = widthPercent;
        const updateWidth = (clientX: number) => {
            const nextWidthPercent = getValidImageWidthPercent(((clientX - resizeAreaLeft) / resizeAreaWidth) * 100);
            if (nextWidthPercent === lastWidthPercent) return;

            lastWidthPercent = nextWidthPercent;
            updateAttributes({
                widthPercent: nextWidthPercent,
            });
        };

        const handlePointerMove = (moveEvent: PointerEvent) => {
            moveEvent.preventDefault();
            updateWidth(moveEvent.clientX);
        };

        const finishResize = (clientX?: number) => {
            if (typeof clientX === 'number') {
                updateWidth(clientX);
            }
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
            document.removeEventListener('pointercancel', handlePointerCancel);
            document.body.style.cursor = previousCursor;
            document.body.style.userSelect = previousUserSelect;
            setIsResizing(false);
        };

        const handlePointerUp = (upEvent: PointerEvent) => {
            finishResize(upEvent.clientX);
        };

        const handlePointerCancel = () => {
            finishResize();
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointercancel', handlePointerCancel);
    };

    return (
        <NodeViewWrapper
            ref={wrapperRef}
            as="div"
            className={classNames(
                styles.ImageNode,
                selected && styles.ImageNodeSelected,
                isResizing && styles.ImageNodeResizing
            )}
            style={{ width: `${widthPercent}%` }}
            data-width={widthPercent}
        >
            <img
                src={node.attrs.src}
                alt={node.attrs.alt ?? ''}
                data-file-uuid={node.attrs.fileUUID ?? undefined}
                draggable={false}
            />
            {editor.isEditable && (selected || isResizing) ? (
                <button
                    type="button"
                    className={styles.ImageResizeHandle}
                    aria-label="이미지 크기 조절"
                    onPointerDown={handleResizePointerDown}
                />
            ) : null}
        </NodeViewWrapper>
    );
};

const RichTextImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fileUUID: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-file-uuid'),
                renderHTML: (attributes) => {
                    if (!attributes.fileUUID) return {};
                    return { 'data-file-uuid': attributes.fileUUID };
                },
            },
            widthPercent: {
                default: '100',
                parseHTML: (element) => getImageWidthPercentFromElement(element),
                renderHTML: (attributes) => {
                    const widthPercent = getValidImageWidthPercent(attributes.widthPercent);
                    return {
                        'data-width': widthPercent,
                        style: `width: ${widthPercent}%;`,
                    };
                },
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(RichTextImageNodeView);
    },
});

const RichTextHighlight = Mark.create({
    name: 'highlight',

    parseHTML() {
        return [{ tag: 'mark' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['mark', HTMLAttributes, 0];
    },
});

const RichTextTable = TipTapNode.create({
    name: 'table',
    group: 'block',
    content: 'tableRow+',
    isolating: true,
    parseHTML: () => [{ tag: 'table' }],
    renderHTML: () => ['table', ['tbody', 0]],
});

const RichTextTableRow = TipTapNode.create({
    name: 'tableRow',
    content: '(tableHeader | tableCell)+',
    parseHTML: () => [{ tag: 'tr' }],
    renderHTML: () => ['tr', 0],
});

const RichTextTableHeader = TipTapNode.create({
    name: 'tableHeader',
    content: 'block+',
    isolating: true,
    parseHTML: () => [{ tag: 'th' }],
    renderHTML: () => ['th', 0],
});

const RichTextTableCell = TipTapNode.create({
    name: 'tableCell',
    content: 'block+',
    isolating: true,
    parseHTML: () => [{ tag: 'td' }],
    renderHTML: () => ['td', 0],
});

const IMAGE_FILE_NAME_PATTERN = /\.(?:avif|bmp|gif|jpe?g|png|svg|webp)(?:$|[?#])/i;

const isImageFile = (file: File) =>
    file.type.startsWith('image/') || IMAGE_FILE_NAME_PATTERN.test(file.name);

const getTransferredImageFiles = (dataTransfer?: DataTransfer | null) => {
    if (!dataTransfer) return [];

    const itemFiles = Array.from(dataTransfer.items ?? [])
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFile())
        .filter((file): file is File => file !== null && isImageFile(file));

    if (itemFiles.length > 0) return itemFiles;

    return Array.from(dataTransfer.files ?? []).filter(isImageFile);
};

const hasNotionClipboardType = (dataTransfer?: DataTransfer | null) =>
    Array.from(dataTransfer?.types ?? []).some((type) => type.toLowerCase().includes('notion'));

const getNotionClipboardCustomData = (dataTransfer?: DataTransfer | null): NotionClipboardCustomData[] =>
    Array.from(dataTransfer?.types ?? [])
        .filter((type) => type.toLowerCase().includes('notion'))
        .map((type) => ({ type, data: dataTransfer?.getData(type) ?? '' }))
        .filter(({ data }) => Boolean(data));

const hasNotionHtmlMarkers = (html: string) =>
    /(?:\bnotion[-_.]|\bdata-block-id\s*=|https?:\/\/[^\s"']*notion\.(?:so|site))/i.test(html);

const removeInvisibleClipboardContent = (root: HTMLElement) => {
    root.querySelectorAll(
        'script, style, noscript, template, [hidden], [aria-hidden="true"], [data-content-editable-void="true"]'
    ).forEach((element) => element.remove());

    root.querySelectorAll<HTMLElement>('[style]').forEach((element) => {
        const style = element.getAttribute('style') ?? '';
        if (
            /(?:^|;)\s*display\s*:\s*none\b/i.test(style)
            || /(?:^|;)\s*visibility\s*:\s*hidden\b/i.test(style)
        ) {
            element.remove();
        }
    });
};

const normalizeClipboardSelectionText = (value: string) => value
    .replace(/\r\n?/g, '\n')
    .replace(/^```[^\n]*$/gm, '')
    .replace(/^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/gm, '')
    .replace(/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/gm, '')
    .replace(/!\[[^\]]*]\([^\n)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^\n)]+\)/g, '$1')
    .replace(/^\s{0,3}(?:#{1,6}\s+|>\s?|[-+*]\s+|\d+[.)]\s+|\[[ xX]\]\s*)/gm, '')
    .replace(/[|*_~`]/g, '')
    .replace(/\s+/g, '');

const getClipboardMeaningfulLines = (value: string) => value
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(normalizeClipboardSelectionText)
    .filter(Boolean);

const getClipboardCoverageScore = (value: string) =>
    [...new Set(getClipboardMeaningfulLines(value))]
        .reduce((score, line) => score + line.length, 0);

const candidateCoversClipboardText = (candidateText: string, referenceText: string) => {
    const referenceComparable = normalizeClipboardSelectionText(referenceText);
    if (!referenceComparable) return true;

    const candidateComparable = normalizeClipboardSelectionText(candidateText);
    if (candidateComparable.includes(referenceComparable)) return true;

    let cursor = 0;
    return getClipboardMeaningfulLines(referenceText).every((line) => {
        const lineIndex = candidateComparable.indexOf(line, cursor);
        if (lineIndex < 0) return false;
        cursor = lineIndex + line.length;
        return true;
    });
};

const selectClipboardImageSource = (candidates: Array<string | null | undefined>) => {
    const normalizedCandidates = candidates
        .map((candidate) => candidate?.trim() ?? '')
        .filter(Boolean);

    return normalizedCandidates.find((candidate) => candidate.startsWith('data:image/'))
        ?? normalizedCandidates.find((candidate) => /^https:\/\//i.test(candidate))
        ?? normalizedCandidates[0]
        ?? '';
};

const getClipboardContent = (dataTransfer?: DataTransfer | null): ClipboardContent => {
    const fallbackText = dataTransfer?.getData('text/plain') ?? '';
    const html = dataTransfer?.getData('text/html') ?? '';
    const hasNotionType = hasNotionClipboardType(dataTransfer);
    if (!html || typeof window === 'undefined') {
        return {
            htmlWithImageMarkers: hasNotionType ? notionPlainTextToCanonicalHtml(fallbackText) : '',
            originalHtmlWithImageMarkers: '',
            text: fallbackText,
            imageSources: [],
            isNotionContent: hasNotionType,
        };
    }

    const parsedDocument = new window.DOMParser().parseFromString(html, 'text/html');
    const notionAttachmentCandidates = parseNotionClipboardAttachmentCandidates(
        getNotionClipboardCustomData(dataTransfer)
    );
    const allImageSources = Array.from(parsedDocument.body.querySelectorAll('img')).map((image, index) => {
        const marker = createClipboardImageMarker(index);
        const srcsetSources = (image.getAttribute('srcset') ?? '')
            .split(',')
            .map((candidate) => candidate.trim().split(/\s+/)[0]);
        const clipboardSource = selectClipboardImageSource([
            image.getAttribute('src'),
            image.getAttribute('data-src'),
            ...srcsetSources,
        ]);
        const notionAttachment = resolveNotionClipboardAttachment(
            clipboardSource,
            notionAttachmentCandidates
        );
        const source = {
            src: notionAttachment?.externalUrl || clipboardSource,
            alt: image.getAttribute('alt')?.trim() || notionAttachment?.fileName || '',
            marker,
            isNotionAttachment: /^attachment:/i.test(clipboardSource),
        };
        image.setAttribute(NOTION_CLIPBOARD_IMAGE_MARKER_ATTR, marker);
        return source;
    });
    const normalizedDocument = new window.DOMParser().parseFromString(
        parsedDocument.body.innerHTML,
        'text/html'
    );
    const didNormalizeNotionDom = normalizeNotionClipboardDom(normalizedDocument.body);
    const isNotionContent = didNormalizeNotionDom || hasNotionType || hasNotionHtmlMarkers(html);
    const originalDocument = new window.DOMParser().parseFromString(
        parsedDocument.body.innerHTML,
        'text/html'
    );
    removeInvisibleClipboardContent(originalDocument.body);
    const retainedImageMarkerSet = new Set(
        didNormalizeNotionDom
            ? Array.from(normalizedDocument.body.querySelectorAll(`img[${NOTION_CLIPBOARD_IMAGE_MARKER_ATTR}]`))
                .map((image) => image.getAttribute(NOTION_CLIPBOARD_IMAGE_MARKER_ATTR) ?? '')
                .filter(Boolean)
            : Array.from(originalDocument.body.querySelectorAll(`img[${NOTION_CLIPBOARD_IMAGE_MARKER_ATTR}]`))
                .map((image) => image.getAttribute(NOTION_CLIPBOARD_IMAGE_MARKER_ATTR) ?? '')
                .filter(Boolean)
    );
    const imageSources = allImageSources.filter(({ marker }) => retainedImageMarkerSet.has(marker));
    const replaceClipboardImagesWithMarkers = (document: Document) => {
        document.body.querySelectorAll(`img[${NOTION_CLIPBOARD_IMAGE_MARKER_ATTR}]`).forEach((image) => {
            const marker = image.getAttribute(NOTION_CLIPBOARD_IMAGE_MARKER_ATTR) ?? '';
            if (retainedImageMarkerSet.has(marker)) {
                image.replaceWith(document.createTextNode(marker));
            } else {
                image.remove();
            }
        });
    };
    replaceClipboardImagesWithMarkers(originalDocument);
    replaceClipboardImagesWithMarkers(normalizedDocument);
    const appendMissingImageMarkers = (document: Document) => {
        const documentText = document.body.textContent ?? '';
        const missingMarkers = imageSources
            .map(({ marker }) => marker)
            .filter((marker) => !documentText.includes(marker));
        if (missingMarkers.length === 0) return;

        const markerParagraph = document.createElement('p');
        markerParagraph.append(document.createTextNode(missingMarkers.join('')));
        document.body.append(markerParagraph);
    };
    appendMissingImageMarkers(originalDocument);
    appendMissingImageMarkers(normalizedDocument);
    const originalHtmlWithImageMarkers = originalDocument.body.innerHTML;
    const originalText = originalDocument.body.textContent ?? '';

    // Some Notion versions expose only a prefix in text/plain. Treat it as a
    // minimum integrity signal, not as the only authoritative source.
    const text = fallbackText || originalText;

    return {
        htmlWithImageMarkers: didNormalizeNotionDom
            ? normalizedDocument.body.innerHTML
            : originalHtmlWithImageMarkers,
        originalHtmlWithImageMarkers,
        text,
        imageSources,
        isNotionContent,
    };
};

const dataUrlToImageFile = (source: ClipboardImageSource, index: number) => {
    const match = source.src.match(/^data:(image\/[a-z0-9.+-]+)((?:;[^,]*)*),(.*)$/is);
    if (!match) throw new Error('지원하지 않는 이미지 데이터입니다.');

    const mimeType = match[1];
    const encodedData = match[3] ?? '';
    const isBase64 = /(?:^|;)base64(?:;|$)/i.test(match[2] ?? '');
    const binary = isBase64 ? window.atob(encodedData) : decodeURIComponent(encodedData);
    const bytes = new Uint8Array(binary.length);
    for (let byteIndex = 0; byteIndex < binary.length; byteIndex += 1) {
        bytes[byteIndex] = binary.charCodeAt(byteIndex);
    }

    const extension = mimeType.split('/')[1]?.replace('jpeg', 'jpg').replace(/[^a-z0-9]/gi, '') || 'png';
    return new File([bytes], source.alt || `clipboard-image-${index + 1}.${extension}`, { type: mimeType });
};

const imageSourceToFile = async (
    source: ClipboardImageSource,
    index: number,
    onResolveExternalImage?: RichTextEditorProps['onResolveExternalImage']
) => {
    if (source.src.startsWith('data:image/')) return dataUrlToImageFile(source, index);
    if (!source.src) throw new Error('이미지 주소가 없습니다.');
    if (/^attachment:/i.test(source.src)) {
        throw new Error(
            'Notion이 이미지 원본이 아닌 내부 참조만 복사했습니다. 해당 이미지를 저장한 뒤 직접 첨부해주세요.'
        );
    }

    try {
        const response = await fetch(source.src);
        if (!response.ok) throw new Error('클립보드 이미지를 읽지 못했습니다.');

        const blob = await response.blob();
        if (!blob.type.startsWith('image/')) throw new Error('지원하지 않는 이미지 형식입니다.');

        const extension = blob.type.split('/')[1]?.replace('jpeg', 'jpg').replace(/[^a-z0-9]/gi, '') || 'png';
        return new File([blob], source.alt || `clipboard-image-${index + 1}.${extension}`, { type: blob.type });
    } catch (error) {
        if (/^https:\/\//i.test(source.src) && onResolveExternalImage) {
            try {
                return await onResolveExternalImage({ src: source.src, alt: source.alt }, index);
            } catch (resolveError) {
                if (source.isNotionAttachment) {
                    throw new Error(
                        'Notion 이미지 원본에 접근할 수 없습니다. 해당 이미지를 저장한 뒤 직접 첨부해주세요.'
                    );
                }
                throw resolveError;
            }
        }
        if (source.isNotionAttachment) {
            throw new Error(
                'Notion 이미지 원본에 접근할 수 없습니다. 해당 이미지를 저장한 뒤 직접 첨부해주세요.'
            );
        }
        throw error;
    }
};

const getClipboardImageUpload = (
    dataTransfer?: DataTransfer | null,
    clipboardContent: ClipboardContent = getClipboardContent(dataTransfer),
    retainedImageSourceIndexes?: number[],
    onResolveExternalImage?: RichTextEditorProps['onResolveExternalImage']
): ClipboardImageUpload => {
    const transferredFiles = getTransferredImageFiles(dataTransfer);
    const sourceCount = clipboardContent.imageSources.length;
    const retainedSourceIndexSet = retainedImageSourceIndexes
        ? new Set(retainedImageSourceIndexes)
        : null;
    const tasks: Array<{ file: Promise<File>; sourceIndex: number | null }> = [];
    const retainedSourceIndexes = sourceCount > 0
        ? (retainedImageSourceIndexes ?? clipboardContent.imageSources.map((_source, index) => index))
        : [];
    const pairedSourceIndexes = new Set<number>();
    const filesFollowAllHtmlSources = sourceCount > 0 && transferredFiles.length === sourceCount;

    transferredFiles.forEach((file, index) => {
        const sourceIndex = sourceCount === 0
            ? null
            : filesFollowAllHtmlSources
              ? index < sourceCount ? index : null
              : retainedSourceIndexes[index] ?? null;
        if (sourceCount > 0 && (sourceIndex === null || !retainedSourceIndexes.includes(sourceIndex))) return;
        if (sourceIndex !== null) pairedSourceIndexes.add(sourceIndex);
        tasks.push({
            file: Promise.resolve(file),
            sourceIndex,
        });
    });

    clipboardContent.imageSources.forEach((source, sourceIndex) => {
        if (retainedSourceIndexSet && !retainedSourceIndexSet.has(sourceIndex)) return;
        if (!retainedSourceIndexSet && !retainedSourceIndexes.includes(sourceIndex)) return;
        if (pairedSourceIndexes.has(sourceIndex)) return;
        tasks.push({
            file: imageSourceToFile(source, sourceIndex, onResolveExternalImage),
            sourceIndex,
        });
    });

    const files = Promise.allSettled(tasks.map((task) => task.file)).then((results) => {
        const uploadedFiles: File[] = [];
        const uploadIndexes: number[] = [];
        let failedCount = 0;
        let failureMessage = '';

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                uploadedFiles.push(result.value);
                uploadIndexes.push(index);
            } else {
                failedCount += 1;
                if (!failureMessage && result.reason instanceof Error) {
                    failureMessage = result.reason.message;
                }
            }
        });

        return {
            files: uploadedFiles,
            uploadIndexes,
            failedCount,
            failureMessage: failureMessage || undefined,
        };
    });

    return {
        files,
        expectedCount: tasks.length,
        sourceIndexes: tasks.map((task) => task.sourceIndex),
    };
};

const CLIPBOARD_VOID_TAG_NAMES = new Set(['BR', 'HR']);

const truncateClipboardHtml = (
    container: HTMLElement,
    maxTextLength: number,
    imageMarkers: string[]
) => {
    const markerValues = [...imageMarkers].sort((left, right) => right.length - left.length);
    let remainingLength = Math.max(0, maxTextLength);

    const cloneWithinLimit = (node: Node): Node | null => {
        if (node.nodeType === Node.TEXT_NODE) {
            const value = node.textContent ?? '';
            let cursor = 0;
            let nextValue = '';

            while (cursor < value.length) {
                const nextMarker = markerValues
                    .map((marker) => ({ marker, index: value.indexOf(marker, cursor) }))
                    .filter(({ index }) => index >= 0)
                    .sort((left, right) => left.index - right.index)[0];
                const plainTextEnd = nextMarker?.index ?? value.length;
                const plainText = value.slice(cursor, plainTextEnd);

                if (plainText && remainingLength > 0) {
                    const keptText = plainText.slice(0, remainingLength);
                    nextValue += keptText;
                    remainingLength -= keptText.length;
                }

                if (!nextMarker) break;
                nextValue += nextMarker.marker;
                cursor = nextMarker.index + nextMarker.marker.length;
            }

            return nextValue ? container.ownerDocument.createTextNode(nextValue) : null;
        }

        if (!(node instanceof HTMLElement)) return null;

        const hadRemainingText = remainingLength > 0;
        const clone = node.cloneNode(false) as HTMLElement;
        Array.from(node.childNodes).forEach((child) => {
            const clonedChild = cloneWithinLimit(child);
            if (clonedChild) clone.appendChild(clonedChild);
        });

        if (clone.childNodes.length > 0) return clone;
        if (hadRemainingText && CLIPBOARD_VOID_TAG_NAMES.has(node.tagName)) return clone;
        return null;
    };

    const fragment = container.ownerDocument.createDocumentFragment();
    Array.from(container.childNodes).forEach((child) => {
        const clonedChild = cloneWithinLimit(child);
        if (clonedChild) fragment.appendChild(clonedChild);
    });
    container.replaceChildren(fragment);
};

const insertTransferredText = (
    view: EditorView,
    clipboardContent: ClipboardContent,
    range: { from: number; to: number },
    maxTextLength?: number
): TransferredTextInsertResult => {
    const currentLength = view.state.doc.textContent.length;
    const selectedLength = getSelectionTextLength(range.from, range.to, view.state.doc);
    const remainingLength = maxTextLength
        ? Math.max(0, maxTextLength - (currentLength - selectedLength))
        : Number.POSITIVE_INFINITY;
    const shouldUseHtml = Boolean(clipboardContent.htmlWithImageMarkers);
    const insertText = clipboardContent.text.slice(0, remainingLength);
    if (!insertText && !shouldUseHtml) {
        return { position: range.from, imagePositions: [], retainedImageSourceIndexes: [] };
    }

    const container = document.createElement('div');
    if (shouldUseHtml) {
        container.innerHTML = clipboardContent.htmlWithImageMarkers;
    } else {
        insertText.split(/\r?\n/).forEach((line) => {
            const paragraph = document.createElement('p');
            if (line) {
                paragraph.append(document.createTextNode(line));
            } else {
                paragraph.append(document.createElement('br'));
            }
            container.append(paragraph);
        });
    }

    const parser = ProseMirrorDOMParser.fromSchema(view.state.schema);
    const parseHtmlSlice = (candidateHtml: string) => {
        container.innerHTML = candidateHtml;
        return parser.parseSlice(container, { preserveWhitespace: true });
    };
    let slice = parser.parseSlice(container, { preserveWhitespace: true });
    if (shouldUseHtml) {
        const imageMarkers = clipboardContent.imageSources.map(({ marker }) => marker);
        const getParsedText = (candidateSlice = slice) => clipboardContent.imageSources.reduce(
            (textValue, source) => textValue.replaceAll(source.marker, ''),
            candidateSlice.content.textBetween(0, candidateSlice.content.size, '\n', '')
        );
        let parsedText = getParsedText();
        const originalHtml = clipboardContent.originalHtmlWithImageMarkers;
        const originalSlice = originalHtml && originalHtml !== clipboardContent.htmlWithImageMarkers
            ? parseHtmlSlice(originalHtml)
            : null;
        const originalText = originalSlice ? getParsedText(originalSlice) : '';
        const candidates = [
            { slice, text: parsedText, semantic: true },
            ...(originalSlice ? [{ slice: originalSlice, text: originalText, semantic: false }] : []),
        ]
            .filter((candidate) => candidateCoversClipboardText(candidate.text, clipboardContent.text))
            .sort((left, right) => {
                const coverageDifference = getClipboardCoverageScore(right.text)
                    - getClipboardCoverageScore(left.text);
                return coverageDifference || Number(right.semantic) - Number(left.semantic);
            });
        const bestCandidate = candidates[0];

        if (bestCandidate) {
            // text/plain can be only a prefix for large Notion selections. Treat
            // it as a lower-bound check and keep the more complete cleaned HTML.
            slice = bestCandidate.slice;
            parsedText = bestCandidate.text;
        } else if (normalizeClipboardSelectionText(clipboardContent.text)) {
            // No schema-accepted HTML candidate covered every visible text line.
            // Recover from plain text rather than silently dropping middle blocks.
            const retainedImageMarkerHtml = clipboardContent.imageSources.length > 0
                ? `<p>${clipboardContent.imageSources.map(({ marker }) => marker).join('')}</p>`
                : '';
            slice = parseHtmlSlice(
                `${notionPlainTextToCanonicalHtml(clipboardContent.text)}${retainedImageMarkerHtml}`
            );
            parsedText = getParsedText(slice);
        }

        if (Number.isFinite(remainingLength) && parsedText.length > remainingLength) {
            // Truncate only schema-accepted content, not raw Notion UI nodes,
            // while retaining supported marks and block structure.
            const canonicalContainer = document.createElement('div');
            canonicalContainer.appendChild(
                ProseMirrorDOMSerializer.fromSchema(view.state.schema).serializeFragment(slice.content)
            );
            truncateClipboardHtml(canonicalContainer, remainingLength, imageMarkers);
            slice = parser.parseSlice(canonicalContainer, { preserveWhitespace: true });
        }
    }
    if (slice.content.size === 0) {
        return { position: range.from, imagePositions: [], retainedImageSourceIndexes: [] };
    }

    const transaction = view.state.tr.replaceRange(range.from, range.to, slice);
    const mappedPosition = Math.min(transaction.mapping.map(range.to, 1), transaction.doc.content.size);
    transaction.setSelection(TextSelection.near(transaction.doc.resolve(mappedPosition), 1));

    const markerRanges = shouldUseHtml
        ? clipboardContent.imageSources.flatMap((source, sourceIndex) => {
            const ranges: Array<{ sourceIndex: number; from: number; to: number }> = [];
            transaction.doc.descendants((node, position) => {
                if (!node.isText || !node.text) return;
                const markerOffset = node.text.indexOf(source.marker);
                if (markerOffset < 0) return;
                ranges.push({
                    sourceIndex,
                    from: position + markerOffset,
                    to: position + markerOffset + source.marker.length,
                });
            });
            return ranges;
        })
        : [];
    const imagePositions: Array<number | undefined> = [];

    markerRanges.forEach((markerRange) => {
        const removedLengthBefore = markerRanges.reduce(
            (length, candidate) => candidate.from < markerRange.from ? length + (candidate.to - candidate.from) : length,
            0
        );
        imagePositions[markerRange.sourceIndex] = markerRange.from - removedLengthBefore;
    });
    [...markerRanges]
        .sort((left, right) => right.from - left.from)
        .forEach((markerRange) => transaction.delete(markerRange.from, markerRange.to));

    view.dispatch(transaction.scrollIntoView());
    return {
        position: view.state.selection.from,
        imagePositions,
        retainedImageSourceIndexes: [...new Set(markerRanges.map(({ sourceIndex }) => sourceIndex))],
    };
};

const findImageUploadPosition = (editor: Editor, placeholderId: string) =>
    IMAGE_UPLOAD_PLACEHOLDER_KEY.getState(editor.state)?.find(
        undefined,
        undefined,
        (spec) => spec.id === placeholderId
    )[0]?.from;

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder,
    className,
    disabled = false,
    minHeight = 172,
    maxHeight = 420,
    maxTextLength,
    showCounter = false,
    onUploadImages,
    onResolveExternalImage,
    onUploadStateChange,
    ariaLabel,
    ariaLabelledBy,
    ariaDescribedBy,
    ariaInvalid = false,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const pendingFileInsertPositionRef = useRef<number | null>(null);
    const onChangeRef = useRef(onChange);
    const valueRef = useRef(value);
    const activeUploadCountRef = useRef(0);
    const uploadStateNotifiedRef = useRef(false);
    const onUploadStateChangeRef = useRef(onUploadStateChange);
    const onResolveExternalImageRef = useRef(onResolveExternalImage);
    const imageUploadJobRef = useRef<(job: EditorImageUploadJob) => void>(() => undefined);
    const refreshSlashMenuRef = useRef<(currentEditor: Editor) => void>(() => undefined);
    const slashMenuKeyDownRef = useRef<(event: KeyboardEvent) => boolean>(() => false);
    const executeSlashCommandRef = useRef<(command: SlashCommand) => void>(() => undefined);
    const [isEmpty, setIsEmpty] = useState(true);
    const [textLength, setTextLength] = useState(() => getRichTextPlainText(value).length);
    const [activeUploadCount, setActiveUploadCount] = useState(0);
    const [uploadError, setUploadError] = useState('');
    const [slashMenu, setSlashMenu] = useState<SlashMenuState | null>(null);
    const normalizedInitialContent = useMemo(() => toRichTextEditorContent(value), [value]);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    useEffect(() => {
        onUploadStateChangeRef.current = onUploadStateChange;
    }, [onUploadStateChange]);

    useEffect(() => {
        onResolveExternalImageRef.current = onResolveExternalImage;
    }, [onResolveExternalImage]);

    const notifyUploadState = useCallback((isUploading: boolean) => {
        if (uploadStateNotifiedRef.current === isUploading) return;

        uploadStateNotifiedRef.current = isUploading;
        onUploadStateChangeRef.current?.(isUploading);
    }, []);

    useEffect(() => () => {
        if (!uploadStateNotifiedRef.current) return;

        uploadStateNotifiedRef.current = false;
        onUploadStateChangeRef.current?.(false);
    }, []);

    const editor = useEditor(
        {
            extensions: [
                StarterKit,
                RichTextTable,
                RichTextTableRow,
                RichTextTableHeader,
                RichTextTableCell,
                TaskList,
                TaskItem.configure({ nested: true }),
                RichTextHighlight,
                RichTextImage,
                RichTextImageUploadPlaceholder,
            ],
            content: normalizedInitialContent,
            editable: !disabled,
            editorProps: {
                attributes: {
                    class: styles.EditorSurface,
                    spellcheck: 'false',
                    autocorrect: 'off',
                    autocapitalize: 'off',
                    'data-gramm': 'false',
                },
                handleTextInput: (view, from, to, text) => {
                    if (!maxTextLength) return false;

                    const selectedLength = getSelectionTextLength(from, to, view.state.doc);
                    const currentLength = view.state.doc.textContent.length;
                    const nextLength = currentLength - selectedLength + text.length;
                    if (nextLength <= maxTextLength) return false;

                    const remainingLength = maxTextLength - (currentLength - selectedLength);
                    if (remainingLength > 0) {
                        view.dispatch(view.state.tr.insertText(text.slice(0, remainingLength), from, to));
                    }
                    return true;
                },
                handleKeyDown: (_view, event) => slashMenuKeyDownRef.current(event),
                handlePaste: (view, event) => {
                    const clipboardContent = getClipboardContent(event.clipboardData);
                    const transferredImageFiles = getTransferredImageFiles(event.clipboardData);
                    const hasClipboardImages = transferredImageFiles.length > 0 || clipboardContent.imageSources.length > 0;
                    const hasClipboardHtml = Boolean(clipboardContent.htmlWithImageMarkers);

                    // Current Notion payloads do not always expose a Notion MIME
                    // type or legacy notion-* classes. Run every rich HTML paste
                    // through the same integrity-checked insertion path.
                    if (hasClipboardImages || clipboardContent.isNotionContent || hasClipboardHtml) {
                        event.preventDefault();
                        const { from, to } = view.state.selection;
                        const insertResult = insertTransferredText(
                            view,
                            clipboardContent,
                            { from, to },
                            maxTextLength
                        );

                        if (!hasClipboardImages) return true;

                        if (activeUploadCountRef.current > 0) {
                            setUploadError('이미지를 업로드하고 있습니다. 완료된 뒤 다시 첨부해주세요.');
                            return true;
                        }

                        const upload = getClipboardImageUpload(
                            event.clipboardData,
                            clipboardContent,
                            insertResult.retainedImageSourceIndexes,
                            onResolveExternalImageRef.current
                        );
                        if (upload.expectedCount > 0) {
                            imageUploadJobRef.current({
                                files: upload.files,
                                expectedCount: upload.expectedCount,
                                position: insertResult.position,
                                positions: upload.sourceIndexes.map((sourceIndex) => sourceIndex == null
                                    ? insertResult.position
                                    : insertResult.imagePositions[sourceIndex] ?? insertResult.position),
                            });
                        }
                        return true;
                    }

                    if (!maxTextLength) return false;

                    const pasteText = event.clipboardData?.getData('text/plain') ?? '';
                    if (!pasteText) return false;

                    const { from, to } = view.state.selection;
                    const selectedLength = getSelectionTextLength(from, to, view.state.doc);
                    const currentLength = view.state.doc.textContent.length;
                    const remainingLength = maxTextLength - (currentLength - selectedLength);

                    if (pasteText.length <= remainingLength) return false;

                    event.preventDefault();
                    if (remainingLength > 0) {
                        view.dispatch(view.state.tr.insertText(pasteText.slice(0, remainingLength), from, to));
                    }
                    return true;
                },
                handleDrop: (view, event, _slice, moved) => {
                    if (moved) return false;

                    const clipboardContent = getClipboardContent(event.dataTransfer);
                    const transferredImageFiles = getTransferredImageFiles(event.dataTransfer);
                    const hasDroppedImages = transferredImageFiles.length > 0 || clipboardContent.imageSources.length > 0;
                    if (!hasDroppedImages) return false;

                    event.preventDefault();
                    const dropPosition = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos
                        ?? view.state.selection.from;
                    const insertResult = insertTransferredText(
                        view,
                        clipboardContent,
                        { from: dropPosition, to: dropPosition },
                        maxTextLength
                    );

                    if (activeUploadCountRef.current > 0) {
                        setUploadError('이미지를 업로드하고 있습니다. 완료된 뒤 다시 첨부해주세요.');
                        return true;
                    }

                    const upload = getClipboardImageUpload(
                        event.dataTransfer,
                        clipboardContent,
                        insertResult.retainedImageSourceIndexes,
                        onResolveExternalImageRef.current
                    );
                    if (upload.expectedCount > 0) {
                        imageUploadJobRef.current({
                            files: upload.files,
                            expectedCount: upload.expectedCount,
                            position: insertResult.position,
                            positions: upload.sourceIndexes.map((sourceIndex) => sourceIndex == null
                                ? insertResult.position
                                : insertResult.imagePositions[sourceIndex] ?? insertResult.position),
                        });
                    }
                    return true;
                },
            },
            onUpdate: ({ editor: ed }) => {
                const html = ed.getHTML();
                if (html !== valueRef.current) {
                    onChangeRef.current(html);
                }
                setIsEmpty(isRichTextEmpty(html));
                setTextLength(ed.getText().length);
            },
            onCreate: ({ editor: ed }) => {
                const html = ed.getHTML();
                setIsEmpty(isRichTextEmpty(html));
                setTextLength(ed.getText().length);
            },
            onTransaction: ({ editor: ed }) => {
                refreshSlashMenuRef.current(ed);
            },
            onBlur: () => {
                window.requestAnimationFrame(() => {
                    if (!document.activeElement?.closest('[data-rich-text-slash-menu="true"]')) {
                        setSlashMenu(null);
                    }
                });
            },
        },
        [maxTextLength]
    );

    useEffect(() => {
        if (!editor) return;

        editor.setEditable(!disabled);
    }, [disabled, editor]);

    useEffect(() => {
        if (!editor) return;

        const editorElement = editor.view.dom;
        const syncAttribute = (name: string, attributeValue?: string) => {
            if (attributeValue) {
                editorElement.setAttribute(name, attributeValue);
                return;
            }
            editorElement.removeAttribute(name);
        };

        editorElement.setAttribute('role', 'textbox');
        editorElement.setAttribute('aria-multiline', 'true');
        syncAttribute('aria-label', ariaLabel);
        syncAttribute('aria-labelledby', ariaLabelledBy);
        syncAttribute('aria-describedby', ariaDescribedBy);
        editorElement.setAttribute('aria-invalid', ariaInvalid ? 'true' : 'false');
    }, [ariaDescribedBy, ariaInvalid, ariaLabel, ariaLabelledBy, editor]);

    useEffect(() => {
        if (!editor) return;

        const nextContent = toRichTextEditorContent(value);
        if (nextContent !== editor.getHTML()) {
            editor.commands.setContent(nextContent, { emitUpdate: false });
            setIsEmpty(isRichTextEmpty(nextContent));
            setTextLength(editor.getText().length);
        }
    }, [editor, value]);

    const refreshSlashMenu = useCallback((currentEditor: Editor) => {
        const { selection } = currentEditor.state;
        const { $from } = selection;
        if (
            disabled
            || !currentEditor.isEditable
            || !currentEditor.isFocused
            || !selection.empty
            || !$from.parent.isTextblock
            || $from.parent.type.spec.code
        ) {
            setSlashMenu(null);
            return;
        }

        const textBeforeCursor = $from.parent.textBetween(0, $from.parentOffset, undefined, '\ufffc');
        const match = textBeforeCursor.match(/(?:^|\s)\/([\p{L}\p{N}_-]*)$/u);
        if (!match) {
            setSlashMenu(null);
            return;
        }

        const query = (match[1] ?? '').toLocaleLowerCase();
        const commands = SLASH_COMMANDS.filter((command) =>
            (command.id !== 'image' || Boolean(onUploadImages))
            && `${command.label} ${command.keywords}`.toLocaleLowerCase().includes(query));
        if (commands.length === 0) {
            setSlashMenu(null);
            return;
        }

        const coordinates = currentEditor.view.coordsAtPos(selection.from);
        const menuWidth = 304;
        const estimatedMenuHeight = Math.min(392, commands.length * 58 + 16);
        const left = Math.max(8, Math.min(coordinates.left, window.innerWidth - menuWidth - 8));
        const top = coordinates.bottom + estimatedMenuHeight + 12 > window.innerHeight
            ? Math.max(8, coordinates.top - estimatedMenuHeight - 8)
            : coordinates.bottom + 8;

        setSlashMenu({
            from: selection.from - query.length - 1,
            to: selection.from,
            left,
            top,
            selectedIndex: 0,
            commands,
        });
    }, [disabled, onUploadImages]);

    useEffect(() => {
        refreshSlashMenuRef.current = refreshSlashMenu;
        return () => {
            refreshSlashMenuRef.current = () => undefined;
        };
    }, [refreshSlashMenu]);

    useEffect(() => {
        if (!editor || !slashMenu) return;

        const refreshPosition = () => refreshSlashMenu(editor);
        window.addEventListener('resize', refreshPosition);
        window.addEventListener('scroll', refreshPosition, true);
        return () => {
            window.removeEventListener('resize', refreshPosition);
            window.removeEventListener('scroll', refreshPosition, true);
        };
    }, [editor, refreshSlashMenu, slashMenu]);

    const executeSlashCommand = useCallback((command: SlashCommand) => {
        if (!editor || !slashMenu || disabled) return;

        const deleteTrigger = () => editor.chain().focus().deleteRange({
            from: slashMenu.from,
            to: slashMenu.to,
        });

        setSlashMenu(null);
        switch (command.id) {
            case 'paragraph':
                deleteTrigger().setParagraph().run();
                break;
            case 'heading1':
                deleteTrigger().setHeading({ level: 1 }).run();
                break;
            case 'heading2':
                deleteTrigger().setHeading({ level: 2 }).run();
                break;
            case 'heading3':
                deleteTrigger().setHeading({ level: 3 }).run();
                break;
            case 'bulletList':
                deleteTrigger().toggleBulletList().run();
                break;
            case 'orderedList':
                deleteTrigger().toggleOrderedList().run();
                break;
            case 'blockquote':
                deleteTrigger().setBlockquote().run();
                break;
            case 'codeBlock':
                deleteTrigger().setCodeBlock().run();
                break;
            case 'horizontalRule':
                deleteTrigger().setHorizontalRule().run();
                break;
            case 'image':
                deleteTrigger().run();
                if (!onUploadImages) {
                    setUploadError('이 입력란에서는 이미지 업로드를 사용할 수 없습니다.');
                    break;
                }
                if (activeUploadCountRef.current > 0) {
                    setUploadError('이미지를 업로드하고 있습니다. 완료된 뒤 다시 첨부해주세요.');
                    break;
                }
                pendingFileInsertPositionRef.current = editor.state.selection.from;
                fileInputRef.current?.click();
                break;
            default:
                break;
        }
    }, [disabled, editor, onUploadImages, slashMenu]);

    useEffect(() => {
        executeSlashCommandRef.current = executeSlashCommand;
        slashMenuKeyDownRef.current = (event) => {
            if (!slashMenu) return false;

            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                const direction = event.key === 'ArrowDown' ? 1 : -1;
                setSlashMenu((currentMenu) => {
                    if (!currentMenu) return null;
                    const commandCount = currentMenu.commands.length;
                    return {
                        ...currentMenu,
                        selectedIndex: (currentMenu.selectedIndex + direction + commandCount) % commandCount,
                    };
                });
                return true;
            }

            if (event.key === 'Enter' || event.key === 'Tab') {
                event.preventDefault();
                const command = slashMenu.commands[slashMenu.selectedIndex];
                if (command) executeSlashCommandRef.current(command);
                return true;
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                setSlashMenu(null);
                return true;
            }

            return false;
        };

        return () => {
            executeSlashCommandRef.current = () => undefined;
            slashMenuKeyDownRef.current = () => false;
        };
    }, [executeSlashCommand, slashMenu]);

    const handleAddBlock = useCallback(() => {
        if (!editor || disabled || (maxTextLength && textLength >= maxTextLength)) return;

        editor.chain()
            .focus('end')
            .insertContentAt(editor.state.doc.content.size, {
                type: 'paragraph',
                content: [{ type: 'text', text: '/' }],
            })
            .run();
        window.requestAnimationFrame(() => {
            if (!editor.isDestroyed) refreshSlashMenu(editor);
        });
    }, [disabled, editor, maxTextLength, refreshSlashMenu, textLength]);

    const runImageUpload = useCallback(async (job: EditorImageUploadJob) => {
        if (!editor || editor.isDestroyed || disabled) return;
        if (activeUploadCountRef.current > 0) {
            setUploadError('이미지를 업로드하고 있습니다. 완료된 뒤 다시 첨부해주세요.');
            return;
        }
        if (!onUploadImages) {
            setUploadError('이 입력란에서는 이미지 업로드를 사용할 수 없습니다.');
            return;
        }

        const placeholderIds = Array.from({ length: job.expectedCount }, createImageUploadId);
        const placeholders = placeholderIds.map((id, order) => ({
            id,
            position: job.positions?.[order] ?? job.position,
            label: `${order + 1}번째 이미지 업로드 중`,
            order,
        }));

        activeUploadCountRef.current = job.expectedCount;
        notifyUploadState(true);
        setActiveUploadCount(job.expectedCount);
        setUploadError('');
        editor.view.dispatch(
            editor.state.tr.setMeta(IMAGE_UPLOAD_PLACEHOLDER_KEY, {
                add: placeholders,
            } satisfies ImageUploadPlaceholderMeta)
        );

        try {
            const resolvedFiles = await job.files;
            if (editor.isDestroyed) return;

            const files = Array.isArray(resolvedFiles) ? resolvedFiles : resolvedFiles.files;
            const uploadIndexes = Array.isArray(resolvedFiles)
                ? resolvedFiles.map((_, index) => index)
                : resolvedFiles.uploadIndexes;
            const sourceFailureCount = Array.isArray(resolvedFiles) ? 0 : resolvedFiles.failedCount;
            if (files.length === 0) {
                throw new Error(
                    Array.isArray(resolvedFiles)
                        ? '클립보드 이미지를 가져오지 못했습니다. 이미지를 저장한 뒤 다시 첨부해주세요.'
                        : resolvedFiles.failureMessage
                            || '클립보드 이미지를 가져오지 못했습니다. 이미지를 저장한 뒤 다시 첨부해주세요.'
                );
            }

            const uploadedImages = await onUploadImages(files);
            if (editor.isDestroyed) return;

            let insertedCount = 0;
            (uploadedImages ?? []).forEach((image, uploadIndex) => {
                const placeholderId = placeholderIds[uploadIndexes[uploadIndex] ?? uploadIndex];
                const insertPosition = placeholderId
                    ? findImageUploadPosition(editor, placeholderId)
                    : undefined;
                const hasPersistentSource = Boolean(image.src)
                    && (/^(https?:)?\/\//i.test(image.src) || image.src.startsWith('/'));
                if (typeof insertPosition !== 'number' || !hasPersistentSource) return;

                const inserted = editor.commands.insertContentAt(insertPosition, {
                    type: 'image',
                    attrs: {
                        src: image.src,
                        alt: image.alt,
                        fileUUID: image.fileUUID,
                        widthPercent: '100',
                    },
                }, { updateSelection: false });
                if (inserted) insertedCount += 1;
            });
            if (insertedCount === 0) throw new Error('업로드된 이미지 주소를 확인하지 못했습니다.');

            const failedCount = sourceFailureCount + Math.max(0, files.length - insertedCount);
            if (failedCount > 0) {
                const failureReason = Array.isArray(resolvedFiles) ? '' : resolvedFiles.failureMessage;
                setUploadError(
                    failureReason
                        ? `${failedCount}개 이미지를 첨부하지 못했습니다. ${failureReason}`
                        : `${failedCount}개 이미지를 첨부하지 못했습니다. 이미지를 저장한 뒤 다시 시도해주세요.`
                );
            } else if (job.warning) {
                setUploadError(job.warning);
            }
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : '이미지 업로드에 실패했습니다.');
        } finally {
            if (!editor.isDestroyed) {
                editor.view.dispatch(
                    editor.state.tr.setMeta(IMAGE_UPLOAD_PLACEHOLDER_KEY, {
                        removeIds: placeholderIds,
                    } satisfies ImageUploadPlaceholderMeta)
                );
            }
            activeUploadCountRef.current = 0;
            notifyUploadState(false);
            setActiveUploadCount(0);
        }
    }, [disabled, editor, notifyUploadState, onUploadImages]);

    useEffect(() => {
        imageUploadJobRef.current = (job) => {
            void runImageUpload(job);
        };

        return () => {
            imageUploadJobRef.current = () => undefined;
        };
    }, [runImageUpload]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!editor || !onUploadImages || disabled) return;

        const files = event.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        event.target.value = '';
        imageUploadJobRef.current({
            files: fileArray,
            expectedCount: fileArray.length,
            position: pendingFileInsertPositionRef.current ?? editor.state.selection.from,
        });
        pendingFileInsertPositionRef.current = null;
    };

    const rootStyle = {
        '--rich-text-editor-min-height': `${minHeight}px`,
        '--rich-text-editor-max-height': `${maxHeight}px`,
    } as CSSProperties;

    if (!editor) {
        return <div className={classNames(styles.Loading, className)}>로딩 중...</div>;
    }

    const canUploadImage = Boolean(onUploadImages) && !disabled && activeUploadCount === 0;
    const isLengthOver = Boolean(maxTextLength && textLength >= maxTextLength);

    return (
        <div className={classNames(styles.Root, className)} data-disabled={disabled ? 'true' : 'false'} style={rootStyle}>
            <div className={styles.Toolbar}>
                <button
                    type="button"
                    className={styles.ToolbarButton}
                    title="블록 추가"
                    aria-label="블록 추가"
                    onClick={handleAddBlock}
                    disabled={disabled || Boolean(maxTextLength && textLength >= maxTextLength)}
                >
                    <FiPlus />
                </button>
                <span className={styles.ToolbarDivider} aria-hidden="true" />
                <button
                    type="button"
                    className={classNames(styles.ToolbarButton, editor.isActive('bold') && styles.Active)}
                    title="굵게"
                    aria-label="굵게"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled}
                >
                    <FiBold />
                </button>
                <button
                    type="button"
                    className={classNames(styles.ToolbarButton, editor.isActive('italic') && styles.Active)}
                    title="기울임"
                    aria-label="기울임"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled}
                >
                    <FiItalic />
                </button>
                <span className={styles.ToolbarDivider} aria-hidden="true" />
                <button
                    type="button"
                    className={classNames(styles.ToolbarButton, editor.isActive('bulletList') && styles.Active)}
                    title="글머리 목록"
                    aria-label="글머리 목록"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={disabled}
                >
                    <FiList />
                </button>
                <button
                    type="button"
                    className={classNames(styles.ToolbarButton, editor.isActive('orderedList') && styles.Active)}
                    title="번호 목록"
                    aria-label="번호 목록"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={disabled}
                >
                    <span className={styles.OrderedIcon}>1.</span>
                </button>
                {onUploadImages ? (
                    <>
                        <span className={styles.ToolbarDivider} aria-hidden="true" />
                        <button
                            type="button"
                            className={styles.ToolbarButton}
                            title="이미지 첨부"
                            aria-label="이미지 첨부"
                            onClick={() => {
                                pendingFileInsertPositionRef.current = editor.state.selection.from;
                                fileInputRef.current?.click();
                            }}
                            disabled={!canUploadImage}
                        >
                            <FiImage />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className={styles.HiddenInput}
                            onChange={handleFileChange}
                        />
                    </>
                ) : null}
            </div>

            <BubbleMenu
                editor={editor}
                pluginKey="richTextSelectionBubbleMenu"
                className={styles.BubbleMenu}
                appendTo={() => document.body}
                options={{ strategy: 'fixed', placement: 'top', offset: 8 }}
                shouldShow={({ editor: currentEditor, state }) =>
                    !disabled
                    && currentEditor.isEditable
                    && !state.selection.empty
                    && !currentEditor.isActive('image')
                }
                onMouseDown={(event) => event.preventDefault()}
            >
                <button
                    type="button"
                    className={classNames(editor.isActive('bold') && styles.Active)}
                    title="굵게"
                    aria-label="굵게"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <FiBold />
                </button>
                <button
                    type="button"
                    className={classNames(editor.isActive('italic') && styles.Active)}
                    title="기울임"
                    aria-label="기울임"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <FiItalic />
                </button>
                <button
                    type="button"
                    className={classNames(editor.isActive('code') && styles.Active)}
                    title="인라인 코드"
                    aria-label="인라인 코드"
                    onClick={() => editor.chain().focus().toggleCode().run()}
                >
                    <FiCode />
                </button>
            </BubbleMenu>

            {activeUploadCount > 0 || uploadError ? (
                <div
                    className={classNames(styles.UploadStatus, uploadError && styles.UploadStatusError)}
                    role={uploadError ? 'alert' : 'status'}
                    aria-live="polite"
                >
                    {uploadError ? <FiAlertCircle aria-hidden="true" /> : <span className={styles.UploadSpinner} aria-hidden="true" />}
                    <span>
                        {uploadError || `${activeUploadCount.toLocaleString()}개 이미지를 업로드하고 있습니다.`}
                    </span>
                    {uploadError ? (
                        <button type="button" aria-label="업로드 안내 닫기" onClick={() => setUploadError('')}>
                            <FiX />
                        </button>
                    ) : null}
                </div>
            ) : null}

            <div className={styles.ContentWrap}>
                {placeholder && isEmpty && activeUploadCount === 0
                    ? <div className={styles.Placeholder}>{placeholder}</div>
                    : null}
                <EditorContent editor={editor} className={styles.Content} />
            </div>
            {showCounter && maxTextLength ? (
                <div className={styles.Footer}>
                    <span data-over={isLengthOver ? 'true' : 'false'}>
                        {textLength.toLocaleString()} / {maxTextLength.toLocaleString()}
                    </span>
                </div>
            ) : null}
            {slashMenu && typeof document !== 'undefined'
                ? createPortal(
                    <div
                        className={styles.SlashMenu}
                        data-rich-text-slash-menu="true"
                        role="listbox"
                        aria-label="블록 유형 선택"
                        style={{ left: slashMenu.left, top: slashMenu.top }}
                        onMouseDown={(event) => event.preventDefault()}
                    >
                        <div className={styles.SlashMenuTitle}>기본 블록</div>
                        {slashMenu.commands.map((command, index) => (
                            <button
                                key={command.id}
                                type="button"
                                role="option"
                                aria-selected={index === slashMenu.selectedIndex}
                                className={classNames(index === slashMenu.selectedIndex && styles.SlashMenuItemActive)}
                                onMouseEnter={() => {
                                    setSlashMenu((currentMenu) => currentMenu
                                        ? { ...currentMenu, selectedIndex: index }
                                        : null);
                                }}
                                onClick={() => executeSlashCommand(command)}
                            >
                                <span className={styles.SlashMenuIcon} aria-hidden="true">{command.icon}</span>
                                <span className={styles.SlashMenuCopy}>
                                    <strong>{command.label}</strong>
                                    <small>{command.description}</small>
                                </span>
                            </button>
                        ))}
                    </div>,
                    document.body
                )
                : null}
        </div>
    );
};

export default RichTextEditor;
