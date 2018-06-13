# Babel Preset Edge<br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps] [![Tested with Jest][jest-img]][jest]

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
[jest-img]: https://facebook.github.io/jest/img/jest-badge.svg
[jest]: https://github.com/facebook/jest

Babel Preset Edge is a centralized modern Babel Configuration for React development.






## Key Features

- Babel v7 based. Get all the new glory, plugins and performance.
- Builds on [Preset-Env](https://github.com/babel/babel/tree/master/packages/babel-preset-env) to deal with targetted output, but making it way smarter by automatically supporting additional transpile settings like `esm`, `es2015` or `modern`. Externalizes helpers, prefers built-ins over inlined code and adds polyfills as needed by your code. Effectively following all best-practises.
- Automatic environment detection. In most cases you shouldn't require using `env` blocks in your `.babelrc` at all. Making things way simpler.
- Uses more flexible environment parameters to allow further settings via `EDGE_ENV` e.g. pass over `EDGE_ENV=development-es2015` to enable ES2015 output for development.
- Integrated React, JSX and Flowtype support. Plus support for often used features like [Class Properties](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-class-properties), [Object Rest Spread](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-object-rest-spread) and [Decorators](https://github.com/babel/babel/tree/master/packages/babel-plugin-proposal-decorators)
- Dynamic `import()` support with additional smartness: SSR handling via [Loadable Components](https://github.com/smooth-code/loadable-components), automatic chunk names via [Smart Webpack Import](https://github.com/sebastian-software/babel-plugin-smart-webpack-import) and automatic NodeJS convertion when targetting NodeJS.
- High Performance transpilation of `async/await` using [Fast Async](https://github.com/MatAtBread/fast-async) (converts to Promises) but only when required by output scenario. When using `modern` or `env` transpile or when inside a `test` you keep using the natively supported `async/await`.
- This preset does not offer any transpilation of generators. Doing this produces relatively slow and complex code. Sorry Redux-Saga.
- Local module support for easily referencing sources inside the `src` folder of the project using the [module resolver plugin](https://github.com/tleunen/babel-plugin-module-resolver).
- [Lodash Plugin](https://github.com/lodash/babel-plugin-lodash) to allow cherry-picking of more tranditionally exported libraries like lodash, async, rambda and recompose.
- [Babel Macros](https://www.npmjs.com/package/babel-plugin-macros) allows endless extensibility in user code by things like GraphQL parsing, pre-evaluation and more.
- Makes use of [Babel Minify](https://github.com/babel/minify) the preset is able to apply different levels of compression directly while transpiling. There is really no reason to publish dead code paths or keeping all super detailed comments in-tact for NPM packages. A minor compression is enabled by default. Full minification is activated in when using `minify:true` inside a `production` environment.




## Targets

### Universal Target

This is the default target. It produces code which is compatible with both NodeJS and browsers.

### Test Target

The `test` target is ideally suited for any test runner usage. It is enabled by default when no other
target is given and `NODE_ENV` is configured as `test`. It exactly targets the current environment.
It is probably not a good idea to use this target outside of testing.

### Browser Target

When setting the target to `browser` your build requirements will match the `browserslist` configuration of your projects. This is ideal for all web related builds inside your application. It is not well suited for any publishing of libraries for other use cases.

### Node Target

This uses the `engines/node` field from `package.json` to automatically bundle your code in a way that it matches the capabilities of the specified NodeJS version.




## Transpilation Settings

### Default Transpilation

The default is used when not running a test runner and when no other `transpile` was defined. Transpilation applies all features from `babel-preset-env` so that the code should be able to run on all ES5-capable engines. Ideally for publishing libs to NPM or bundling applications for the widest possible use case.

### ESM Transilation

This output target is meant for [making use of this idea by Jake Archibald](https://jakearchibald.com/2017/es-modules-in-browsers/#nomodule-for-backwards-compatibility). The idea is basically to use two different script tags. One for ESM capable browsers and another one for all legacy browsers. Transpilation output is somewhat identical to "ES2015+Async/Await" transpilation. As this is one is easier to deal with (on client-side) it's probably the better choice over `es2015` for browser modules. See also [Deploying ES2015+ Code in Production Today by Philip Walton](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)

### ES2015 Transpilation

This follows the idea of https://angularjs.blogspot.de/2017/03/angular-400-now-available.html to offer
kind of a standardized `es2015` compatible package which could be used in relatively modern engines.
This is independent from any specific browser lists. This configuration might be useful to e.g. offer
two different bundles of your application: one for classic browsers and one of es2015-compatible browsers.

### Modern Transpilation

This is our current set-up for a so-called modern development stack. It transpiles even less code than when using `es2015`.

```js
const modernTarget = {
  node: "8.9.0",
  electron: "2.0",
  browsers: [
    "Safari >= 11.1",
    "iOS >= 11.4",
    "Edge >= 16",
    "Chrome >= 66",
    "ChromeAndroid >= 66",
    "Firefox >= 60"
  ]
}
```

Using this setting is ideal during development to reduce overall amount of transpilation
to a useful minimum to test with pretty up-to-date environments and browsers. It allows you to
directly benefit from a lot of new features directly built-into Node v8 for example.



## Defaults + Options

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
// - "esm": Alternative to standard ES5 targetting only browsers which are capable of import ESM modules. This is probably the better solution for targetting browsers than the next option "es2015" as it targets quite the same browsers but does so in a way that we can use a simple duplicate script-tag to import either this or the default ES5 one. See also: https://jakearchibald.com/2017/es-modules-in-browsers/#nomodule-for-backwards-compatibility
// - "es2015": Alternative to standard ES5 reaching only modern engines and browsers which support at least all features of es2015. Might be a good alternative for publishing modern libraries to NPM or when using transpilation on all content - even `node_modules` in application code.
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




## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/3d93746f/sebastiansoftware-en.svg" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017-2018<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
