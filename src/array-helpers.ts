export function hasFirst<T>(entry: T, array: T[]) {
  // Check if the entry is the first element of the array
  // and that the array has more than one element
  return entry === array[0] && array.length > 1;
}

export function hasLast<T>(entry: T, array: T[]) {
  // Check if the entry is the last element of the array
  // and that the array has more than one element
  return entry === array[array.length - 1] && array.length > 1;
}

export function hasMiddle<T>(entry: T, array: T[]) {
  // Check if the entry is in the middle of the array
  // by checking if it's index is greater than 0
  // and less than the last index of the array
  const index = array.indexOf(entry);
  return index > 0 && index + 1 < array.length;
}
