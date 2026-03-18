import { useEffect, useRef, useState } from 'react';

export type VideoPreviewTarget = {
    key: string;
    name: string;
    url: string;
};

type VideoThumbnailEntry = {
    sourceUrl: string;
    thumbnailUrl?: string | null;
};

const MP4_PATTERN = /\.mp4(?:$|[?#])/i;
const MAX_VIDEO_THUMBNAIL_EDGE = 480;
const VIDEO_THUMBNAIL_TIMEOUT_MS = 10000;

export const isMp4Preview = (name?: string, url?: string) => MP4_PATTERN.test(name ?? '') || MP4_PATTERN.test(url ?? '');

export const resolveMediaUrl = (url: string, apiPrefix?: string, apiOrigin?: string) => {
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/api/') && apiOrigin) return `${apiOrigin}${url}`;
    if (apiPrefix) return `${apiPrefix}${url.startsWith('/') ? '' : '/'}${url}`;
    return url;
};

const captureVideoThumbnail = (sourceUrl: string): Promise<string> =>
    new Promise((resolve, reject) => {
        const video = document.createElement('video');
        let settled = false;

        const cleanup = () => {
            window.clearTimeout(timeoutId);

            video.pause();
            video.removeAttribute('src');
            video.load();
        };

        const finish = <T,>(handler: (value: T) => void, value: T) => {
            if (settled) return;
            settled = true;
            cleanup();
            handler(value);
        };

        const captureFrame = () => {
            const { videoWidth, videoHeight } = video;

            if (!videoWidth || !videoHeight) {
                finish(reject, new Error('Video frame unavailable'));
                return;
            }

            const scale = Math.min(1, MAX_VIDEO_THUMBNAIL_EDGE / Math.max(videoWidth, videoHeight));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(videoWidth * scale));
            canvas.height = Math.max(1, Math.round(videoHeight * scale));

            const context = canvas.getContext('2d');
            if (!context) {
                finish(reject, new Error('Canvas context unavailable'));
                return;
            }

            try {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                finish(resolve, canvas.toDataURL('image/jpeg', 0.85));
            } catch (error) {
                finish(reject, error instanceof Error ? error : new Error('Video thumbnail capture failed'));
            }
        };

        const handleLoadedData = () => {
            const duration = Number.isFinite(video.duration) ? video.duration : 0;
            const targetTime = duration > 0.1 ? Math.min(0.1, Math.max(duration - 0.01, 0)) : 0;

            if (targetTime <= 0) {
                captureFrame();
                return;
            }

            const handleSeeked = () => {
                captureFrame();
            };

            video.addEventListener('seeked', handleSeeked, { once: true });

            try {
                video.currentTime = targetTime;
            } catch {
                video.removeEventListener('seeked', handleSeeked);
                captureFrame();
            }
        };

        const timeoutId = window.setTimeout(() => {
            finish(reject, new Error('Video thumbnail capture timed out'));
        }, VIDEO_THUMBNAIL_TIMEOUT_MS);

        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;

        if (!sourceUrl.startsWith('blob:') && !sourceUrl.startsWith('data:') && /^https?:\/\//i.test(sourceUrl)) {
            video.crossOrigin = 'anonymous';
        }

        video.addEventListener('loadeddata', handleLoadedData, { once: true });
        video.addEventListener(
            'error',
            () => {
                finish(reject, new Error('Video failed to load'));
            },
            { once: true }
        );

        video.src = sourceUrl;
        video.load();
    });

export const useVideoThumbnailMap = (
    targets: VideoPreviewTarget[],
    apiPrefix?: string,
    apiOrigin?: string
) => {
    const [videoThumbnailMap, setVideoThumbnailMap] = useState<Record<string, VideoThumbnailEntry>>({});
    const videoThumbnailMapRef = useRef(videoThumbnailMap);

    useEffect(() => {
        videoThumbnailMapRef.current = videoThumbnailMap;
    }, [videoThumbnailMap]);

    useEffect(() => {
        const normalizedTargets = targets.map((target) => ({
            key: target.key,
            sourceUrl: resolveMediaUrl(target.url, apiPrefix, apiOrigin),
        }));

        const activeEntries = new Map(normalizedTargets.map((target) => [target.key, target.sourceUrl]));

        setVideoThumbnailMap((prev) => {
            let changed = false;
            const next: Record<string, VideoThumbnailEntry> = {};

            Object.entries(prev).forEach(([key, entry]) => {
                if (activeEntries.get(key) === entry.sourceUrl) {
                    next[key] = entry;
                    return;
                }

                changed = true;
            });

            return changed ? next : prev;
        });

        let cancelled = false;

        normalizedTargets.forEach(({ key, sourceUrl }) => {
            const existing = videoThumbnailMapRef.current[key];
            if (existing?.sourceUrl === sourceUrl && existing.thumbnailUrl !== undefined) return;

            setVideoThumbnailMap((prev) => {
                const current = prev[key];
                if (current?.sourceUrl === sourceUrl && current.thumbnailUrl === undefined) return prev;
                if (current?.sourceUrl === sourceUrl && current.thumbnailUrl !== undefined) return prev;

                return {
                    ...prev,
                    [key]: { sourceUrl },
                };
            });

            captureVideoThumbnail(sourceUrl)
                .then((thumbnailUrl) => {
                    if (cancelled) return;

                    setVideoThumbnailMap((prev) => {
                        const current = prev[key];
                        if (!current || current.sourceUrl !== sourceUrl) return prev;

                        return {
                            ...prev,
                            [key]: { sourceUrl, thumbnailUrl },
                        };
                    });
                })
                .catch(() => {
                    if (cancelled) return;

                    setVideoThumbnailMap((prev) => {
                        const current = prev[key];
                        if (!current || current.sourceUrl !== sourceUrl) return prev;

                        return {
                            ...prev,
                            [key]: { sourceUrl, thumbnailUrl: null },
                        };
                    });
                });
        });

        return () => {
            cancelled = true;
        };
    }, [apiOrigin, apiPrefix, targets]);

    return videoThumbnailMap;
};
