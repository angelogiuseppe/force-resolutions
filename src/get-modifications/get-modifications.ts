export const getModifications = (path: string[], data: Record<string, unknown> | string | number, source = new Map<string[], unknown>()) => {
    if (typeof (data) !== 'object') {
        source.set(path, data);
        return source;
    }

    return Object.entries(data).reduce((map, [key, value]) => {
        map.set(path.concat(key), value);
        return map;
    }, source);
}