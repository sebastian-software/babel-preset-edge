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
- High performance async/await transpilation using [Fast Async](https://github.com/MatAtBread/fast-async) and [nodeent](https://github.com/MatAtBread/nodent#performance)
- Support for dynamic `import()` statement which is used for dynamic chunk creation in Webpack (since version 2). Plus it adds support for dynamic CSS loading + automatic chunkNames.
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
  // - "node"/nodejs"/"script"/"binary": any NodeJS related execution with wide support to last LTS aka 6.9.0
  // - "current"/"test": current NodeJS version
  // - "browser"/"web": browsers as defined by browserslist
  // - "library": ideally used for publishing libraries e.g. on NPM
  // - "es2015": same as "library" but targets es2o15 capable engines only.
  // - "modern": same as "library" but targets modern engines only (slightly more forward-looking than es2015).
  // - {}: any custom settings support by Env-Preset
  target: "nodejs",

  // Choose environment based on environment variables ... or override with custom value here.
  env: "auto",

  // Choose automatically depending on target
  modules: "auto",

  // Choose automatically depending on target
  imports: "auto",

  // Prefer built-ins over custom code. This mainly benefits for modern engines.
  useBuiltIns: true,

  // JSX Pragma. Default: Use React
  jsxPragma: "React.createElement",

  // Env Settings
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

  // Keeping comments to be compatible with Webpack's magic comments
  // Comments are automatically re-enabled if Webpack Universal Imports are used for having correct chunkNames.
  comments: false,

  // Do not apply general minification by default
  minified: false
}
```


## ES2015 Target

Follow the idea of https://angularjs.blogspot.de/2017/03/angular-400-now-available.html to offer
kind of a standardized es2015 package which could be used in more modern browsers/clients. This
is an alternative to our "modern" approach which is more oriented on specific browser development
and requires some knowledge of the supported browser / nodejs range.
The "modern" mode effectively keeps source code with arrow functions, classes, etc. better.


## Modern Target

This is our current browserslist set-up for a so-called modern development stack.

```js
const modernTarget = {
  node: "6.9.0",
  electron: "1.6",
  browsers: [
    "Safari >= 10.1",
    "iOS >= 10.3",
    "Edge >= 15",
    "Chrome >= 58",
    "Firefox >= 53"
  ]
}
```

Using this preset setting is ideal during development to reduce overall amount of transpilation
to a useful minimum to test with pretty up-to-date environments and browsers.


## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://raw.githubusercontent.com/sebastian-software/readable-code/master/assets/sebastiansoftware.png" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
