# Edge Babel<br/>[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps]

[sponsor-img]: https://img.shields.io/badge/Sponsored%20by-Sebastian%20Software-692446.svg
[sponsor]: https://www.sebastian-software.de
[deps]: https://david-dm.org/sebastian-software/edge-babel
[deps-img]: https://david-dm.org/sebastian-software/edge-babel.svg
[npm]: https://www.npmjs.com/package/edge-babel
[npm-downloads-img]: https://img.shields.io/npm/dm/edge-babel.svg
[npm-version-img]: https://img.shields.io/npm/v/edge-babel.svg
[travis-img]: https://img.shields.io/travis/sebastian-software/edge-babel/master.svg?branch=master&label=unix%20build
[appveyor-img]: https://img.shields.io/appveyor/ci/swernerx/edge-babel/master.svg?label=windows%20build
[travis]: https://travis-ci.org/sebastian-software/edge-babel
[appveyor]: https://ci.appveyor.com/project/swernerx/edge-babel/branch/master

Edge Babel is a centralized Babel Configuration. Part of the Edge Platform.



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



## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://raw.githubusercontent.com/sebastian-software/readable-code/master/assets/sebastiansoftware.png" alt="Sebastian Software GmbH Logo" width="250" height="200"/>

Copyright 2017<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
