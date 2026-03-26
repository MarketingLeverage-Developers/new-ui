export const parseCommaSeparatedValues = (value?: string | null) =>
    [...new Set(String(value ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean))];

export const joinCommaSeparatedValues = (values: string[]) => values.join(',');
