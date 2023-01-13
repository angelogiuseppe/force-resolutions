import { constants, promises } from "fs";

export const checkIfFileExists = (path: string): Promise<boolean> =>
    promises.access(path, constants.O_RDWR).then(() => true).catch(() => false);