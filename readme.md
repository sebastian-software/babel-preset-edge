# Babel Preset Edge<br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps]

[sponsor-img]: https://img.shields.io/badge/Sponsored%20by-Sebastian%20Software-692446.svg
[sponsor]: https://www.sebastian-software.de
[deps]: https://david-dm.org/sebastian-software/babel-preset-edge
[deps-img]: https://david-dm.org/sebastian-software/babel-preset-edge.svg
[npm]: https://www.npmjs.com/package/babel-preset-edge
[npm-downloads-img]: https://img.shields.io/npm/dm/babel-preset-edge.svg
[npm-version-img]: https://img.shields.io/npm/v/babel-preset-edge.svg
[travis-img]: https://img.shields.io/travis/sebastian-software/babel-preset-edge/master.svg?branch=master&label=unix%20build
[appveyor-img]: https://img.shields.io/appveyor/ci/swernerx/babel-preset-edge/master.svg?label=windows%20build
[travis]: https://travis-ci.org/sebastian-software/babel-preset-edge
[appveyor]: https://ci.appveyor.com/project/swernerx/babel-preset-edge/branch/master

Babel Preset Edge is a centralized modern Babel Configuration for React development. Part of the Edge Platform.



## Features

- React and Flowtype Support baked-in for transpiling JSX and removing non-standard Flowtype definitions.
- Optimizations for React during development (richer debug capabilities) and production (less code).
- Automatic environment specific ES2015/2016/2017 support using [Preset Env](https://github.com/babel/babel-preset-env)
- High performance async/await transpilation using [Fast Async](https://github.com/MatAtBread/fast-async) and [nodeent](https://github.com/MatAtBread/nodent#performance).
- Support for dynamic `import()` statement which is used for dynamic chunk creation in Webpack (since version 2).
- Edge Preset adds support for dynamic CSS loading + automatic chunkNames using [universal-import](https://github.com/faceyspacey/babel-plugin-universal-import).
- Local module support for easily referencing sources inside the `src` folder of the project using the [module resolver plugin](https://github.com/tleunen/babel-plugin-module-resolver).
- Support for converting often times used upcoming ES standards like class properties and object rest spread.
- Prefers external polyfills and helpers instead of baked-in code which is especially beneficial for caching and code splitting.
- [Lodash Plugin](https://github.com/lodash/babel-plugin-lodash) to allow cherry-picking of more tranditionally exported libraries like lodash, async, rambda and recompose.
- The transpiler config ignores Generators. As transpiling these results into super slow code and async/await is available the preset prefers to use this instead of "regenerator".

## Defaults

These are our default options. They can be tweaked by passing the required options to the preset.

```js
const defaults = {
  // Whether to print hints on transpilation settings which were selected.
  debug: false,

  // One of the following:
  // - "node"/"cli"/"script"/"binary": any NodeJS related execution with wide support (currently Node v6 LTS)
  // - "node6": identical to the previous option as long as v6 is more widely used - will force v6 when used afterwards.
  // - "node8": identical to the previous option but enforce target Node v8 LTS instead of v6 LTS
  // - "current"/"test": current NodeJS version
  // - "browser"/"web": browsers as defined by browserslist
  // - "library": ideally used for publishing libraries e.g. on NPM
  // - "es2015": same as "library" but targets es2o15 capable engines only.
  // - "modern": same as "library" but targets modern engines only (slightly more forward-looking than es2015).
  // - {}: any custom settings support by Env-Preset
  target: "nodejs",

  // Choose environment based on environment variables ... or override with custom value here.
  env: "auto",

  // Choose automatically depending on target or use one of these for full control:
  // - "commonjs": Transpile module imports to commonjs
  // - false: Keep module imports as is (e.g. protecting ESM for optiomal usage with Webpack)
  // - "auto": Automatic selection based on target.
  modules: "auto",

  // Choose automatically depending on target by default or use one of these for full control:
  // - "rollup-nodejs": For bundling with Rollup and later usage in NodeJS (e.g. produce binaries).
  // - "rollup-webpack": For bundling with Rollup and later usage with Webpack (e.g. publish libraries).
  // - "webpack": Improve compatibility with direct Webpack usage (add chunkNames, dynamic CSS imports, ...) (e.g. bundling applications)
  // - "auto": Automatic selection based on target.
  imports: "auto",

  // Prefer built-ins over custom code. This mainly benefits for modern engines.
  useBuiltIns: true,

  // JSX Pragma. Default: Use React
  jsxPragma: "React.createElement",

  // Async settings: Either `"promises"` or `null`
  rewriteAsync: "promises",

  // Env Settings. We default on a loose transpilation which is efficient
  // but not overly compliant. If you experience issues it might be better to
  // switch `looseMode` off.
  looseMode: true,
  specMode: false,

  // Lodash Plugin Settings
  optimizeModules: [ "lodash", "async", "rambda", "recompose" ],

  // Configuration for module lookup
  sourceFolder: "src",

  // Whether to enable source map output
  sourceMaps: true,

  // Enable full compression on production scripts or basic compression for libraries or during development.
  compression: false,

  // Removing comments by default to keep exported libraries leaner in disc space.
  // Comments are automatically re-enabled if Webpack Universal Imports are used for having correct chunkNames.
  comments: false,

  // Do not apply general minification by default
  minified: false
}
```

## Supported targets

### Default Target

The default target is used when not running a test runner and when no other `target` was defined. This transpiles the code will the full feature set of `babel-preset-latest` so that the code should be able to run on all ES5-capable engines. As the compiled code does not contain any polyfills you might want to use `polyfill.io` or `babel-runtime` as needed.


### Modern Target

This is our current browserslist set-up for a so-called modern development stack.

```js
const modernTarget = {
  node: "8.2.0",
  electron: "1.6",
  browsers: [
    "Safari >= 10.1",
    "iOS >= 10.3",
    "Edge >= 15",
    "Chrome >= 59",
    "ChromeAndroid >= 59",
    "Firefox >= 53"
  ]
}
```

Using this preset setting is ideal during development to reduce overall amount of transpilation
to a useful minimum to test with pretty up-to-date environments and browsers. It allows you to
directly benefit from a lot of new features directly built-into Node v8.


### ES2015 Target

This follows the idea of https://angularjs.blogspot.de/2017/03/angular-400-now-available.html to offer
kind of a standardized `es2015` compatible package which could be used in relatively modern engines.
This is an alternative to our `modern` approach and keeps all ES2015 code exactly as is. It is
independent from any specific browser lists. This output configuration might be useful to e.g. offer
two different bundles of your application: one for classic browsers and one of es2015-compatible browsers.


### Test Target

The `test` target is ideally suited for any test runner usage. It is enabled by default when no other
target is given and `NODE_ENV` is configured as `test`. It exactly targets the current environment.
It is probably not a good idea to use this target outside of testing.


### Browser Target

When setting the target to `browser` your build requirements will match the `browserslist` configuration of your projects. This is ideal for all web related builds inside your application. It is not well suited for any publishing of libraries for other use cases.



## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://raw.githubusercontent.com/sebastian-software/readable-code/master/assets/sebastiansoftware.png" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
