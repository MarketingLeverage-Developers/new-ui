import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(() =>
        typeof window !== 'undefined' ? window.matchMedia(query).matches : false
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQueryList = window.matchMedia(query);

        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        mediaQueryList.addEventListener('change', listener);

        // 초기 동기화
        setMatches(mediaQueryList.matches);

        return () => {
            mediaQueryList.removeEventListener('change', listener);
        };
    }, [query]);

    return matches;
};
