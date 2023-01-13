export const editUsingPaths = <T extends Record<string, T | string>>(
    objectToEdit: T,
    modifications: Map<string[], unknown>,
): T => {
    for (const [key, value] of modifications.entries()) {
        const property = key[key.length - 1];
        const holder = key.slice(0, key.length - 1).reduce((object, k) => {
            if (typeof ((object as T)?.[k]) !== 'object') {
                Object.assign(object, { [k]: {} });
            }
            return object[k] as T;
        }, objectToEdit as T) as T;
        Object.assign(holder, { [property]: value });
    }

    return objectToEdit;
};