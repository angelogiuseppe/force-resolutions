export function getValue<T extends Record<string, unknown | T>>(object: T, path: string[]): unknown {
    const { hasOwnProperty } = Object.prototype;
    return path.reduce((o, key) => (o && hasOwnProperty.call(o, key) ? o[key] as T : undefined) as T, object);
}