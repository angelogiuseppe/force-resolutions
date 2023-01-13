import {promises} from "fs";
import {checkIfFileExists} from "./check-if-file-exists";
import {findKeyPaths} from "./find-key-paths";
import {editUsingPaths} from "./edit-using-paths";
import kleur from "kleur";
import {join} from "path";
import {hasFirst, hasMiddle} from "./array-helpers";
import {getModifications} from "./get-modifications";
import {getValue} from "./get-value";

async function forceResolutions() {
    try {
        // Get working directory
        const currentWorkingDirectory = process.cwd();

        // Construct default package lock json path
        const defaultPackageLockJsonPath = join(currentWorkingDirectory, "package-lock.json");

        // Construct default package json path
        const defaultPackageJsonPath = join(currentWorkingDirectory, "package.json");

        // Check if package/package lock json exists
        const [packageLockJsonExists, packageJsonExists] = await Promise.all([
            defaultPackageLockJsonPath,
            defaultPackageJsonPath
        ].map(checkIfFileExists));

        if (packageLockJsonExists && packageJsonExists) {
            // Read files contents
            const [packageLockJSON, packageJSON] = await Promise.all([
                defaultPackageLockJsonPath,
                defaultPackageJsonPath,
            ].map(file => promises.readFile(file)));

            // Parse package lock json
            let packageJSONContent = JSON.parse(packageJSON.toString());

            // Parse package lock json
            let packageLockJSONContent = JSON.parse(packageLockJSON.toString());

            // Map resolutions
            const {resolutions} = packageJSONContent;

            // Start processing
            console.log(kleur.cyan("Applying forced resolutions:"));

            let changes = 0;
            const collectChanges = (modifications: Map<string[], unknown>) => {
                let count = changes;
                for (const [k, v] of modifications.entries()) {
                    if (getValue(packageLockJSONContent, k) !== v) {
                        changes += 1;
                    }
                }
                return changes > count;
            };

            if (resolutions) {
                // Iterate over all resolutions
                Object.keys(resolutions).forEach((resolution) => {
                    // Find paths of the resolutions
                    const keyPaths = findKeyPaths(
                        packageLockJSONContent,
                        resolution
                    );

                    if (keyPaths.length < 1) return;

                    // Iterate resolutions key paths
                    const modifications = new Map<string[], Record<string, unknown>>();
                    keyPaths.forEach((keyPath) => {
                        // Check the kind of key path and define modifications
                        if (
                            hasMiddle('dependencies', keyPath) &&
                            !hasMiddle('required', keyPath) &&
                            !hasFirst('packages', keyPath)
                        ) {
                            getModifications(keyPath, {
                                // Change version
                                version: resolutions[resolution],

                                // Delete resolved
                                resolved: undefined,

                                // Delete integrity
                                integrity: undefined,

                                // Delete requires
                                requires: undefined,
                            }, modifications);

                        }
                        // Handle npm 7 package lock json format
                        else if (hasFirst('packages', keyPath)) {
                            // Change version
                            getModifications(keyPath, resolutions[resolution], modifications);
                        } else if (hasMiddle('requires', keyPath)) {
                            // Change version on requires
                            getModifications(keyPath, resolutions[resolution], modifications);

                            // Create new dependencies object / edit it
                            getModifications(keyPath.map(k => k === "requires" ? "dependencies" : k), {
                                // Set version, resolved, integrity & requires
                                version: resolutions[resolution],
                                resolved: undefined,
                                integrity: undefined,
                                requires: undefined,
                            }, modifications);
                        }
                    });

                    if (collectChanges(modifications)) {
                        // Edit the file and set changes
                        packageLockJSONContent = editUsingPaths(
                            packageLockJSONContent,
                            modifications,
                        );

                        const replacement = resolutions[resolution];
                        console.log(kleur.dim(`${resolution} => ${replacement}`));
                    }
                });

                // Write final processed file
                if (changes > 0) {
                    await promises.writeFile(
                        defaultPackageLockJsonPath,
                        JSON.stringify(packageLockJSONContent, null, 2)
                    );
                    console.log(
                        kleur.green("Finished applying forced resolutions.")
                    );
                } else {
                    console.log(
                        kleur.green("All resolutions already up-to-date.")
                    );
                }
            }
        } else if (!packageLockJsonExists) {
            console.log(
                kleur.grey("package-lock.json not found - can not force resolutions (try to execute `npm install` command before).")
            );
        }
    } catch (error) {
        console.log(
            kleur.red("An unexpected error has occurred while running force-resolutions.")
        );
        console.error(error);
    }
}

forceResolutions().then();