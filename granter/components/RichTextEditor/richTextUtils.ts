const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;
const RICH_TEXT_LINE_BREAK_PATTERN = /<br\s*\/?>/gi;
const RICH_TEXT_BLOCK_END_PATTERN = /<\/(?:p|li|blockquote|h[1-3]|pre)>/gi;
const EMPTY_RICH_TEXT_VALUES = new Set(['', '<p></p>', '<p><br></p>']);

const ALLOWED_RICH_TEXT_TAGS = new Set([
    'p',
    'br',
    'strong',
    'b',
    'em',
    'i',
    'a',
    'u',
    's',
    'mark',
    'ul',
    'ol',
    'li',
    'blockquote',
    'h1',
    'h2',
    'h3',
    'hr',
    'code',
    'pre',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'img',
]);

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const isSafeImageSrc = (value: string) =>
    /^(https?:)?\/\//i.test(value) || value.startsWith('/');

const isSafeLinkHref = (value: string) => {
    const href = value.trim();
    if (!href) return false;

    return /^https?:\/\//i.test(href)
        || (href.startsWith('/') && !href.startsWith('//'));
};

const clampImageWidthPercent = (value: number) =>
    Math.min(100, Math.max(20, Math.round(value)));

const getValidImageWidth = (value?: string | null) => {
    const parsedValue = Number.parseFloat(String(value ?? ''));
    if (!Number.isFinite(parsedValue)) return '100';

    return String(clampImageWidthPercent(parsedValue));
};

const getStyleImageWidth = (style?: string | null) => {
    const match = String(style ?? '').match(/(?:^|;)\s*width\s*:\s*([0-9]+(?:\.[0-9]+)?)%\s*(?:;|$)/i);
    return match?.[1] ?? null;
};

export const isRichTextHtml = (value?: string | null) => HTML_TAG_PATTERN.test(String(value ?? '').trim());

export const toRichTextEditorContent = (value?: string | null) => {
    const text = String(value ?? '').trim();
    if (!text) return '';
    if (isRichTextHtml(text)) return text;

    return text
        .split(/\r?\n/)
        .map((line) => `<p>${line.trim() ? escapeHtml(line) : '<br>'}</p>`)
        .join('');
};

export const getRichTextPlainText = (value?: string | null) => {
    const text = String(value ?? '').trim();
    if (!text) return '';
    if (!isRichTextHtml(text)) return text;

    const textWithBlockSeparators = text
        .replace(RICH_TEXT_LINE_BREAK_PATTERN, '\n')
        .replace(RICH_TEXT_BLOCK_END_PATTERN, (closingTag) => `${closingTag}\n`);

    if (typeof window === 'undefined' || typeof window.DOMParser !== 'function') {
        return textWithBlockSeparators.replace(/<[^>]*>/g, '').trim();
    }

    const doc = new window.DOMParser().parseFromString(textWithBlockSeparators, 'text/html');
    return doc.body.textContent?.trim() ?? '';
};

export const isRichTextEmpty = (value?: string | null) => {
    const text = String(value ?? '').trim();
    if (EMPTY_RICH_TEXT_VALUES.has(text)) return true;
    if (/<img\s/i.test(text)) return false;

    return getRichTextPlainText(text).length === 0;
};

const sanitizeNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent ?? '');
    if (node.nodeType !== Node.ELEMENT_NODE) return '';

    const element = node as HTMLElement;
    const tagName = element.tagName.toLowerCase();
    const children = Array.from(element.childNodes).map(sanitizeNode).join('');

    if (!ALLOWED_RICH_TEXT_TAGS.has(tagName)) return children;

    if (tagName === 'br' || tagName === 'hr') return `<${tagName}>`;

    if (tagName === 'img') {
        const src = element.getAttribute('src') ?? '';
        if (!src || !isSafeImageSrc(src)) return '';

        const alt = element.getAttribute('alt') ?? '';
        const fileUUID = element.getAttribute('data-file-uuid') ?? '';
        const widthPercent = getValidImageWidth(element.getAttribute('data-width') ?? getStyleImageWidth(element.getAttribute('style')));
        const fileUUIDAttribute = fileUUID ? ` data-file-uuid="${escapeHtml(fileUUID)}"` : '';
        const widthAttribute = ` data-width="${widthPercent}" style="width: ${widthPercent}%;"`;
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"${fileUUIDAttribute}${widthAttribute}>`;
    }

    if (tagName === 'a') {
        const href = element.getAttribute('href') ?? '';
        if (!isSafeLinkHref(href)) return children;

        return `<a href="${escapeHtml(href.trim())}">${children}</a>`;
    }

    if (tagName === 'ul' && element.getAttribute('data-type') === 'taskList') {
        return `<ul data-type="taskList">${children}</ul>`;
    }

    if (tagName === 'li' && element.getAttribute('data-type') === 'taskItem') {
        const checked = element.getAttribute('data-checked') === 'true';
        return `<li data-type="taskItem" data-checked="${checked}">${children}</li>`;
    }

    return `<${tagName}>${children}</${tagName}>`;
};

export const sanitizeRichTextHtml = (value?: string | null) => {
    const text = String(value ?? '').trim();
    if (!text) return '';
    if (!isRichTextHtml(text)) return escapeHtml(text).replace(/\r?\n/g, '<br>');

    if (typeof window === 'undefined' || typeof window.DOMParser !== 'function') {
        return text
            .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
            .replace(/\son\w+="[^"]*"/gi, '')
            .replace(/\son\w+='[^']*'/gi, '');
    }

    const doc = new window.DOMParser().parseFromString(text, 'text/html');
    return Array.from(doc.body.childNodes).map(sanitizeNode).join('');
};

export const normalizeRichTextValue = (value?: string | null) =>
    isRichTextEmpty(value) ? '' : sanitizeRichTextHtml(value);
