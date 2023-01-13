import { constants, promises } from "fs";

export const checkIfFileExists = async (path: string): Promise<boolean> => {
  try {
    // Use the access method from the fs.promises module
    // to check if the file at the given path can be accessed with read-write permissions
    await promises.access(path, constants.O_RDWR);
    // If the access method resolves, return true
    return true;
  } catch (error) {
    // If the access method throws an error, return false
    return false;
  }
};
