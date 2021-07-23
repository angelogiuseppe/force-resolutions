// *********************************************
//              Types and interfaces
// *********************************************

export interface EditUsingPaths {
  (objectToEdit: any, modifications: { [path: string]: string }): any;
}

export type currentPathToEdit = string;

// *********************************************
//              Main function
// *********************************************

export const editUsingPaths: EditUsingPaths = (objectToEdit, modifications) => {
  Object.keys(modifications).forEach((path: currentPathToEdit) => {
    let k = objectToEdit;
    let steps = path.split(".");
    let last = steps.pop();
    steps.forEach((e) => (k[e] = k[e] || {}) && (k = k[e]));
    if (last) {
      k[last] = modifications[path];
    }
  });
  return objectToEdit;
};
