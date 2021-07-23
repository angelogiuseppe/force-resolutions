import { promises, constants } from "fs";

// *********************************************
//              Types and interfaces
// *********************************************

export interface CheckIfFileExists {
  (path: string): Promise<boolean>;
}

// *********************************************
//              Main function
// *********************************************

export const checkIfFileExists: CheckIfFileExists = async (path) => {
  try {
    await promises.access(path, constants.O_RDWR);
    return true;
  } catch (error) {
    return false;
  }
};
