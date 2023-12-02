export function getValue<T extends Record<string, unknown | T>>(
  object: T,
  propertyPath: string[]
): unknown {
  // Destructure the hasOwnProperty method from the Object prototype
  const { hasOwnProperty } = Object.prototype;
  // Using reduce method to iterate through the property path
  // and return the value of the property in the object
  return propertyPath.reduce(
    (currentObject, property) =>
      // check if the current object has the property using hasOwnProperty method
      // if it has, return the value of the property in the current object
      // else return undefined
      (currentObject && hasOwnProperty.call(currentObject, property)
        ? (currentObject[property] as T)
        : undefined) as T,
    object
  );
}
