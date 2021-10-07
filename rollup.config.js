import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import shebang from "rollup-plugin-add-shebang";
import summary from "rollup-plugin-summary";

export default {
  input: "src/index.ts",
  external: ["fs", "os", "tty"],
  output: {
    dir: "dist",
    format: "cjs",
  },
  plugins: [
    commonjs(),
    babel({ babelHelpers: "bundled" }),
    nodeResolve({ preferBuiltins: true }),
    typescript(),
    terser({ format: { comments: false } }),
    shebang({
      include: "dist/index.js",
    }),
    summary(),
  ],
};
