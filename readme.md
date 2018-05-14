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

- Prefers external polyfills and uses `@babel/runtime` for helpers instead of baked-in code which is especially beneficial for overall bundle sizes of applications.
- React and Flowtype support baked-in for transpiling JSX and removing non-standard Flowtype definitions.
- Optimizations for React during development (richer debug capabilities) and production (less code).
- Automatic environment specific ES2015/2016/2017 support using [Preset Env](https://github.com/babel/babel-preset-env)
- No transpilation of generators. Doing this produces relatively slow and complex code. We suggest using `async/await` when possible.
- High performance async/await transpilation using [Nodeent](https://github.com/MatAtBread/nodent#performance) making it available to older engines and browsers as well.
- Support for dynamic `import()` statement which is used for dynamic chunk creation in Webpack.
- Automatically naming of `import()` chunks + support for SSR.
- Local module support for easily referencing sources inside the `src` folder of the project using the [module resolver plugin](https://github.com/tleunen/babel-plugin-module-resolver).
- Support for converting often times used upcoming EcmaScript standards like class properties and object rest spread.
- [Lodash Plugin](https://github.com/lodash/babel-plugin-lodash) to allow cherry-picking of more tranditionally exported libraries like lodash, async, rambda and recompose.

## Defaults

These are our default options. They can be tweaked by passing the required options to the preset.

```js
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
```

## Supported targets

### Default Target

The default target is used when not running a test runner and when no other `target` was defined. This transpiles the code will the full feature set of `babel-preset-latest` so that the code should be able to run on all ES5-capable engines. As the compiled code does not contain any polyfills you might want to use `polyfill.io` any any alternative service.


### Modern Target

This is our current browserslist set-up for a so-called modern development stack.

```js
const modernTarget = {
  node: "8.9.0",
  electron: "1.8",
  browsers: [
    "Safari >= 11.1",
    "iOS >= 11.3",
    "Edge >= 16",
    "Chrome >= 64",
    "ChromeAndroid >= 64",
    "Firefox >= 58"
  ]
}
```

Using this preset setting is ideal during development to reduce overall amount of transpilation
to a useful minimum to test with pretty up-to-date environments and browsers. It allows you to
directly benefit from a lot of new features directly built-into Node v8 for example.


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

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/3d93746f/sebastiansoftware-en.svg" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017-2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
