const NOTION_BLOCK_CLASS_TO_KIND = {
    'notion-header': 'heading1',
    'notion-sub_header': 'heading2',
    'notion-sub_sub_header': 'heading3',
    'notion-text': 'paragraph',
    'notion-bulleted_list': 'bulletListItem',
    'notion-numbered_list': 'orderedListItem',
    'notion-to_do': 'taskListItem',
    'notion-quote': 'quote',
    'notion-divider': 'divider',
    'notion-callout': 'callout',
    'notion-toggle': 'toggle',
    'notion-code': 'code',
    'notion-image': 'image',
} as const;

type NotionBlockClassName = keyof typeof NOTION_BLOCK_CLASS_TO_KIND;
type NotionBlockKind = (typeof NOTION_BLOCK_CLASS_TO_KIND)[NotionBlockClassName];
type NotionListKind = Extract<NotionBlockKind, 'bulletListItem' | 'orderedListItem' | 'taskListItem'>;

type PlainTextLine =
    | { kind: 'blank' }
    | { kind: 'heading'; level: 1 | 2 | 3; text: string }
    | { kind: 'divider' }
    | { kind: 'quote'; text: string }
    | { kind: 'paragraph'; text: string }
    | { kind: NotionListKind; text: string; indent: number; checked?: boolean };

type PlainListItem = {
    kind: NotionListKind;
    text: string;
    indent: number;
    checked?: boolean;
    children: PlainListItem[];
};

const NOTION_BLOCK_CLASSES = Object.keys(NOTION_BLOCK_CLASS_TO_KIND) as NotionBlockClassName[];
const BULLET_PREFIX_PATTERN = /^([\t ]*)(?:[-*+]|[\u2022\u25e6\u25aa\u25ab\u25cf])\s+/;
const NUMBER_PREFIX_PATTERN = /^([\t ]*)\d+[.)]\s+/;
const TASK_PREFIX_PATTERN = /^([\t ]*)(?:(?:[-*+]|[\u2022\u25e6\u25aa\u25ab\u25cf])\s+)?(?:\[([ xX])\]|([\u2610\u2611]))\s*/;
const HEADING_PREFIX_PATTERN = /^\s{0,3}(#{1,3})\s+(.+)$/;
const DIVIDER_PATTERN = /^\s*(?:---+|___+|\*\*\*+)\s*$/;
const QUOTE_PREFIX_PATTERN = /^\s*>\s?(.*)$/;
const SAFE_LINK_PATTERN = /^https?:\/\//i;

export const NOTION_CLIPBOARD_IMAGE_MARKER_ATTR = 'data-rich-text-clipboard-image-marker';

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const isSafeLinkHref = (value: string) => {
    const href = value.trim();
    return SAFE_LINK_PATTERN.test(href) || (href.startsWith('/') && !href.startsWith('//'));
};

const getMatchingNotionClass = (element: Element) =>
    NOTION_BLOCK_CLASSES.find(
        (className) => element.classList.contains(className) || element.classList.contains(`${className}-block`)
    );

const getNotionBlockKind = (element: Element): NotionBlockKind | null => {
    const notionClass = getMatchingNotionClass(element);
    return notionClass ? NOTION_BLOCK_CLASS_TO_KIND[notionClass] : null;
};

const isRecognizedNotionBlock = (element: Element | null): element is HTMLElement =>
    Boolean(element instanceof HTMLElement && element.tagName === 'DIV' && getNotionBlockKind(element));

const isPotentialNotionBlock = (element: Element | null): element is HTMLElement =>
    Boolean(
        element instanceof HTMLElement &&
        element.tagName === 'DIV' &&
        (getNotionBlockKind(element) || Array.from(element.classList).some((name) => /^notion-[\w-]+-block$/.test(name)))
    );

const findNotionBlockAncestor = (element: Element | null) => {
    let candidate = element;
    while (candidate) {
        if (isPotentialNotionBlock(candidate)) return candidate;
        candidate = candidate.parentElement;
    }
    return null;
};

const isOwnedByBlock = (element: Element, block: HTMLElement) => {
    const dataBlockOwner = element.closest<HTMLElement>('[data-block-id]');
    if (block.hasAttribute('data-block-id')) return dataBlockOwner === block;
    return findNotionBlockAncestor(element.parentElement) === block;
};

const getOwnedLeaves = (block: HTMLElement) =>
    Array.from(block.querySelectorAll<HTMLElement>('[data-content-editable-leaf="true"]'))
        .filter((leaf) => isOwnedByBlock(leaf, block));

const getOwnedImages = (block: HTMLElement) =>
    Array.from(block.querySelectorAll<HTMLImageElement>('img'))
        .filter((image) => isOwnedByBlock(image, block));

const cloneTextWithBreaks = (textNode: Text, document: Document) => {
    const fragment = document.createDocumentFragment();
    textNode.data.split('\n').forEach((value, index) => {
        if (index > 0) fragment.appendChild(document.createElement('br'));
        if (value) fragment.appendChild(document.createTextNode(value));
    });
    return fragment;
};

const wrapFragment = (fragment: DocumentFragment, tagName: string, document: Document) => {
    const wrapper = document.createElement(tagName);
    wrapper.appendChild(fragment);
    const result = document.createDocumentFragment();
    result.appendChild(wrapper);
    return result;
};

const cloneInlineNode = (node: Node, document: Document): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) return cloneTextWithBreaks(node as Text, document);
    if (!(node instanceof HTMLElement) || node.hasAttribute('data-content-editable-void')) return null;

    if (node.tagName === 'BR') return document.createElement('br');
    if (node.tagName === 'IMG') {
        const src = node.getAttribute('src')?.trim() ?? '';
        if (!src) return null;
        const image = document.createElement('img');
        image.setAttribute('src', src);
        image.setAttribute('alt', node.getAttribute('alt') ?? '');
        const clipboardMarker = node.getAttribute(NOTION_CLIPBOARD_IMAGE_MARKER_ATTR);
        if (clipboardMarker) image.setAttribute(NOTION_CLIPBOARD_IMAGE_MARKER_ATTR, clipboardMarker);
        return image;
    }

    let content = document.createDocumentFragment();
    Array.from(node.childNodes).forEach((child) => {
        const clonedChild = cloneInlineNode(child, document);
        if (clonedChild) content.appendChild(clonedChild);
    });
    if (!content.childNodes.length) return null;

    if (node.tagName === 'A') {
        const href = node.getAttribute('href')?.trim() ?? '';
        if (isSafeLinkHref(href)) {
            const link = document.createElement('a');
            link.setAttribute('href', href);
            link.appendChild(content);
            return link;
        }
    }

    const explicitTag = {
        STRONG: 'strong',
        B: 'strong',
        EM: 'em',
        I: 'em',
        U: 'u',
        S: 's',
        DEL: 's',
        MARK: 'mark',
        CODE: 'code',
    }[node.tagName];
    if (explicitTag) return wrapFragment(content, explicitTag, document);

    const style = node.getAttribute('style') ?? '';
    const wrapperTags: string[] = [];
    if (node.classList.contains('notion-inline-code-container')) wrapperTags.push('code');
    if (/font-weight\s*:\s*(?:[6-9]00|bold)/i.test(style)) wrapperTags.push('strong');
    if (/font-style\s*:\s*italic/i.test(style)) wrapperTags.push('em');
    if (/text-decoration[^:]*:[^;]*underline/i.test(style)) wrapperTags.push('u');
    if (/text-decoration[^:]*:[^;]*line-through/i.test(style)) wrapperTags.push('s');
    if (/background(?:-color)?\s*:\s*(?!(?:transparent|none)(?:\s|;|$))[^;]+/i.test(style)) {
        wrapperTags.push('mark');
    }
    wrapperTags.forEach((tagName) => {
        content = wrapFragment(content, tagName, document);
    });
    return content;
};

const getOwnedInlineContent = (block: HTMLElement) => {
    const document = block.ownerDocument;
    const fragment = document.createDocumentFragment();
    const blockKind = getNotionBlockKind(block);
    const ownedLeaves = getOwnedLeaves(block);

    ownedLeaves.forEach((leaf, leafIndex) => {
        if (leafIndex > 0) fragment.appendChild(document.createElement('br'));
        Array.from(leaf.childNodes).forEach((child) => {
            const clonedChild = cloneInlineNode(child, document);
            if (clonedChild) fragment.appendChild(clonedChild);
        });
    });

    const imagesInsideLeaves = new Set(ownedLeaves.flatMap((leaf) => Array.from(leaf.querySelectorAll('img'))));
    getOwnedImages(block)
        .filter((image) => blockKind === 'image' || !image.closest('[data-content-editable-void="true"]'))
        .filter((image) => !imagesInsideLeaves.has(image))
        .forEach((image) => {
            const clonedImage = cloneInlineNode(image, document);
            if (clonedImage) fragment.appendChild(clonedImage);
        });

    if (fragment.childNodes.length || ownedLeaves.length > 0) return fragment;

    const fallback = block.cloneNode(true) as HTMLElement;
    fallback.querySelectorAll('[data-content-editable-void="true"]').forEach((element) => element.remove());
    fallback.querySelectorAll('[data-block-id]').forEach((element) => element.remove());
    const fallbackText = fallback.textContent?.trim() ?? '';
    if (fallbackText) fragment.appendChild(document.createTextNode(fallbackText));
    return fragment;
};

const isListKind = (kind: NotionBlockKind): kind is NotionListKind =>
    kind === 'bulletListItem' || kind === 'orderedListItem' || kind === 'taskListItem';

const stripListPrefix = (fragment: DocumentFragment, kind: NotionListKind) => {
    const walker = fragment.ownerDocument.createTreeWalker(fragment, NodeFilter.SHOW_TEXT);
    const firstTextNode = walker.nextNode() as Text | null;
    if (!firstTextNode) return;

    const pattern = kind === 'taskListItem'
        ? TASK_PREFIX_PATTERN
        : kind === 'orderedListItem'
          ? NUMBER_PREFIX_PATTERN
          : BULLET_PREFIX_PATTERN;
    firstTextNode.data = firstTextNode.data.replace(pattern, '');
};

const getTaskChecked = (block: HTMLElement) => {
    const explicitValue = block.getAttribute('data-checked') ?? block.getAttribute('aria-checked');
    if (explicitValue === 'true') return true;
    if (explicitValue === 'false') return false;

    const checkedElement = block.querySelector<HTMLInputElement>('input[type="checkbox"]');
    if (checkedElement) return checkedElement.checked || checkedElement.hasAttribute('checked');
    if (block.querySelector('[aria-checked="true"]')) return true;
    return block.classList.contains('checked') || block.classList.contains('is-checked');
};

const hasOwnedMeaningfulContent = (block: HTMLElement) => {
    if (getOwnedLeaves(block).length > 0 || getOwnedImages(block).length > 0) return true;

    const fallback = block.cloneNode(true) as HTMLElement;
    fallback.querySelectorAll('[data-content-editable-void="true"]').forEach((element) => element.remove());
    fallback.querySelectorAll('[data-block-id]').forEach((element) => element.remove());
    return Boolean(fallback.textContent?.trim());
};

const isSameIdGhostBlock = (block: HTMLElement, candidate: HTMLElement) => {
    const blockId = block.dataset.blockId;
    return Boolean(
        blockId &&
        candidate.dataset.blockId === blockId &&
        !hasOwnedMeaningfulContent(candidate)
    );
};

const getDirectNotionChildren = (block: HTMLElement, notionBlocks: HTMLElement[]) =>
    notionBlocks.filter(
        (candidate) =>
            candidate !== block &&
            findNotionBlockAncestor(candidate.parentElement) === block &&
            !isSameIdGhostBlock(block, candidate)
    );

const createList = (document: Document, kind: NotionListKind) => {
    const list = document.createElement(kind === 'orderedListItem' ? 'ol' : 'ul');
    if (kind === 'taskListItem') list.setAttribute('data-type', 'taskList');
    return list;
};

const createParagraph = (content: DocumentFragment, document: Document) => {
    const paragraph = document.createElement('p');
    if (content.childNodes.length) paragraph.appendChild(content);
    else paragraph.appendChild(document.createElement('br'));
    return paragraph;
};

const renderSequence = (blocks: HTMLElement[], notionBlocks: HTMLElement[], document: Document) => {
    const fragment = document.createDocumentFragment();
    let index = 0;

    while (index < blocks.length) {
        const block = blocks[index];
        const kind = getNotionBlockKind(block);
        if (!kind) {
            const content = getOwnedInlineContent(block);
            if (content.childNodes.length) fragment.appendChild(createParagraph(content, document));
            const children = getDirectNotionChildren(block, notionBlocks);
            if (children.length) fragment.appendChild(renderSequence(children, notionBlocks, document));
            index += 1;
            continue;
        }

        if (!isListKind(kind)) {
            fragment.appendChild(renderBlock(block, kind, notionBlocks, document));
            index += 1;
            continue;
        }

        const list = createList(document, kind);
        while (index < blocks.length && getNotionBlockKind(blocks[index]) === kind) {
            const listBlock = blocks[index];
            const item = document.createElement('li');
            if (kind === 'taskListItem') {
                item.setAttribute('data-type', 'taskItem');
                item.setAttribute('data-checked', String(getTaskChecked(listBlock)));
            }

            const content = getOwnedInlineContent(listBlock);
            stripListPrefix(content, kind);
            item.appendChild(createParagraph(content, document));
            const children = getDirectNotionChildren(listBlock, notionBlocks);
            if (children.length) item.appendChild(renderSequence(children, notionBlocks, document));
            list.appendChild(item);
            index += 1;
        }
        fragment.appendChild(list);
    }

    return fragment;
};

const renderBlock = (
    block: HTMLElement,
    kind: Exclude<NotionBlockKind, NotionListKind>,
    notionBlocks: HTMLElement[],
    document: Document
) => {
    const result = document.createDocumentFragment();
    const content = getOwnedInlineContent(block);
    const children = getDirectNotionChildren(block, notionBlocks);

    if (kind === 'divider') {
        result.appendChild(document.createElement('hr'));
    } else if (kind === 'image') {
        result.appendChild(content);
    } else if (kind === 'code') {
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        const readCodeText = (node: Node): string => {
            if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
            if (node instanceof HTMLElement && node.tagName === 'BR') return '\n';
            return Array.from(node.childNodes).map(readCodeText).join('');
        };
        code.textContent = Array.from(content.childNodes).map(readCodeText).join('');
        pre.appendChild(code);
        result.appendChild(pre);
        Array.from(content.querySelectorAll('img')).forEach((image) => result.appendChild(image));
    } else if (kind === 'quote' || kind === 'callout' || kind === 'toggle') {
        if (content.childNodes.length === 0 && children.length === 0) return result;

        const quote = document.createElement('blockquote');
        if (content.childNodes.length > 0) quote.appendChild(createParagraph(content, document));
        if (children.length) quote.appendChild(renderSequence(children, notionBlocks, document));
        result.appendChild(quote);
        return result;
    } else {
        const tagName = kind === 'heading1'
            ? 'h1'
            : kind === 'heading2'
              ? 'h2'
              : kind === 'heading3'
                ? 'h3'
                : 'p';
        const element = document.createElement(tagName);
        if (content.childNodes.length) element.appendChild(content);
        else if (kind === 'paragraph') element.appendChild(document.createElement('br'));
        if (element.childNodes.length) result.appendChild(element);
    }

    if (children.length) result.appendChild(renderSequence(children, notionBlocks, document));
    return result;
};

export const hasNotionClipboardMarkers = (root: ParentNode) =>
    Array.from(root.querySelectorAll('div')).some((element) => getNotionBlockKind(element) !== null);

export const normalizeNotionClipboardDom = (root: HTMLElement) => {
    const notionBlocks = Array.from(root.querySelectorAll<HTMLElement>('div'))
        .filter(isPotentialNotionBlock);
    if (!notionBlocks.some(isRecognizedNotionBlock)) return false;

    const topLevelBlocks = notionBlocks.filter(
        (block) => findNotionBlockAncestor(block.parentElement) === null
    );
    root.replaceChildren(renderSequence(topLevelBlocks, notionBlocks, root.ownerDocument));
    return true;
};

const getIndentSize = (value: string) =>
    Array.from(value).reduce((size, character) => size + (character === '\t' ? 4 : 1), 0);

const parsePlainTextLine = (line: string): PlainTextLine => {
    if (!line.trim()) return { kind: 'blank' };

    const headingMatch = line.match(HEADING_PREFIX_PATTERN);
    if (headingMatch) {
        return {
            kind: 'heading',
            level: headingMatch[1].length as 1 | 2 | 3,
            text: headingMatch[2],
        };
    }
    if (DIVIDER_PATTERN.test(line)) return { kind: 'divider' };

    const quoteMatch = line.match(QUOTE_PREFIX_PATTERN);
    if (quoteMatch) return { kind: 'quote', text: quoteMatch[1] };

    const taskMatch = line.match(TASK_PREFIX_PATTERN);
    if (taskMatch) {
        return {
            kind: 'taskListItem',
            text: line.replace(TASK_PREFIX_PATTERN, ''),
            indent: getIndentSize(taskMatch[1]),
            checked: taskMatch[2]?.toLowerCase() === 'x' || taskMatch[3] === '\u2611',
        };
    }

    const numberMatch = line.match(NUMBER_PREFIX_PATTERN);
    if (numberMatch) {
        return {
            kind: 'orderedListItem',
            text: line.replace(NUMBER_PREFIX_PATTERN, ''),
            indent: getIndentSize(numberMatch[1]),
        };
    }

    const bulletMatch = line.match(BULLET_PREFIX_PATTERN);
    if (bulletMatch) {
        return {
            kind: 'bulletListItem',
            text: line.replace(BULLET_PREFIX_PATTERN, ''),
            indent: getIndentSize(bulletMatch[1]),
        };
    }

    return { kind: 'paragraph', text: line };
};

const renderInlineMarkdown = (value: string) => {
    const preservedTokens: string[] = [];
    const preserve = (html: string) => {
        const token = `\ue100${preservedTokens.length}\ue101`;
        preservedTokens.push(html);
        return token;
    };

    let source = value.replace(/`([^`\n]+)`/g, (_match, code: string) => preserve(`<code>${escapeHtml(code)}</code>`));
    source = source.replace(/(?<!!)\[([^\]]+)]\(([^\s)]+)\)/g, (match, label: string, href: string) =>
        isSafeLinkHref(href)
            ? preserve(`<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
            : match
    );

    let html = escapeHtml(source)
        .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
        .replace(/__([^_\n]+)__/g, '<strong>$1</strong>')
        .replace(/~~([^~\n]+)~~/g, '<s>$1</s>')
        .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    preservedTokens.forEach((tokenHtml, index) => {
        html = html.replace(`\ue100${index}\ue101`, tokenHtml);
    });
    return html;
};

const renderPlainList = (items: PlainListItem[]) => {
    const html: string[] = [];
    let index = 0;

    while (index < items.length) {
        const kind = items[index].kind;
        const listTag = kind === 'orderedListItem' ? 'ol' : 'ul';
        html.push(kind === 'taskListItem' ? '<ul data-type="taskList">' : `<${listTag}>`);

        while (index < items.length && items[index].kind === kind) {
            const item = items[index];
            const itemAttributes = kind === 'taskListItem'
                ? ` data-type="taskItem" data-checked="${String(item.checked)}"`
                : '';
            html.push(`<li${itemAttributes}><p>${renderInlineMarkdown(item.text)}</p>`);
            if (item.children.length) html.push(renderPlainList(item.children));
            html.push('</li>');
            index += 1;
        }

        html.push(`</${listTag}>`);
    }
    return html.join('');
};

const collectPlainList = (lines: PlainTextLine[], startIndex: number) => {
    const roots: PlainListItem[] = [];
    const stack: PlainListItem[] = [];
    let index = startIndex;

    while (index < lines.length && isListKind(lines[index].kind as NotionBlockKind)) {
        const line = lines[index] as Extract<PlainTextLine, { kind: NotionListKind }>;
        const item: PlainListItem = { ...line, children: [] };
        while (stack.length && stack[stack.length - 1].indent >= item.indent) stack.pop();
        if (stack.length) stack[stack.length - 1].children.push(item);
        else roots.push(item);
        stack.push(item);
        index += 1;
    }

    return { roots, nextIndex: index };
};

export const notionPlainTextToCanonicalHtml = (text: string) => {
    const rawLines = text.replace(/\r\n?/g, '\n').split('\n');
    const lines = rawLines.map(parsePlainTextLine);
    const html: string[] = [];
    let index = 0;
    let asideDepth = 0;

    const getTableCells = (line: string) => {
        const trimmed = line.trim();
        const withoutOuterPipes = trimmed
            .replace(/^\|/, '')
            .replace(/\|$/, '');
        return withoutOuterPipes.split('|').map((cell) => cell.trim());
    };
    const isTableRow = (line: string) => {
        const trimmed = line.trim();
        return trimmed.startsWith('|') && trimmed.endsWith('|') && getTableCells(trimmed).length > 1;
    };
    const isTableDelimiter = (line: string) =>
        isTableRow(line) && getTableCells(line).every((cell) => /^:?-{3,}:?$/.test(cell));
    const renderTableRow = (cells: string[], cellTag: 'th' | 'td') =>
        `<tr>${cells.map((cell) => `<${cellTag}><p>${renderInlineMarkdown(cell)}</p></${cellTag}>`).join('')}</tr>`;

    const collectQuote = (startIndex: number) => {
        const paragraphs: string[][] = [];
        let paragraphLines: string[] = [];
        let quoteIndex = startIndex;

        const flushParagraph = () => {
            if (paragraphLines.length > 0) paragraphs.push(paragraphLines);
            paragraphLines = [];
        };

        while (quoteIndex < lines.length) {
            const quoteLine = lines[quoteIndex];

            if (quoteLine.kind === 'quote') {
                if (quoteLine.text.trim()) paragraphLines.push(quoteLine.text);
                else flushParagraph();
                quoteIndex += 1;
                continue;
            }

            // CommonMark allows a paragraph immediately following `>` to
            // continue the same quote without repeating the marker. Notion
            // exposes multi-line quotes in this form in text/plain.
            if (quoteLine.kind === 'paragraph' && paragraphLines.length > 0) {
                paragraphLines.push(quoteLine.text);
                quoteIndex += 1;
                continue;
            }

            break;
        }

        flushParagraph();
        return { paragraphs, nextIndex: quoteIndex };
    };

    while (index < lines.length) {
        const originalLine = rawLines[index]?.trim() ?? '';
        const line = lines[index];

        if (/^```/.test(originalLine)) {
            const codeLines: string[] = [];
            index += 1;
            while (index < rawLines.length && !/^```\s*$/.test(rawLines[index].trim())) {
                codeLines.push(rawLines[index]);
                index += 1;
            }
            if (index < rawLines.length) index += 1;
            html.push(`<pre><code>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
            continue;
        }

        if (isTableRow(rawLines[index]) && index + 1 < rawLines.length && isTableDelimiter(rawLines[index + 1])) {
            const headerCells = getTableCells(rawLines[index]);
            const bodyRows: string[][] = [];
            index += 2;
            while (index < rawLines.length && isTableRow(rawLines[index])) {
                bodyRows.push(getTableCells(rawLines[index]));
                index += 1;
            }
            html.push(
                `<table><thead>${renderTableRow(headerCells, 'th')}</thead>`
                + `<tbody>${bodyRows.map((cells) => renderTableRow(cells, 'td')).join('')}</tbody></table>`
            );
            continue;
        }

        if (originalLine === '<aside>') {
            html.push('<blockquote>');
            asideDepth += 1;
            index += 1;
            continue;
        }
        if (originalLine === '</aside>') {
            if (asideDepth > 0) {
                html.push('</blockquote>');
                asideDepth -= 1;
            }
            index += 1;
            continue;
        }
        if (line.kind === 'blank') {
            index += 1;
            continue;
        }
        if (isListKind(line.kind as NotionBlockKind)) {
            const list = collectPlainList(lines, index);
            html.push(renderPlainList(list.roots));
            index = list.nextIndex;
            continue;
        }
        if (line.kind === 'heading') {
            html.push(`<h${line.level}>${renderInlineMarkdown(line.text)}</h${line.level}>`);
        } else if (line.kind === 'divider') {
            html.push('<hr>');
        } else if (line.kind === 'quote') {
            const quote = collectQuote(index);
            if (quote.paragraphs.length > 0) {
                html.push(
                    `<blockquote>${quote.paragraphs
                        .map((paragraphLines) => `<p>${paragraphLines.map(renderInlineMarkdown).join('<br>')}</p>`)
                        .join('')}</blockquote>`
                );
            }
            index = quote.nextIndex;
            continue;
        } else {
            const imageMatch = line.text.match(/^!\[([^\]]*)]\((https?:\/\/[^\s)]+)\)$/i);
            if (imageMatch) {
                const label = imageMatch[1] || '이미지 링크';
                html.push(`<p><a href="${escapeHtml(imageMatch[2])}">${escapeHtml(label)}</a></p>`);
            } else if (SAFE_LINK_PATTERN.test(line.text.trim())) {
                const href = line.text.trim();
                html.push(`<p><a href="${escapeHtml(href)}">${escapeHtml(href)}</a></p>`);
            } else {
                html.push(`<p>${renderInlineMarkdown(line.text)}</p>`);
            }
        }
        index += 1;
    }

    while (asideDepth > 0) {
        html.push('</blockquote>');
        asideDepth -= 1;
    }
    return html.join('');
};
