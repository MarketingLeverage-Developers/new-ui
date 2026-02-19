export const downloadFilesAsZip = async (
    files: { fileUrl: string; fileName: string }[],
    zipName: string = '작업_파일.zip'
) => {
    console.warn(`[downloadFilesAsZip] zip dependency is not bundled. Falling back to single-file downloads: ${zipName}`);
    for (const file of files) {
        await downloadFileFromUrl(file.fileUrl, file.fileName);
    }
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

    const openByAnchor = (targetUrl: string, targetName?: string, useDownloadAttr: boolean = true) => {
        const link = document.createElement('a');
        link.href = targetUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        if (useDownloadAttr && targetName) link.download = targetName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isCrossOriginUrl(fileUrl)) {
        // Cross-origin 직접 fetch는 CORS에 막힐 수 있어 링크 네비게이션으로 처리한다.
        openByAnchor(fileUrl, fileName, false);
        return;
    }

    try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error('파일 요청 실패');

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error('파일 다운로드 실패:', error);
        openByAnchor(fileUrl, fileName, false);
    }
};
