export const NOTION_BLOCKS_CLIPBOARD_MIME_TYPE = 'text/_notion-blocks-v3-production';

type UnknownRecord = Record<string, unknown>;

export type NotionClipboardCustomData = {
    type: string;
    data: string;
};

export type NotionClipboardAttachmentCandidate = {
    attachmentSource: string;
    blockId: string;
    fileId: string;
    fileName: string;
    externalUrl: string;
};

const isRecord = (value: unknown): value is UnknownRecord =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const parseJson = (value: string): unknown => {
    if (!value.trim()) return null;

    try {
        return JSON.parse(value) as unknown;
    } catch {
        return null;
    }
};

const getFirstString = (value: unknown): string => {
    if (typeof value === 'string') return value.trim();
    if (Array.isArray(value)) {
        for (const child of value) {
            const result = getFirstString(child);
            if (result) return result;
        }
    }
    return '';
};

const isAttachmentSource = (value: string) => /^attachment:/i.test(value.trim());

const getAttachmentFileId = (source: string) => {
    const match = source.trim().match(/^attachment:([^:]+)(?::|$)/i);
    return match?.[1]?.trim() ?? '';
};

const getAttachmentFileName = (source: string) => {
    const separatorIndex = source.lastIndexOf(':');
    const encodedName = separatorIndex >= 0 ? source.slice(separatorIndex + 1) : '';
    if (!encodedName) return '';

    try {
        return decodeURIComponent(encodedName);
    } catch {
        return encodedName;
    }
};

const readImageValue = (candidate: UnknownRecord) => {
    if (candidate.type === 'image') return candidate;
    const value = candidate.value;
    return isRecord(value) && value.type === 'image' ? value : null;
};

const collectImageValues = (root: unknown) => {
    const imageValues: UnknownRecord[] = [];
    const visited = new WeakSet<object>();

    const walk = (value: unknown) => {
        if (typeof value !== 'object' || value === null || visited.has(value)) return;
        visited.add(value);

        if (Array.isArray(value)) {
            value.forEach(walk);
            return;
        }
        if (!isRecord(value)) return;

        const imageValue = readImageValue(value);
        if (imageValue) imageValues.push(imageValue);
        Object.values(value).forEach(walk);
    };

    walk(root);
    return imageValues;
};

type NotionPageSource = {
    id: string;
    spaceId: string;
    table: string;
};

const findPageSource = (root: unknown): NotionPageSource | null => {
    let result: NotionPageSource | null = null;
    const visited = new WeakSet<object>();

    const walk = (value: unknown) => {
        if (result || typeof value !== 'object' || value === null || visited.has(value)) return;
        visited.add(value);

        if (Array.isArray(value)) {
            value.forEach(walk);
            return;
        }
        if (!isRecord(value)) return;

        const id = typeof value.id === 'string' ? value.id.trim() : '';
        const table = typeof value.table === 'string' ? value.table.trim() : '';
        const spaceId = typeof value.spaceId === 'string' ? value.spaceId.trim() : '';
        if (id && table) {
            result = { id, table, spaceId };
            return;
        }

        Object.values(value).forEach(walk);
    };

    walk(root);
    return result;
};

const buildNotionImageProxyUrl = (
    attachmentSource: string,
    blockId: string,
    pageSource: NotionPageSource | null
) => {
    const ownerId = blockId || pageSource?.id || '';
    if (!isAttachmentSource(attachmentSource) || !ownerId) return '';

    const query = new URLSearchParams({
        table: pageSource?.table || 'block',
        id: ownerId,
        cache: 'v2',
    });
    if (pageSource?.spaceId) query.set('spaceId', pageSource.spaceId);

    return `https://www.notion.so/image/${encodeURIComponent(attachmentSource)}?${query.toString()}`;
};

export const parseNotionClipboardAttachmentCandidates = (
    customData: NotionClipboardCustomData[]
): NotionClipboardAttachmentCandidate[] => {
    const blocksEntry = customData.find(({ type }) => type.toLowerCase() === NOTION_BLOCKS_CLIPBOARD_MIME_TYPE);
    const blocksPayload = parseJson(blocksEntry?.data ?? '');
    if (!blocksPayload) return [];

    const pageSourceEntry = customData.find(({ type }) => {
        const normalizedType = type.toLowerCase();
        return normalizedType.includes('notion')
            && normalizedType.includes('page')
            && normalizedType.includes('source');
    });
    const pageSource = findPageSource(parseJson(pageSourceEntry?.data ?? ''));
    const seen = new Set<string>();

    return collectImageValues(blocksPayload).flatMap((value) => {
        const format = isRecord(value.format) ? value.format : {};
        const properties = isRecord(value.properties) ? value.properties : {};
        const attachmentSource = [
            getFirstString(format.display_source),
            getFirstString(properties.source),
        ].find(isAttachmentSource) ?? '';
        if (!attachmentSource) return [];

        const blockId = typeof value.id === 'string' ? value.id.trim() : '';
        const fileId = getFirstString(value.file_ids)
            || getFirstString(format.file_ids)
            || getAttachmentFileId(attachmentSource);
        const dedupeKey = `${blockId}\u0000${attachmentSource}`;
        if (seen.has(dedupeKey)) return [];
        seen.add(dedupeKey);

        return [{
            attachmentSource,
            blockId,
            fileId,
            fileName: getAttachmentFileName(attachmentSource),
            externalUrl: buildNotionImageProxyUrl(attachmentSource, blockId, pageSource),
        }];
    });
};

export const resolveNotionClipboardAttachment = (
    source: string,
    candidates: NotionClipboardAttachmentCandidate[]
) => {
    if (!isAttachmentSource(source)) return null;

    const normalizedSource = source.trim();
    const sourceFileId = getAttachmentFileId(normalizedSource);
    return candidates.find(({ attachmentSource }) => attachmentSource === normalizedSource)
        ?? candidates.find(({ fileId }) => Boolean(sourceFileId) && fileId === sourceFileId)
        ?? null;
};
