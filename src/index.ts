import { promises } from "fs";
import { checkIfFileExists } from "./check-if-file-exists";
import { findKeyPaths } from "./find-key-paths";
import { editUsingPaths } from "./edit-using-paths";

async function forceResolutions() {
  // Check if current platform is windows
  const isWindows = process.platform === "win32" ? true : false;

  // Get working directory
  const currentWorkingDirectory = process.cwd();

  const properSlash = isWindows ? "\\" : "/";

  // Construct default package lock json path
  const defaultPackageLockJsonPath = `${currentWorkingDirectory}${properSlash}package-lock.json`;

  // Construct default package json path
  const defaultPackageJsonPath = `${currentWorkingDirectory}${properSlash}package.json`;

  // Check if package lock json exists
  const packageLockJsonExists = await checkIfFileExists(
    defaultPackageLockJsonPath
  );

  // Check if package json exists
  const packageJsonExists = await checkIfFileExists(defaultPackageJsonPath);

  if (packageLockJsonExists && packageJsonExists) {
    // Read package json
    const packageJSON = await promises.readFile(defaultPackageJsonPath);

    // Read package lock json
    const packageLockJSON = await promises.readFile(defaultPackageLockJsonPath);

    // Parse package lock json
    let packageJSONContent = JSON.parse(packageJSON.toString());

    // Parse package lock json
    let packageLockJSONContent = JSON.parse(packageLockJSON.toString());

    // Map resolutions
    const resolutions = packageJSONContent.resolutions;

    // Iterate over all resolutions
    Object.keys(resolutions).forEach((resolution) => {
      // Find paths of the resolutions
      const keyPaths = findKeyPaths(
        packageLockJSONContent,
        (key) => key === resolution
      );

      console.log(keyPaths);

      // Modifications to be performed
      let modifications: any = {};

      // Iterate resolutions key paths
      keyPaths.forEach((keyPath) => {
        // Regex to identify dependencies key paths
        const dependenciesRegex = /.dependencies./g;

        // Regex identify if npm 7
        const packagesRegex = /packages./g;

        // Regex to identify requires key paths
        const requiresRegex = /.requires./g;

        // Check the kind of key path and define modifications
        if (
          keyPath.match(dependenciesRegex) &&
          !keyPath.match(requiresRegex) &&
          !keyPath.match(packagesRegex)
        ) {
          // Change version
          modifications[`${keyPath}.version`] = resolutions[resolution];
          // Delete resolved
          modifications[`${keyPath}.resolved`] = undefined;

          // Delete integrity
          modifications[`${keyPath}.integrity`] = undefined;

          // Delete requires
          modifications[`${keyPath}.requires`] = undefined;

          // Handle npm 7 package lock json format
        } else if (!!keyPath.match(packagesRegex)) {
          // Change version
          modifications[keyPath] = resolutions[resolution];
        } else if (!!keyPath.match(requiresRegex)) {
          // Change version
          modifications[keyPath] = resolutions[resolution];
        }
      });

      console.log(modifications);

      // Edit the file and set changes
      packageLockJSONContent = editUsingPaths(
        packageLockJSONContent,
        modifications
      );

      modifications = {};
    });

    // Write final processed file
    await promises.writeFile(
      defaultPackageLockJsonPath,
      JSON.stringify(packageLockJSONContent, null, 2)
    );
  }
}

forceResolutions().then();
