export function findKeyPaths(source: unknown, searchKey: string): string[][] {
  // Helper function to check if the value is an object
  const isObject = (value: unknown) => value && typeof value === "object";
  // Stack to keep track of the objects and their paths
  const stack: { path: string[]; object: unknown }[] = [
    { path: [], object: source },
  ];
  // Set to keep track of visited objects
  const visited = new WeakSet();
  // Array to store the paths of the searchKey
  const keyPaths: string[][] = [];

  // Iterating through the stack
  while (stack.length > 0) {
    const { object, path } = stack.shift()!;
    // if the object is not an object or if it is already visited, continue
    if (!isObject(object) || visited.has(object as Object)) continue;

    visited.add(object as Object);
    // Iterating through the entries of the object
    Object.entries(object as Record<string, unknown>).forEach(
      ([currentKey, value]) => {
        // if the currentKey is the searchKey, add the path to keyPaths
        if (currentKey === searchKey) keyPaths.push([...path, currentKey]);
        // push the currentKey and value in the stack
        stack.push({ path: [...path, currentKey], object: value });
      }
    );
  }

  // return the keyPaths
  return keyPaths;
}
