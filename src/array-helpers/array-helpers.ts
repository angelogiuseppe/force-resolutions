export function hasFirst<T>(entry: T, array: T[]) {
    return entry === array[0] && array.length > 1;
}

export function hasLast<T>(entry: T, array: T[]) {
    return entry === array[array.length - 1] && array.length > 1;
}

export function hasMiddle<T>(entry: T, array: T[]) {
    const index = array.indexOf(entry);
    return index > 0 && index + 1 < array.length;
}