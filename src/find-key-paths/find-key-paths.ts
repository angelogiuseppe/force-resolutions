// *********************************************
//              Types and interfaces
// *********************************************

// Array of keys that conform the path
export type CurrentPathArray = string[];

// Array of resulting paths
export type Results = string[];

// Cyclic objects
export type DiscoveredCyclicObjects = any[];

// Next object to be searched
export type NextObjectToBeSearch = any;

// Interface of the findKeyPaths function
export interface FindKeyPaths {
  (
    currentObjectToAnalyze: any,
    predicate: (
      key: string,
      path: CurrentPathArray,
      currentObject: any
    ) => boolean
  ): Results;
}

// Interface for the findKeys function
export interface FindKeys {
  (currentObjectToAnalyze: any): void;
}

// *********************************************
//              Main function
// *********************************************

export const findKeyPaths: FindKeyPaths = (objectToAnalyze, predicate) => {
  // Array of discovered cyclic objects
  const discoveredCyclicObjects: DiscoveredCyclicObjects = [];

  // Array of keys that conform the current path
  const currentPath: CurrentPathArray = [];

  // Array of final results
  const results: Results = [];

  // Check if object to analyze is proper
  if (
    !objectToAnalyze &&
    (typeof objectToAnalyze !== "object" || Array.isArray(objectToAnalyze))
  ) {
    throw new TypeError(
      "First argument of finPropPath is not the correct type Object"
    );
  }

  // Check if predicate is proper
  if (typeof predicate !== "function") {
    throw new TypeError("Predicate is not a function");
  }

  // Find keys recursively
  const findKeys: FindKeys = (currentObjectToAnalyze) => {
    // Iterate through the object keys
    Object.keys(currentObjectToAnalyze).forEach((key) => {
      // Check if predicate conditions are true
      if (predicate(key, currentPath, currentObjectToAnalyze) === true) {
        // Push key to current path array
        currentPath.push(key);
        // Add path as string in results
        results.push(currentPath.join("."));
        // Remove last element from array
        currentPath.pop();
      }
      // Get content of next object to be searched
      const nextObjectToBeSearch: NextObjectToBeSearch =
        currentObjectToAnalyze[key];
      if (
        nextObjectToBeSearch &&
        typeof nextObjectToBeSearch === "object" &&
        !Array.isArray(nextObjectToBeSearch)
      ) {
        // If next object is cyclic
        if (
          !discoveredCyclicObjects.find(
            (currentObjectToAnalyze) =>
              currentObjectToAnalyze === nextObjectToBeSearch
          )
        ) {
          // Push key to current path array
          currentPath.push(key);
          // Push object to cyclic objects array
          discoveredCyclicObjects.push(nextObjectToBeSearch);
          // Trigger function again
          findKeys(nextObjectToBeSearch);
          // remove last item from array
          currentPath.pop();
        }
      }
    });
  };
  findKeys(objectToAnalyze);
  return results;
};
