export type ToastKind = 'error' | 'success' | 'info' | 'warning';

export type ToastPayload = {
    kind: ToastKind;
    text: string;
    id?: string;
};

type Listener = (payload: ToastPayload) => void;

const listeners = new Set<Listener>();

export const toastBus = {
    emit: (payload: ToastPayload): void => {
        listeners.forEach((listener) => {
            try {
                listener(payload);
            } catch {
                // no-op: ignore individual listener errors
            }
        });
    },
    subscribe: (listener: Listener): (() => void) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
};
