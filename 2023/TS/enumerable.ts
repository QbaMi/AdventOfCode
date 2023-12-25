export function sum<T extends number>(array: T[]): number { return array.reduce((total, value) => total + value, 0)};

export function product<T extends number>(array: T[]): number { return array.reduce((total, value) => total * value, 1)};

export function min<T extends number>(array: T[]): T { return array.reduce((m, i) => m < i ? m : i, Number.MAX_VALUE as T)}
