export type Response<T> = {
    result: {
        success: boolean;
        code: string;
        message: string;
    };
    body: T;
    page?: number;
    size?: number;
    total?: number;
    totalPages?: number;
};
