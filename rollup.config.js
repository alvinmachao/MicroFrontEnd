import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import serve from "rollup-plugin-serve";
import commonjs from "rollup-plugin-commonjs";

export default {
  input: "./src/tinySingleSpa",
  output: {
    file: "./dist/tinySingleSpa.js",
    format: "umd",
    name: "tinySingleSpa",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**",
    }),
    process.env.SERVE
      ? serve({
          contentBase: "",
          open: true,
          port: "9000",
          openPage: "/public/index.html",
        })
      : null,
  ],
};
