export const editUsingPaths = <T extends Record<string, T | string>>(
  objectToEdit: T,
  modifications: Map<string[], unknown>
): T => {
  // Iterating over the key-value pairs in the modifications map
  for (const [propertyPath, newValue] of modifications.entries()) {
    // getting the last element of the property path as the property
    const property = propertyPath[propertyPath.length - 1];
    // getting the object that holds the property by slicing the property path except the last element
    const holder = propertyPath
      .slice(0, propertyPath.length - 1)
      .reduce((object, key) => {
        // if the current object is not an object, create an empty object
        if (typeof (object as T)?.[key] !== "object") {
          Object.assign(object, { [key]: {} });
        }
        // returning the current object
        return object[key] as T;
      }, objectToEdit as T) as T;
    // Assigning new value to the holder object
    Object.assign(holder, { [property]: newValue });
  }
  // returning the modified object
  return objectToEdit;
};
