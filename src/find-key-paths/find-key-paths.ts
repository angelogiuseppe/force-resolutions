export function findKeyPaths(source: unknown, key: string): string[][] {
    const isObject = (v: unknown) => v && typeof (v) === 'object';
    const stack: { path: string[]; object: unknown }[] = [{ path: [], object: source }];
    const visited = new WeakSet();
    const keys: string[][] = [];

    while (stack.length > 0) {
        const { object, path } = stack.shift()!;
        if (!isObject(object) || visited.has(object as Object)) continue;

        visited.add(object as Object);
        Object.entries(object as Record<string, unknown>).forEach(([k, v]) => {
            if (k === key) keys.push([...path, k]);
            stack.push({ path: [...path, k], object: v });
        });
    }

    return keys;
}




