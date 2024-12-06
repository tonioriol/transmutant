# Changelog

## [5.0.0](https://github.com/tonioriol/transmutant/compare/v4.0.0...v5.0.0) (2024-12-06)


### ⚠ BREAKING CHANGES

* The `extra` parameter in transmute() and related types has been renamed to `context` to better reflect its purpose in providing contextual data for transmutations. This change affects the public API including type definitions, function parameters, and documentation.

### Code Refactoring

* rename extra parameter to context ([b8ca220](https://github.com/tonioriol/transmutant/commit/b8ca22055c50d76dedc96e080acc8d377e4fab0c))

## [4.0.0](https://github.com/tonioriol/transmutant/compare/v3.1.0...v4.0.0) (2024-11-01)


### ⚠ BREAKING CHANGES

* **types:** Changed Extra type parameter default from unknown to undefined for better type inference and runtime behavior alignment.

### Code Refactoring

* **types:** switch Extra type parameter default to undefined ([83c5a56](https://github.com/tonioriol/transmutant/commit/83c5a563dc5ccd5d8e04d3f86e0dd139dae4a346))

## [3.1.0](https://github.com/tonioriol/transmutant/compare/v3.0.0...v3.1.0) (2024-10-31)


### Features

* **transmute:** infer transmuter context param based on transmute call ([c83b1c0](https://github.com/tonioriol/transmutant/commit/c83b1c0260d9d37e5b4e20b2417179379949795a))

## [3.0.0](https://github.com/tonioriol/transmutant/compare/v2.1.0...v3.0.0) (2024-10-31)


### ⚠ BREAKING CHANGES

* Schema type now enforces strict type compatibility between source and target properties. Code with mismatched types in direct property mappings will need to be updated to use Transmuter for type conversion or fix the type mismatch.

### Features

* enforce type compatibility in schema mappings ([cc26b94](https://github.com/tonioriol/transmutant/commit/cc26b94886fcef6a71ab1436d0c9438cab46f7b6))

## [2.1.0](https://github.com/tonioriol/transmutant/compare/v2.0.0...v2.1.0) (2024-10-30)


### Features

* enforce strict return types in transmuter functions ([bb575df](https://github.com/tonioriol/transmutant/commit/bb575dfd605934d76627867ed507567591c86317))

## [2.0.0](https://github.com/tonioriol/transmutant/compare/v1.0.1...v2.0.0) (2024-10-28)


### ⚠ BREAKING CHANGES

* made the usage of fn or `to` exclusive. So they can't used both at the same time now.

### Features

* improved type safety for context param ([f8247b1](https://github.com/tonioriol/transmutant/commit/f8247b1f9b098cc23efec30caec798be72d72d6a))

## [1.0.1](https://github.com/tonioriol/transmutant/compare/v1.0.0...v1.0.1) (2024-10-27)


### Bug Fixes

* trigger release ([2872d9f](https://github.com/tonioriol/transmutant/commit/2872d9f802207921fc665c7d23849323609e4957))

## 1.0.0 (2024-10-27)


### Features

* initial commit ([6998fba](https://github.com/tonioriol/transmutant/commit/6998fbac7a845161226f5d051225e93ef73d606d))
* rename ([ac7ea8d](https://github.com/tonioriol/transmutant/commit/ac7ea8d3efb866071e2ec0fe30c156b75034d501))
* working ([b52a177](https://github.com/tonioriol/transmutant/commit/b52a1777511ecb2b45e3e9e519639555908fd7cd))
