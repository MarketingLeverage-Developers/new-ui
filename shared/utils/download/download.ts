export type SequentialDownloadFile = {
    fileUrl: string;
    fileName: string;
};

const DEFAULT_SEQUENTIAL_DOWNLOAD_DELAY_MS = 300;
const DEFAULT_BATCH_DOWNLOAD_CONCURRENCY = 4;
const DEFAULT_BATCH_SAVE_DELAY_MS = 100;
const LARGE_FILE_EXT_PATTERN = /\.(?:mp4|mov|avi|mkv|webm|zip|psd|ai)(?:$|[?#])/i;

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const isLargeFileCandidate = (file: SequentialDownloadFile) =>
    LARGE_FILE_EXT_PATTERN.test(file.fileName) || LARGE_FILE_EXT_PATTERN.test(file.fileUrl);

export const downloadFilesAsZip = async (
    files: { fileUrl: string; fileName: string }[],
    zipName: string = '작업_파일.zip'
) => {
    console.warn(`[downloadFilesAsZip] zip dependency is not bundled. Falling back to single-file downloads: ${zipName}`);
    await downloadFilesAfterPrepared(files);
};

export const downloadFilesSequentially = async (
    files: SequentialDownloadFile[],
    delayMs = DEFAULT_SEQUENTIAL_DOWNLOAD_DELAY_MS
) => {
    for (const [index, file] of files.entries()) {
        await downloadFileFromUrl(file.fileUrl, file.fileName);

        if (index < files.length - 1 && delayMs > 0) {
            await wait(delayMs);
        }
    }
};

type PreparedDownloadResult =
    | { file: SequentialDownloadFile; blob: Blob; success: true }
    | { file: SequentialDownloadFile; error: unknown; success: false };

const normalizeConcurrency = (concurrency: number) =>
    Math.max(1, Math.floor(Number.isFinite(concurrency) ? concurrency : DEFAULT_BATCH_DOWNLOAD_CONCURRENCY));

const prepareDownloadFiles = async (
    files: SequentialDownloadFile[],
    concurrency = DEFAULT_BATCH_DOWNLOAD_CONCURRENCY
) => {
    const results: PreparedDownloadResult[] = [];
    let nextIndex = 0;

    const worker = async () => {
        while (nextIndex < files.length) {
            const currentIndex = nextIndex;
            nextIndex += 1;
            const file = files[currentIndex];

            try {
                results[currentIndex] = {
                    file,
                    blob: await fetchDownloadBlob(file.fileUrl),
                    success: true,
                };
            } catch (error) {
                results[currentIndex] = { file, error, success: false };
            }
        }
    };

    const workerCount = Math.min(normalizeConcurrency(concurrency), files.length);
    await Promise.all(Array.from({ length: workerCount }, () => worker()));

    return results;
};

export const downloadFilesAfterPrepared = async (
    files: SequentialDownloadFile[],
    {
        concurrency = DEFAULT_BATCH_DOWNLOAD_CONCURRENCY,
        saveDelayMs = DEFAULT_BATCH_SAVE_DELAY_MS,
    }: { concurrency?: number; saveDelayMs?: number } = {}
) => {
    if (files.length === 0) return;

    // 대용량 파일을 여러 개 blob으로 먼저 적재하면 브라우저 메모리 사용량이 급증하므로 순차 다운로드로 유지한다.
    if (files.some(isLargeFileCandidate)) {
        await downloadFilesSequentially(files);
        return;
    }

    // 일반 이미지류는 먼저 병렬 fetch로 준비한 뒤 다운로드 클릭만 순서대로 실행해 전체 대기 시간을 줄인다.
    const results = await prepareDownloadFiles(files, concurrency);

    for (const [index, result] of results.entries()) {
        if (result.success) {
            saveBlob(result.blob, result.file.fileName);
        } else {
            console.error('파일 다운로드 실패:', result.error);
            openByAnchor(result.file.fileUrl, result.file.fileName);
        }

        if (index < results.length - 1 && saveDelayMs > 0) {
            await wait(saveDelayMs);
        }
    }
};

const saveBlob = (blob: Blob, fileName: string) => {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
};

const openByAnchor = (targetUrl: string, targetName?: string) => {
    const link = document.createElement('a');
    link.href = targetUrl;
    if (targetName) link.download = targetName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const fetchDownloadBlob = async (fileUrl: string) => {
    const requestOptions: RequestInit[] = [{}, { credentials: 'include' }];
    let lastError: unknown;

    for (const options of requestOptions) {
        try {
            const response = await fetch(fileUrl, options);
            if (!response.ok) throw new Error('파일 요청 실패');
            return await response.blob();
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError;
};

export const downloadFileFromUrl = async (fileUrl: string, fileName: string) => {
    try {
        const blob = await fetchDownloadBlob(fileUrl);
        saveBlob(blob, fileName);
    } catch (error) {
        console.error('파일 다운로드 실패:', error);
        openByAnchor(fileUrl, fileName);
    }
};
