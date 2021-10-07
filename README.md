 <p align="center">
    <img src="https://raw.githubusercontent.com/angelogiuseppe/force-resolutions/master/assets/logo/force-resolutions-logo.png" alt="force-resolutions-logo">
</p>

---

 <p align="center">
This package modifies package-lock.json to force the installation of specified versions of a set of transitive dependencies (dependencies of dependencies).
</p>

---

### Getting started

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

```shell
npm install
```

Remember that whenever you run `npm install`, the `preinstall` command will run automatically.

If a `package.lock.json` is not detected the script will not run, and any other command after it will be executed as normal.

4. To confirm that the right version was installed, use:

```shell
npm ls ssri
```

---

### Running this repository locally

1. Install the dependencies of the project:

```shell
npm install
```

2. Build the project:

```shell
npm run build
```

---

### Acknowledgments

This project was inspired by the next package: [npm-force-resolutions](https://www.npmjs.com/package/npm-force-resolutions).

---

### Why this project was created

This project was created because **npm-force-resolutions** became not suitable for the necesities the team I was working in had. We needed to avoid triggering the execution of the script when there was no `package-lock.json`, descriptive error logs, descriptive logs during the execution, faster download times, compatibility with multiple npm versions and faster execution times.
