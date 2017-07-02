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
- Support for new dynamic `import()` statement which is used for dynamic chunk creation in Webpack since version 2.
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
  // - {}: any custom settings support by Env-Preset
  target: "nodejs",

  // Choose automatically depending on target
  modules: "auto",

  // Env Settings
  looseMode: true,
  specMode: false,

  // Lodash Plugin Settings
  optimizeModules: [ "lodash", "async", "rambda", "recompose" ],

  // Configuration for module lookup
  sourceFolder: "src",

  // Source map output
  sourceMaps: true,

  // Babel Core Settings
  comments: false,
  compact: true,
  minified: true
}
```

## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://raw.githubusercontent.com/sebastian-software/readable-code/master/assets/sebastiansoftware.png" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
