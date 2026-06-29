export const downloadFilesAsZip = async (
    files: { fileUrl: string; fileName: string }[],
    zipName: string = '작업_파일.zip'
) => {
    console.warn(`[downloadFilesAsZip] zip dependency is not bundled. Falling back to single-file downloads: ${zipName}`);
    for (const file of files) {
        await downloadFileFromUrl(file.fileUrl, file.fileName);
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
    const isCrossOriginUrl = (targetUrl: string) => {
        if (typeof window === 'undefined') return false;
        try {
            const parsed = new URL(targetUrl, window.location.href);
            return parsed.origin !== window.location.origin;
        } catch {
            return false;
        }
    };

    const openByAnchor = (targetUrl: string, targetName?: string) => {
        const link = document.createElement('a');
        link.href = targetUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        if (targetName) link.download = targetName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isCrossOriginUrl(fileUrl)) {
        openByAnchor(fileUrl, fileName);
        return;
    }

    try {
        const blob = await fetchDownloadBlob(fileUrl);
        saveBlob(blob, fileName);
    } catch (error) {
        console.error('파일 다운로드 실패:', error);
        openByAnchor(fileUrl, fileName);
    }
};
