import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useUserTableSettingFetchQuery } from '@/hooks/common/useUserTableSettingFetchQuery';
import { useUserTableSettingUpdateMutation } from '@/hooks/common/useUserTableSettingUpdateMutation';
import type { UserTableSettingScope, UserTableSettingSettings, UserTableSettingUpdateReq } from '@/types/preference/userTableSettingTypes';

type Params = {
    storageKey?: string;
    debounceMs?: number;
};

type Result = {
    persistSettings: (settings: UserTableSettingSettings) => void;
};

export const USER_TABLE_SETTING_SYNC_EVENT = 'ml:user-table-setting-sync';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_CAPTURE_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i;

const isUuid = (value: string | null | undefined): value is string => Boolean(value && UUID_PATTERN.test(value));

const toPageKey = (pathname: string): string => {
    const trimmed = pathname.trim().replace(/^\/+|\/+$/g, '');
    if (!trimmed) return 'root';

    const normalizedPath = trimmed
        .split('/')
        .filter((segment) => segment && !/^\d+$/.test(segment) && !UUID_PATTERN.test(segment))
        .join('/');

    const base = normalizedPath || trimmed;
    return base.replace(/[^a-zA-Z0-9/_-]/g, '').replace(/[/-]+/g, '_').slice(0, 100) || 'root';
};

const toTableKey = (storageKey: string): string => {
    const trimmed = storageKey.trim();
    if (!trimmed) return '';
    return trimmed.slice(0, 100);
};

const resolveHomepageUuid = (search: string, storageKey: string): string | null => {
    const params = new URLSearchParams(search);
    const fromQuery = params.get('homepageUuid');
    if (isUuid(fromQuery)) return fromQuery;

    const fromStorageKey = storageKey.match(UUID_CAPTURE_PATTERN)?.[0] ?? null;
    if (isUuid(fromStorageKey)) return fromStorageKey;

    return null;
};

const resolveScope = (storageKey: string | undefined, pathname: string, search: string): UserTableSettingScope | null => {
    if (!storageKey) return null;
    if (storageKey.includes('tutorial')) return null;

    const homepageUuid = resolveHomepageUuid(search, storageKey);
    if (!homepageUuid) return null;

    const pageKey = toPageKey(pathname);
    const tableKey = toTableKey(storageKey);
    if (!tableKey) return null;

    return { homepageUuid, pageKey, tableKey };
};

export const useUserTableSettingSync = ({ storageKey, debounceMs = 400 }: Params): Result => {
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
    const search = typeof window !== 'undefined' ? window.location.search : '';

    const scope = useMemo(() => resolveScope(storageKey, pathname, search), [storageKey, pathname, search]);
    const scopeKey = useMemo(() => {
        if (!scope) return '';
        return `${scope.homepageUuid}|${scope.pageKey}|${scope.tableKey}`;
    }, [scope]);

    const { res } = useUserTableSettingFetchQuery({
        params: scope,
        enabled: Boolean(scope),
    });
    const { mutate } = useUserTableSettingUpdateMutation({ invalidate: true });

    const timerRef = useRef<number | null>(null);
    const pendingReqRef = useRef<UserTableSettingUpdateReq | null>(null);
    const hasLocalInteractionRef = useRef(false);

    useEffect(() => {
        hasLocalInteractionRef.current = false;
        pendingReqRef.current = null;

        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, [scopeKey, storageKey]);

    useEffect(() => {
        if (!storageKey) return;
        if (!scope) return;
        if (!res) return;
        if (hasLocalInteractionRef.current) return;
        if (typeof window === 'undefined') return;

        const nextSettings = JSON.stringify(res.settings ?? {});
        const currentSettings = window.localStorage.getItem(storageKey);
        if (currentSettings === nextSettings) return;

        try {
            window.localStorage.setItem(storageKey, nextSettings);
            window.dispatchEvent(
                new CustomEvent(USER_TABLE_SETTING_SYNC_EVENT, {
                    detail: { storageKey },
                })
            );
        } catch {
            // ignore
        }
    }, [res, scope, storageKey]);

    useEffect(
        () => () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
        },
        []
    );

    const persistSettings = useCallback(
        (settings: UserTableSettingSettings) => {
            if (!scope) return;
            hasLocalInteractionRef.current = true;
            pendingReqRef.current = {
                ...scope,
                settings,
            };

            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }

            timerRef.current = window.setTimeout(() => {
                timerRef.current = null;

                const req = pendingReqRef.current;
                if (!req) return;

                mutate(req);
            }, debounceMs);
        },
        [scope, mutate, debounceMs]
    );

    return { persistSettings };
};
