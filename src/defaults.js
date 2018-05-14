/* eslint-disable max-len */
export default {
  // Whether to print hints on transpilation settings which were selected.
  debug: false,

  // One of the following:
  // - "node": Targetting NodeJS (Outputs CommonJS modules, translates dynamic imports into require statements, ...)
  // - "browser": Targetting Browsers (Expects Webpack, Parcel or Rollup post-processing, keeps dynamic import, ...)
  // - "universal": Targetting both NodeJS and Browsers (Ideally suited for libraries published for both NodeJS and browsers via NPM)
  // - "auto": Define target automatically based on NODE_ENV environment.
  target: "auto",

  // Choose which transpilation should be applied.
  // One of the following:
  // - "es5": Standard output for widest engine and browser support. Ideally suited for publishing to NPM.
  // - "es2015": Alternative to standard es5 reaching only modern engines and browsers which support at least all features of es2015. Might be a good alternative for publishing modern libraries to NPM or when using transpilation on all content - even `node_modules` in application code.
  // - "modern": Uses a built-in definition of modern NodeJS and browser versions. This is interesting for local development of application as it accelerates features like hot-loading quite a bit.
  // - "current": NodeJS only. Ideally for local running test suites, etc. Using the least amount of transpile for making code runnable locally.
  // - "node": NodeJS only. Uses `engines` field in `package.json` to define the NodeJS version to target.
  // - "browser": Browser only. Uses local "browserslist" config to determine transpilation target. Uses `BROWSERSLIST_ENV` if configured. Otherwise uses `env` passed through preset or via `NODE_ENV`.
  // - "auto": Uses "browser" for `target: browser`. Uses "node" for `target: node`. Uses `es5` for `target: universal`.
  // - {}: A custom object which is passed to `@babel/preset-env`
  transpile: "auto",

  // Select environment where we are in for the current job.
  // One the the following:
  // - "development": During development of applications, publishing of libraries containing debug code
  // - "production": Publishing application to the public, publishing of clean non-debug code containing libraries and command line applications.
  // - "test": Used for testing e.g. with Ava or Jest test runners.
  // - "auto": Automatically using the `EDGE_ENV` or `NODE_ENV` environment variables.
  env: "auto",

  // Choose whether and how imports should be processed.
  // - "cjs": Transpile module imports to CommonJS
  // - false: Keep module imports
  // - "auto": Automatic selection based on `target`.
  modules: "auto",

  // Choose automatically depending on target by default or use one of these for full control:
  // - "node": For usage in NodeJS (e.g. produce binaries), publish NodeJS-only libraries.
  // - false: Enhance imports with further details (chunk names, SSR support), but keep them functional as they are.
  imports: false,

  // Replace the function used when compiling JSX expressions. Default: React.
  // See also: https://www.npmjs.com/package/@babel/preset-react
  jsxPragma: null,

  // Replace the component used when compiling JSX fragments. Default: React.
  // See also: https://www.npmjs.com/package/@babel/preset-react
  jsxPragmaFrag: null,

  // Transpilation Settings: We default on a loose transpilation which is efficient
  // but not overly compliant. If you experience issues it might be better to
  // switch `looseMode` off. `specMode` on the other hand might produce
  // 100% correct code, but tend to be large and slower as well.
  looseMode: true,
  specMode: false,

  // Lodash Plugin Settings. Optimizes import statements for smaller bundles.
  // The idea behind here is that some libraries are publishing individual functions into individual files.
  // This helps tree-shaking until all libraries are correctly dealing with side-effect flags and bundlers have better support.
  optimizeModules: [ "lodash", "async", "rambda", "recompose" ],

  // Configuration for module lookup
  sourceFolder: "src",

  // Whether to enable source map output
  sourceMaps: true,

  // Enable full compression on production scripts or basic compression for libraries or during development.
  compression: true,

  // Whether to apply more agressive minification. Automatically enabled when using `compression: true` and running in production env.
  minified: null
}
