import type { Column } from './AirTable';

export const autoFitColumns = <T,>(columns: Column<T>[]): Column<T>[] =>
    columns.map((column) => ({
        ...column,
        autoFitContent: true,
        children: column.children?.map((child) => ({ ...child, autoFitContent: true })),
    }));
