# force-resolutions

This package modifies package-lock.json to force the installation of specified versions of a set of transitive dependencies (dependencies of dependencies).
## Getting started

1. Add a field `resolutions` with the dependency version you want to fix at the main level of your `package.json`.

Example:

```json
"resolutions": {
  "ssri": "8.0.5"
}
```

2. Add force-resolutions to the preinstall script so that it patches the `package-lock.json` file before every `npm install`:

```json
"scripts": {
  "preinstall": "npx force-resolutions"
}
```

3. Install dependencies

```
npm install
```

Remember that whenever you run `npm install`, the `preinstall` command will run automatically.

If a `package.lock.json` is not detected the script will not run, and any other command after it will be executed as normal.

4. To confirm that the right version was installed, use:

```shell
npm ls ssri
```


## Running this repository locally

1. Install the dependencies of the project:

```shell
npm install
```

2. Build the project:

```shell
npm run build
```
