# Babel Preset Edge

[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm] [![Build Status Unix][travis-img]][travis] [![Build Status Windows][appveyor-img]][appveyor] [![Dependencies][deps-img]][deps]

[sponsor]: https://www.sebastian-software.de
[deps]: https://david-dm.org/sebastian-software/babel-preset-edge
[npm]: https://www.npmjs.com/package/babel-preset-edge
[travis]: https://travis-ci.org/sebastian-software/babel-preset-edge
[appveyor]: https://ci.appveyor.com/project/swernerx/babel-preset-edge/branch/master

[sponsor-img]: https://badgen.net/badge/Sponsored%20by/Sebastian%20Software/692446
[deps-img]: https://badgen.net/david/dep/sebastian-software/babel-preset-edge
[npm-downloads-img]: https://badgen.net/npm/dm/babel-preset-edge
[npm-version-img]: https://badgen.net/npm/v/babel-preset-edge
[travis-img]: https://badgen.net/travis/sebastian-software/babel-preset-edge?label=unix%20build
[appveyor-img]: https://badgen.net/appveyor/ci/swernerx/babel-preset-edge?label=windows%20build

## A centralized Babel Configuration for modern React development

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Installation / Usage](#installation--usage)
- [Options](#options)
  - [Targets](#targets)
    - [Universal Target](#universal-target)
    - [Test Target](#test-target)
    - [Browser Target](#browser-target)
    - [Node Target](#node-target)
  - [Transpilation](#transpilation)
    - [Default Transpilation](#default-transpilation)
    - [ESM Transilation](#esm-transilation)
    - [ES2015 Transpilation](#es2015-transpilation)
    - [Modern Transpilation](#modern-transpilation)
  - [Defaults + Other Options](#defaults--other-options)
- [Edge Platform](#edge-platform)
- [License](#license)
- [Copyright](#copyright)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

> Babel-Preset-Edge could be described as the big brother of Babel-Preset-React-App (part of [Create React App](https://github.com/facebook/create-react-app)). Where the latter combines only a few basics, Babel-Preset-Edge is more innovative, flexible and automated.

Babel configurations start easily, but can quickly become complicated. Not to mention that everything that works has to be kept running for a while. Frequently this manual approach is very 🚨 time-consuming: combine all current Babel plugins in the correct order and update them regularly. This often involves copying and matching between different projects, teams and products. Babel-Preset-Edge offers a significant simplification here. One preset instead of your own manual configuration. Of course, this preset has settings, but it also does a lot automatically. Almost magical. 🧞 ‍

**TLDR 🎉: Babel v7 + One Dependency instead of Twenty + Environment Detection + React/JSX + Macros + Fast Async + Import Optimizations + Automatic Production Mode + Ready for ESM Script Tags + Smart Minification.**

- The preset is already based on [Babel v7](https://new.babeljs.io/), which is in its final stages before its release, but already offers enough stability for productive use.
- It uses [Babel-Preset-Env](https://babeljs.io/docs/en/babel-preset-env/) and automatically reads your browser list configuration. The presets and plug-ins that are used run in Loose mode by default, generating **more efficient code** than would be the case in very strict mode. In practical use this mode has proven itself and is sufficient, as long as one does not do very wacky things, completely.
- The preset also **automatically detects the NodeJS version** 🤓 based on the `engines` specification in your `package.json`.
- It provides factory support for **React and JSX**. Through the configuration options you can also use the preset for Preact.
- There are a few features that are often used, but not yet quite standard. These include **object-rest-spread**, **class properties**, and **decorators**. These three are of course automatically supported by the preset.
- There are always new ideas for language extensions. However, these are often not standard or are not even on their way to becoming standard. Here the solution of [Kent C. Dodds](https://github.com/kentcdodds) with macros is much better. Instead of completely filling the namespace with new functions, its solution provides for the import of a macro. The code is therefore also directly understandable for Linter etc. This is a much rounder solution for solutions such as optimizing deep object accesses with `idx` or parsing GraphQL queries with `gql`.
- The preset does without the translation of generators. This has always been a half-baked solution with insanely complex and slow code. Furthermore, [Fast-Async](https://github.com/MatAtBread/fast-async) is a much better solution for the translation of Async/Await. 🏃 Way faster output code. And the best thing is that this only works if the target for which the translation is being made really needs it.
- To make output code as compact as possible and imports as efficient as possible, the preset **rewrites imports from common utility libraries** such as Lodash, Rambda and Async so that they are better captured and optimally bundled by the tree shaking of the webpack and rollup.
- With the built-in "modern" transpile mode, you can translate directly for the development of the software only for modern systems. That makes everything faster. And easier to debug often too. We recommend to use this mode during development.
- With EcmaScript modules, there is now the option in the browser to offer two differently translated versions using different script tags. With the "esm" transpile mode, this is also directly built into the preset.
- Babel-Preset-Edge automatically detects from the `NODE_ENV` variable that it is currently in a unit test. This is used directly to translate only for the current engine.
- Speaking of `NODE_ENV`. This can of course also be set to `production`. This already optimizes some things on the transpilation level. For example, the code minifier is more aggressive and some typical development constructs like PropTypes in React are expanded. In any case, even in development, the preset **automatically removes dead branches of code and performs other optimizations** on the fly. There is really no reason to get the complete code when publishing to NPM. There are SourceMaps and with great solutions like the [SourceMapLoader from Webpack](https://github.com/webpack-contrib/source-map-loader) we can even look right through the sources.
- And last but not least: We have built tests into the preset - of course - and can thus ensure to some extent that by updating the individual parts the whole thing continues to work. Who makes serious regression tests of the transpiler within their own application?


## Installation / Usage

This is how you install it using NPM:

```
npm install -D babel-preset-edge
npm install core-js@3 @babel/runtime
```

and this is how your `.babelrc` looks afterwards:

```js
{
  "presets": [
    [ "edge", {
      // options
    }]
  ]
}
```

Note: As you can see you need both `core-js` (Required Polyfills) and `@babel/runtime` (Babel Helpers e.g. `inherits` for ES5 classes) for correctly supporting the generated code. These are real dependencies, not just dev-dependencies of your distribution code.


## Options

### Targets

#### Universal Target

This is the default target. It produces code which is compatible with both NodeJS and browsers.

#### Test Target

The `test` target is ideally suited for any test runner usage. It is enabled by default when no other target is given and `NODE_ENV` is configured as `test`. It exactly targets the current environment. It is probably not a good idea to use this target outside of testing.

#### Browser Target

When setting the target to `browser` your build requirements will match the `browserslist` configuration of your projects. This is ideal for all web related builds inside your application. It is not well suited for any publishing of libraries for other use cases.

#### Node Target

This uses the `engines/node` field from `package.json` to automatically bundle your code in a way that it matches the capabilities of the specified NodeJS version.




### Transpilation

#### Default Transpilation

The default is used when not running a test runner and when no other `transpile` was defined. Transpilation applies all features from `babel-preset-env` so that the code should be able to run on all ES5-capable engines. Ideally for publishing libs to NPM or bundling applications for the widest possible use case.

#### ESM Transilation

This output target is meant for [making use of this idea by Jake Archibald](https://jakearchibald.com/2017/es-modules-in-browsers/#nomodule-for-backwards-compatibility). The idea is basically to use two different script tags. One for ESM capable browsers and another one for all legacy browsers. Transpilation output is somewhat identical to "ES2015+Async/Await" transpilation. As this is one is easier to deal with (on client-side) it's probably the better choice over `es2015` for browser modules. See also [Deploying ES2015+ Code in Production Today by Philip Walton](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/)

#### ES2015 Transpilation

This follows the idea of https://angularjs.blogspot.de/2017/03/angular-400-now-available.html to offer
kind of a standardized `es2015` compatible package which could be used in relatively modern engines.
This is independent from any specific browser lists. This configuration might be useful to e.g. offer
two different bundles of your application: one for classic browsers and one of es2015-compatible browsers.

#### Modern Transpilation

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



### Defaults + Other Options

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



## Edge Platform

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/8d89acc9/edge.svg" width="250"/>

If you like this: This preset is part of a larger whole. We use it primarily within our [Edge Platform](https://github.com/sebastian-software/edge). If you are also developing React applications, have a look around. There are not only Babel configurations, but also Jest-presets, webpack tools, libraries to improve the localization possibilities in React, helpful extensions for the Express Server and more. We design this, of course, for optimal interaction. However, most solutions can also be used individually.


## License

[Apache License Version 2.0, January 2004](license)

## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/0d4ec9d6/sebastiansoftware-en.svg" alt="Logo of Sebastian Software GmbH, Mainz, Germany" width="460" height="160"/>

Copyright 2017-2019<br/>[Sebastian Software GmbH](http://www.sebastian-software.de)
