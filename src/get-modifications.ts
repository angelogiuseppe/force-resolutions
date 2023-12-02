export const getModifications = (
  path: string[],
  data: Record<string, unknown> | string | number,
  source = new Map<string[], unknown>()
) => {
  // if the data is not an object, add the path and data to the source map
  if (typeof data !== "object") {
    source.set(path, data);
    return source;
  }

  // return the source map after mapping the entries of the data object
  return Object.entries(data).reduce((map, [key, value]) => {
    // add the path of the current key and its value to the source map
    map.set(path.concat(key), value);
    return map;
  }, source);
};
